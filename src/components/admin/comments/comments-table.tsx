"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
    IconCheck,
    IconX,
    IconTrash,
    IconLoader2,
    IconExternalLink,
    IconCornerDownRight,
    IconUserOff,
} from "@tabler/icons-react";
import type { CommentStatus } from "@prisma/client";
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
import {
    setCommentStatus,
    deleteComment,
    type CommentRow,
} from "@/app/(admin)/dashboard/comments/actions";

const STATUS_CONFIG: Record<
    CommentStatus,
    { label: string; variant: "default" | "secondary" | "destructive" }
> = {
    PENDING: { label: "En attente", variant: "secondary" },
    APPROVED: { label: "Approuvé", variant: "default" },
    REJECTED: { label: "Rejeté", variant: "destructive" },
};

export function CommentsTable({ comments }: { comments: CommentRow[] }) {
    const [pending, startTransition] = useTransition();
    const [deleting, setDeleting] = useState<CommentRow | null>(null);

    function moderate(comment: CommentRow, status: CommentStatus) {
        startTransition(async () => {
            try {
                await setCommentStatus(comment.id, status);
                toast.success(
                    status === "APPROVED"
                        ? "Commentaire approuvé et publié."
                        : "Commentaire rejeté.",
                );
            } catch (err) {
                toast.error(
                    err instanceof Error
                        ? err.message
                        : "L'action a échoué.",
                );
            }
        });
    }

    function handleDelete() {
        if (!deleting) return;
        const target = deleting;
        startTransition(async () => {
            try {
                await deleteComment(target.id);
                toast.success("Commentaire supprimé.");
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

    if (comments.length === 0) {
        return (
            <p className="py-12 text-center text-sm text-muted-foreground">
                Aucun commentaire ne correspond à ces critères.
            </p>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Auteur</TableHead>
                        <TableHead>Commentaire</TableHead>
                        <TableHead>Article</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-32" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {comments.map((comment) => {
                        const cfg = STATUS_CONFIG[comment.status];
                        return (
                            <TableRow key={comment.id}>
                                <TableCell className="align-top">
                                    <p className="flex items-center gap-1.5 text-sm font-medium">
                                        {comment.authorName}
                                        {comment.isGuest && (
                                            <IconUserOff
                                                size={12}
                                                className="text-muted-foreground"
                                                aria-label="Invité"
                                            />
                                        )}
                                    </p>
                                    {comment.authorEmail && (
                                        <p className="text-xs text-muted-foreground">
                                            {comment.authorEmail}
                                        </p>
                                    )}
                                </TableCell>

                                <TableCell className="max-w-sm align-top">
                                    <p className="flex items-start gap-1.5 text-sm">
                                        {comment.isReply && (
                                            <IconCornerDownRight
                                                size={13}
                                                className="mt-1 shrink-0 text-muted-foreground"
                                                aria-label="Réponse"
                                            />
                                        )}
                                        <span className="line-clamp-3 whitespace-pre-line">
                                            {comment.content}
                                        </span>
                                    </p>
                                </TableCell>

                                <TableCell className="align-top">
                                    <Link
                                        href={`/blog/${comment.post.slug}`}
                                        target="_blank"
                                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <span className="line-clamp-1 max-w-[10rem]">
                                            {comment.post.title}
                                        </span>
                                        <IconExternalLink
                                            size={12}
                                            className="shrink-0"
                                        />
                                    </Link>
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
                                    }).format(comment.createdAt)}
                                </TableCell>

                                <TableCell className="align-top">
                                    <div className="flex items-center justify-end gap-1">
                                        {comment.status !== "APPROVED" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-green-600 hover:bg-green-500/10 hover:text-green-600 dark:text-green-400"
                                                disabled={pending}
                                                onClick={() =>
                                                    moderate(comment, "APPROVED")
                                                }
                                                aria-label="Approuver"
                                            >
                                                <IconCheck size={15} />
                                            </Button>
                                        )}
                                        {comment.status !== "REJECTED" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                disabled={pending}
                                                onClick={() =>
                                                    moderate(comment, "REJECTED")
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
                                            onClick={() => setDeleting(comment)}
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
                        <AlertDialogTitle>
                            Supprimer ce commentaire ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible et supprimera aussi
                            toutes les réponses à ce commentaire. Pour le
                            masquer sans le perdre, préférez le rejet.
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
