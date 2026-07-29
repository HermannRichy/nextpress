import Link from "next/link";
import { IconShoppingCart } from "@tabler/icons-react";
import { getSiteSettings } from "@/app/(admin)/dashboard/settings/actions";
import { getCartCount } from "@/lib/cart";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const [settings, cartCount] = await Promise.all([
        getSiteSettings(),
        getCartCount(),
    ]);

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
                    <nav
                        aria-label="Navigation principale"
                        className="flex items-center gap-5"
                    >
                        <Link
                            href="/shop"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Boutique
                        </Link>
                        <Link
                            href="/blog"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Blog
                        </Link>

                        <Link
                            href="/cart"
                            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={
                                cartCount > 0
                                    ? `Panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`
                                    : "Panier, vide"
                            }
                        >
                            <IconShoppingCart size={19} />
                            {cartCount > 0 && (
                                <span
                                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
                                    aria-hidden
                                >
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
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
