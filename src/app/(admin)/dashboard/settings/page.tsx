import type { Metadata } from "next";
import { getSiteSettings } from "./actions";
import { SettingsTabs } from "@/components/admin/settings/settings-tabs";

export const metadata: Metadata = { title: "Réglages" };

export default async function SettingsPage() {
    const settings = await getSiteSettings();
    return (
        <section>
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">Réglages du site</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Configurez votre site, les intégrations et les options avancées.
                </p>
            </header>
            <SettingsTabs settings={settings} />
        </section>
    );
}
