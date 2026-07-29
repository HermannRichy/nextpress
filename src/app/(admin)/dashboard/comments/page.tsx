import type { Metadata } from "next";
import type { CommentStatus } from "@prisma/client";
import { getComments, getCommentCounts } from "./actions";
import { CommentsTable } from "@/components/admin/comments/comments-table";
import { ModerationStatusFilter } from "@/components/admin/comments/comments-filters";

export const metadata: Metadata = { title: "Commentaires" };

const STATUSES: CommentStatus[] = ["PENDING", "APPROVED", "REJECTED"];

interface PageProps {
    searchParams: Promise<{ status?: string }>;
}

export default async function CommentsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const status = STATUSES.includes(params.status as CommentStatus)
        ? (params.status as CommentStatus)
        : undefined;

    const [comments, counts] = await Promise.all([
        getComments({ status }),
        getCommentCounts(),
    ]);

    return (
        <section className="space-y-6">
            <header>
                <h1 className="text-2xl font-semibold">Commentaires</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {counts.pending > 0
                        ? `${counts.pending} en attente de modération sur ${counts.total}.`
                        : `${counts.total} commentaire${counts.total !== 1 ? "s" : ""}, rien en attente.`}
                </p>
            </header>

            <ModerationStatusFilter />

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <CommentsTable comments={comments} />
            </div>
        </section>
    );
}
