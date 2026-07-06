import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/app/(admin)/dashboard/settings/actions";
import { PostCard, type PostCardData } from "@/components/public/post-card";
import { Badge } from "@/components/ui/badge";

export const revalidate = 300;

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    return prisma.post.findUnique({
        where: { slug, status: "PUBLISHED" },
        include: {
            author: { select: { name: true, image: true } },
            categories: {
                include: { category: { select: { id: true, name: true, slug: true } } },
            },
            tags: {
                include: { tag: { select: { id: true, name: true } } },
            },
        },
    });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()]);
    if (!post) return {};

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || undefined,
        robots: { index: true, follow: true },
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || undefined,
            type: "article",
            publishedTime: post.publishedAt?.toISOString(),
            authors: [post.author.name],
            siteName: settings.siteName,
            ...(post.featuredImage && { images: [{ url: post.featuredImage }] }),
        },
    };
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) notFound();

    const firstCategoryId = post.categories[0]?.category.id;

    const related = await prisma.post.findMany({
        where: {
            status: "PUBLISHED",
            id: { not: post.id },
            ...(firstCategoryId && {
                categories: { some: { categoryId: firstCategoryId } },
            }),
        },
        include: {
            author: { select: { name: true, image: true } },
            categories: {
                include: { category: { select: { name: true, slug: true } } },
            },
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
    });

    const relatedSerialized: PostCardData[] = related.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        featuredImage: p.featuredImage,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        author: { name: p.author.name, image: p.author.image },
        categories: p.categories.map((c) => ({
            category: { name: c.category.name, slug: c.category.slug },
        })),
    }));

    const publishedDate = post.publishedAt
        ? new Intl.DateTimeFormat("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
          }).format(post.publishedAt)
        : null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Breadcrumb */}
            <nav
                className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
                aria-label="Fil d'Ariane"
            >
                <Link
                    href="/blog"
                    className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                    <IconChevronLeft size={14} aria-hidden />
                    Blog
                </Link>
                {post.categories[0] && (
                    <>
                        <span aria-hidden>·</span>
                        <Link
                            href={`/blog?category=${post.categories[0].category.slug}`}
                            className="hover:text-foreground transition-colors"
                        >
                            {post.categories[0].category.name}
                        </Link>
                    </>
                )}
            </nav>

            <article>
                {/* Article header */}
                <header className="space-y-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {post.categories.map(({ category }) => (
                            <Link key={category.id} href={`/blog?category=${category.slug}`}>
                                <Badge variant="secondary">{category.name}</Badge>
                            </Link>
                        ))}
                    </div>

                    <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {post.author.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={post.author.image}
                                alt={post.author.name}
                                className="w-7 h-7 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                {post.author.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span>{post.author.name}</span>
                        {publishedDate && (
                            <>
                                <span aria-hidden>·</span>
                                <time dateTime={post.publishedAt?.toISOString()}>
                                    {publishedDate}
                                </time>
                            </>
                        )}
                    </div>
                </header>

                {/* Featured image */}
                {post.featuredImage && (
                    <figure className="mb-8 -mx-4 sm:mx-0 sm:rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full aspect-video object-cover"
                        />
                    </figure>
                )}

                {/* Rich text content */}
                <div
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                    <footer className="mt-8 pt-6 border-t border-border">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(({ tag }) => (
                                <Badge key={tag.id} variant="outline">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    </footer>
                )}
            </article>

            {/* Related posts */}
            {relatedSerialized.length > 0 && (
                <aside className="mt-16 pt-8 border-t border-border">
                    <h2 className="text-lg font-semibold mb-6">Articles similaires</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {relatedSerialized.map((p) => (
                            <PostCard key={p.slug} post={p} />
                        ))}
                    </div>
                </aside>
            )}
        </div>
    );
}
