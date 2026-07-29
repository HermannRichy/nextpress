import type { Metadata } from "next";
import { getSiteSettings } from "../settings/actions";
import { getShippingZones, getPickupPoints } from "./actions";
import { ShippingTabs } from "@/components/admin/shipping/shipping-tabs";

export const metadata: Metadata = { title: "Livraison" };

export default async function ShippingPage() {
    const [zones, points, settings] = await Promise.all([
        getShippingZones(),
        getPickupPoints(),
        getSiteSettings(),
    ]);

    return (
        <section>
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">Livraison</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Secteurs livrés et points de retrait proposés au moment du
                    paiement.
                </p>
            </header>

            <ShippingTabs
                zones={zones}
                points={points}
                currency={settings.currency}
            />
        </section>
    );
}
