import Link from "next/link";
import { getSiteSettings } from "@/app/(admin)/dashboard/settings/actions";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const settings = await getSiteSettings();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="font-semibold text-lg hover:text-primary transition-colors truncate"
                    >
                        {settings.siteName}
                    </Link>
                    <nav aria-label="Navigation principale">
                        <Link
                            href="/blog"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Blog
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border bg-muted/30 py-8">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-1">
                    <p className="text-sm font-semibold">{settings.siteName}</p>
                    {settings.slogan && (
                        <p className="text-xs text-muted-foreground">{settings.slogan}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} {settings.siteName}
                    </p>
                </div>
            </footer>
        </div>
    );
}
