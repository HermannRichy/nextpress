import type { Metadata } from "next";
import Link from "next/link";
import type { PostStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getPosts } from "./actions";
import { PostsTable } from "@/components/admin/posts/posts-table";
import { PostsFilters } from "@/components/admin/posts/posts-filters";

export const metadata: Metadata = { title: "Posts" };

interface PageProps {
    searchParams: Promise<{
        status?: string;
        author?: string;
        category?: string;
    }>;
}

export default async function PostsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const validStatuses: PostStatus[] = ["DRAFT", "REVIEW", "PUBLISHED"];
    const status = validStatuses.includes(params.status as PostStatus)
        ? (params.status as PostStatus)
        : undefined;

    const [posts, categories, authors] = await Promise.all([
        getPosts({
            status,
            authorId: params.author || undefined,
            categoryId: params.category || undefined,
        }),
        prisma.postCategory.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
        prisma.user.findMany({
            where: { role: { in: ["ADMIN", "EDITOR"] } },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ]);

    return (
        <section className="space-y-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Posts</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {posts.length} post{posts.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/posts/new">
                        <IconPlus size={16} className="mr-2" />
                        Nouveau post
                    </Link>
                </Button>
            </header>

            <PostsFilters categories={categories} authors={authors} />

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <PostsTable posts={posts} />
            </div>
        </section>
    );
}
