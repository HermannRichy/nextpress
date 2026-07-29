import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "../settings/actions";
import { getCoupons } from "./actions";
import { CouponsTable } from "@/components/admin/coupons/coupons-table";

export const metadata: Metadata = { title: "Coupons" };

export default async function CouponsPage() {
    const [coupons, products, categories, settings] = await Promise.all([
        getCoupons(),
        prisma.product.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
            take: 200,
        }),
        prisma.productCategory.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
        getSiteSettings(),
    ]);

    return (
        <section className="space-y-6">
            <header>
                <h1 className="text-2xl font-semibold">Coupons</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Codes promo, conditions d&apos;application et fenêtres de
                    validité.
                </p>
            </header>

            <CouponsTable
                coupons={coupons}
                products={products}
                categories={categories}
                currency={settings.currency}
            />
        </section>
    );
}
