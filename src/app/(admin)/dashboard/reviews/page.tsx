import type { Metadata } from "next";
import type { ReviewStatus } from "@prisma/client";
import { getReviews, getReviewStats } from "./actions";
import { ReviewsTable } from "@/components/admin/reviews/reviews-table";
import { RatingFilter } from "@/components/admin/reviews/reviews-filters";
import { ModerationStatusFilter } from "@/components/admin/comments/comments-filters";
import { RatingStars } from "@/components/public/rating-stars";

export const metadata: Metadata = { title: "Avis" };

const STATUSES: ReviewStatus[] = ["PENDING", "APPROVED", "REJECTED"];

interface PageProps {
    searchParams: Promise<{ status?: string; rating?: string }>;
}

export default async function ReviewsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const status = STATUSES.includes(params.status as ReviewStatus)
        ? (params.status as ReviewStatus)
        : undefined;
    const parsedRating = Number(params.rating);
    const rating =
        Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
            ? parsedRating
            : undefined;

    const [reviews, stats] = await Promise.all([
        getReviews({ status, rating }),
        getReviewStats(),
    ]);

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Avis produits</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {stats.pending > 0
                            ? `${stats.pending} en attente de modération sur ${stats.total}.`
                            : `${stats.total} avis, rien en attente.`}
                    </p>
                </div>

                {stats.total > 0 && (
                    <div className="rounded-xl border border-border bg-card px-4 py-3 text-right">
                        <p className="text-xs text-muted-foreground">
                            Note moyenne publiée
                        </p>
                        <p className="mt-0.5 flex items-center justify-end gap-2">
                            <span className="text-xl font-semibold">
                                {stats.average.toFixed(1)}
                            </span>
                            <RatingStars value={stats.average} size={15} />
                        </p>
                    </div>
                )}
            </header>

            <ModerationStatusFilter extra={<RatingFilter />} />

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <ReviewsTable reviews={reviews} />
            </div>
        </section>
    );
}
