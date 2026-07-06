import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface PostCardData {
    slug: string;
    title: string;
    excerpt: string | null;
    featuredImage: string | null;
    publishedAt: string | null;
    author: { name: string; image: string | null };
    categories: { category: { name: string; slug: string } }[];
}

export function PostCard({ post }: { post: PostCardData }) {
    const mainCategory = post.categories[0]?.category;
    const date = post.publishedAt
        ? new Intl.DateTimeFormat("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
          }).format(new Date(post.publishedAt))
        : null;

    return (
        <article className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden>
                <div className="aspect-video bg-muted overflow-hidden">
                    {post.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                    )}
                </div>
            </Link>

            <div className="flex flex-col flex-1 p-4 gap-2.5">
                {mainCategory && (
                    <Badge variant="secondary" className="w-fit text-xs">
                        {mainCategory.name}
                    </Badge>
                )}

                <Link href={`/blog/${post.slug}`}>
                    <h2 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                </Link>

                {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {post.excerpt}
                    </p>
                )}

                <footer className="flex items-center gap-2 pt-1 mt-auto">
                    {post.author.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={post.author.image}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {post.author.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="text-xs text-muted-foreground">{post.author.name}</span>
                    {date && (
                        <>
                            <span className="text-xs text-muted-foreground">·</span>
                            <time
                                className="text-xs text-muted-foreground"
                                dateTime={post.publishedAt ?? undefined}
                            >
                                {date}
                            </time>
                        </>
                    )}
                </footer>
            </div>
        </article>
    );
}
