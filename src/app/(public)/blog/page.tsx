import type { Metadata } from "next";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/app/(admin)/dashboard/settings/actions";
import { PostCard, type PostCardData } from "@/components/public/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

const PER_PAGE = 9;

interface PageProps {
    searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Blog — ${settings.siteName}`,
        description: settings.seoDescription || settings.description || undefined,
        robots: { index: true, follow: true },
    };
}

export default async function BlogPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page ?? "1", 10));
    const categorySlug = params.category ?? "";

    const [settings, categories, rawPosts] = await Promise.all([
        getSiteSettings(),
        prisma.postCategory.findMany({
            select: { id: true, name: true, slug: true },
            orderBy: { name: "asc" },
        }),
        prisma.post.findMany({
            where: {
                status: "PUBLISHED",
                ...(categorySlug && {
                    categories: { some: { category: { slug: categorySlug } } },
                }),
            },
            include: {
                author: { select: { name: true, image: true } },
                categories: {
                    include: { category: { select: { name: true, slug: true } } },
                },
            },
            orderBy: { publishedAt: "desc" },
            skip: (page - 1) * PER_PAGE,
            take: PER_PAGE + 1,
        }),
    ]);

    const hasNext = rawPosts.length > PER_PAGE;
    const hasPrev = page > 1;
    const posts = rawPosts.slice(0, PER_PAGE);

    const serialized: PostCardData[] = posts.map((p) => ({
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

    function pageUrl(p: number, cat?: string) {
        const qs = new URLSearchParams();
        if (cat) qs.set("category", cat);
        if (p > 1) qs.set("page", String(p));
        return `/blog${qs.size ? "?" + qs.toString() : ""}`;
    }

    return (
        <>
            {/* Hero */}
            <section className="border-b border-border bg-muted/30 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold">Blog</h1>
                    {settings.description && (
                        <p className="text-muted-foreground mt-2 max-w-xl">{settings.description}</p>
                    )}
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
                {/* Category filter */}
                {categories.length > 0 && (
                    <nav className="flex flex-wrap gap-2" aria-label="Filtrer par catégorie">
                        <Link href="/blog">
                            <Badge variant={!categorySlug ? "default" : "outline"}>Tous</Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat.id} href={pageUrl(1, cat.slug)}>
                                <Badge
                                    variant={categorySlug === cat.slug ? "default" : "outline"}
                                >
                                    {cat.name}
                                </Badge>
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Grid */}
                {serialized.length === 0 ? (
                    <p className="text-muted-foreground text-center py-16">
                        Aucun article{categorySlug ? " dans cette catégorie" : ""} pour l&apos;instant.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {serialized.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {(hasPrev || hasNext) && (
                    <nav
                        className="flex items-center justify-between pt-4"
                        aria-label="Pagination des articles"
                    >
                        {hasPrev ? (
                            <Button variant="outline" asChild>
                                <Link href={pageUrl(page - 1, categorySlug || undefined)}>
                                    <IconChevronLeft size={16} className="mr-1" />
                                    Précédent
                                </Link>
                            </Button>
                        ) : (
                            <div />
                        )}
                        <span className="text-sm text-muted-foreground">Page {page}</span>
                        {hasNext ? (
                            <Button variant="outline" asChild>
                                <Link href={pageUrl(page + 1, categorySlug || undefined)}>
                                    Suivant
                                    <IconChevronRight size={16} className="ml-1" />
                                </Link>
                            </Button>
                        ) : (
                            <div />
                        )}
                    </nav>
                )}
            </section>
        </>
    );
}
