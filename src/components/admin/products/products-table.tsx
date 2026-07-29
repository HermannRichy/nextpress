"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconTrash,
    IconLoader2,
    IconPhoto,
} from "@tabler/icons-react";
import type { ProductStatus } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { formatPrice } from "@/lib/currency";
import {
    deleteProduct,
    updateProductStatus,
    type ProductRow,
} from "@/app/(admin)/dashboard/products/actions";

const STATUS_CONFIG: Record<
    ProductStatus,
    { label: string; variant: "default" | "secondary" | "outline" }
> = {
    DRAFT: { label: "Brouillon", variant: "secondary" },
    REVIEW: { label: "En révision", variant: "outline" },
    PUBLISHED: { label: "Publié", variant: "default" },
};

const NEXT_STATUS: Record<ProductStatus, { status: ProductStatus; label: string }[]> = {
    DRAFT: [{ status: "REVIEW", label: "Soumettre en révision" }],
    REVIEW: [
        { status: "PUBLISHED", label: "Publier" },
        { status: "DRAFT", label: "Remettre en brouillon" },
    ],
    PUBLISHED: [{ status: "DRAFT", label: "Dépublier" }],
};

/** Badges de stock de la spec 3.4 : rupture, stock faible, en stock. */
function stockBadge(stock: number, threshold: number) {
    if (stock <= 0) {
        return {
            label: "Rupture",
            className:
                "bg-destructive/10 text-destructive border-destructive/20",
        };
    }
    if (stock <= threshold) {
        return {
            label: `Stock faible (${stock})`,
            className:
                "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        };
    }
    return {
        label: `En stock (${stock})`,
        className:
            "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    };
}

interface ProductsTableProps {
    products: ProductRow[];
    currency: string;
}

export function ProductsTable({ products, currency }: ProductsTableProps) {
    const [pending, startTransition] = useTransition();
    const [deleting, setDeleting] = useState<ProductRow | null>(null);

    function handleStatusChange(id: string, status: ProductStatus) {
        startTransition(async () => {
            try {
                await updateProductStatus(id, status);
                toast.success("Statut mis à jour.");
            } catch (err) {
                toast.error(
                    err instanceof Error
                        ? err.message
                        : "La mise à jour a échoué.",
                );
            }
        });
    }

    function handleDelete() {
        if (!deleting) return;
        const target = deleting;
        startTransition(async () => {
            try {
                await deleteProduct(target.id);
                toast.success(`« ${target.name} » supprimé.`);
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

    if (products.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-12 text-center">
                Aucun produit.{" "}
                <Link
                    href="/dashboard/products/new"
                    className="text-primary hover:underline"
                >
                    Créer le premier.
                </Link>
            </p>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-14" />
                        <TableHead>Nom</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Catégories</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="w-10" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => {
                        const cfg = STATUS_CONFIG[product.status];
                        const stock = stockBadge(
                            product.stock,
                            product.lowStockThreshold,
                        );
                        return (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <IconPhoto
                                                size={16}
                                                className="text-muted-foreground"
                                            />
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="font-medium max-w-xs truncate">
                                    <Link
                                        href={`/dashboard/products/${product.id}`}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {product.name}
                                    </Link>
                                </TableCell>

                                <TableCell className="whitespace-nowrap text-sm">
                                    {product.promoPrice != null ? (
                                        <span className="flex items-center gap-1.5">
                                            <span className="font-medium">
                                                {formatPrice(
                                                    product.promoPrice,
                                                    currency,
                                                )}
                                            </span>
                                            <s className="text-xs text-muted-foreground">
                                                {formatPrice(
                                                    product.price,
                                                    currency,
                                                )}
                                            </s>
                                        </span>
                                    ) : (
                                        formatPrice(product.price, currency)
                                    )}
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={stock.className}
                                    >
                                        {stock.label}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {product.categories.length === 0 ? (
                                            <span className="text-xs text-muted-foreground">
                                                —
                                            </span>
                                        ) : (
                                            product.categories
                                                .slice(0, 2)
                                                .map((c) => (
                                                    <Badge
                                                        key={c.id}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {c.name}
                                                    </Badge>
                                                ))
                                        )}
                                        {product.categories.length > 2 && (
                                            <span className="text-xs text-muted-foreground">
                                                +{product.categories.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge variant={cfg.variant}>
                                        {cfg.label}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label={`Actions pour ${product.name}`}
                                            >
                                                <IconDotsVertical size={15} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-52"
                                        >
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/dashboard/products/${product.id}`}
                                                >
                                                    <IconEdit
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    Modifier
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/product/${product.slug}`}
                                                    target="_blank"
                                                >
                                                    <IconEye
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    Voir
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />
                                            {NEXT_STATUS[product.status].map(
                                                ({ status, label }) => (
                                                    <DropdownMenuItem
                                                        key={status}
                                                        disabled={pending}
                                                        onSelect={() =>
                                                            handleStatusChange(
                                                                product.id,
                                                                status,
                                                            )
                                                        }
                                                    >
                                                        {label}
                                                    </DropdownMenuItem>
                                                ),
                                            )}

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() =>
                                                    setDeleting(product)
                                                }
                                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                            >
                                                <IconTrash
                                                    size={14}
                                                    className="mr-2"
                                                />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                            Supprimer « {deleting?.name} » ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le produit, ses
                            variantes et ses avis seront définitivement
                            supprimés.
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
