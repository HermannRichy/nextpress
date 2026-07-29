"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
    IconCheck,
    IconX,
    IconTrash,
    IconLoader2,
    IconExternalLink,
} from "@tabler/icons-react";
import type { ReviewStatus } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RatingStars } from "@/components/public/rating-stars";
import {
    setReviewStatus,
    deleteReview,
    type ReviewRow,
} from "@/app/(admin)/dashboard/reviews/actions";

const STATUS_CONFIG: Record<
    ReviewStatus,
    { label: string; variant: "default" | "secondary" | "destructive" }
> = {
    PENDING: { label: "En attente", variant: "secondary" },
    APPROVED: { label: "Approuvé", variant: "default" },
    REJECTED: { label: "Rejeté", variant: "destructive" },
};

export function ReviewsTable({ reviews }: { reviews: ReviewRow[] }) {
    const [pending, startTransition] = useTransition();
    const [deleting, setDeleting] = useState<ReviewRow | null>(null);

    function moderate(review: ReviewRow, status: ReviewStatus) {
        startTransition(async () => {
            try {
                await setReviewStatus(review.id, status);
                toast.success(
                    status === "APPROVED"
                        ? "Avis approuvé et publié."
                        : "Avis rejeté.",
                );
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : "L'action a échoué.",
                );
            }
        });
    }

    function handleDelete() {
        if (!deleting) return;
        const target = deleting;
        startTransition(async () => {
            try {
                await deleteReview(target.id);
                toast.success("Avis supprimé.");
                setDeleting(null);
            } catch (err) {
                toast.error(
                    err instanceof Error
                        ? err.message
                        : "La suppression a échoué.",
                );
            }
        });
    }

    if (reviews.length === 0) {
        return (
            <p className="py-12 text-center text-sm text-muted-foreground">
                Aucun avis ne correspond à ces critères.
            </p>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Auteur</TableHead>
                        <TableHead className="w-28">Note</TableHead>
                        <TableHead>Commentaire</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-32" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.map((review) => {
                        const cfg = STATUS_CONFIG[review.status];
                        return (
                            <TableRow key={review.id}>
                                <TableCell className="align-top">
                                    <Link
                                        href={`/product/${review.product.slug}`}
                                        target="_blank"
                                        className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                                    >
                                        <span className="line-clamp-1 max-w-[10rem]">
                                            {review.product.name}
                                        </span>
                                        <IconExternalLink
                                            size={12}
                                            className="shrink-0 text-muted-foreground"
                                        />
                                    </Link>
                                </TableCell>

                                <TableCell className="align-top">
                                    <p className="text-sm">
                                        {review.authorName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {review.authorEmail}
                                    </p>
                                </TableCell>

                                <TableCell className="align-top">
                                    <RatingStars value={review.rating} />
                                </TableCell>

                                <TableCell className="max-w-sm align-top">
                                    {review.comment ? (
                                        <p className="line-clamp-3 whitespace-pre-line text-sm">
                                            {review.comment}
                                        </p>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            — note seule
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell className="align-top">
                                    <Badge variant={cfg.variant}>
                                        {cfg.label}
                                    </Badge>
                                </TableCell>

                                <TableCell className="whitespace-nowrap align-top text-xs text-muted-foreground">
                                    {new Intl.DateTimeFormat("fr-FR", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(review.createdAt)}
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex items-center justify-end gap-1">
                                        {review.status !== "APPROVED" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-green-600 hover:bg-green-500/10 hover:text-green-600 dark:text-green-400"
                                                disabled={pending}
                                                onClick={() =>
                                                    moderate(review, "APPROVED")
                                                }
                                                aria-label="Approuver"
                                            >
                                                <IconCheck size={15} />
                                            </Button>
                                        )}
                                        {review.status !== "REJECTED" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                disabled={pending}
                                                onClick={() =>
                                                    moderate(review, "REJECTED")
                                                }
                                                aria-label="Rejeter"
                                            >
                                                <IconX size={15} />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            disabled={pending}
                                            onClick={() => setDeleting(review)}
                                            aria-label="Supprimer"
                                        >
                                            <IconTrash size={15} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <AlertDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Pour le masquer sans
                            le perdre, préférez le rejet. La suppression est le
                            seul moyen de permettre à l&apos;auteur de déposer un
                            nouvel avis sur ce produit.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={pending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {pending && (
                                <IconLoader2
                                    size={14}
                                    className="mr-1.5 animate-spin"
                                />
                            )}
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
