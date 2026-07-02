import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "NextPress",
        template: "%s — NextPress",
    },
    description:
        "NextPress — L'alternative moderne à WordPress. CMS, blog et e-commerce sur Next.js. Liberté totale sur le frontend, zéro thème payant.",
    keywords: [
        "nextjs",
        "cms",
        "ecommerce",
        "blog",
        "wordpress alternative",
        "boilerplate",
    ],
    authors: [{ name: "NextPress" }],
    creator: "NextPress",
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ),
    openGraph: {
        type: "website",
        locale: "fr_FR",
        siteName: "NextPress",
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fr"
            className={`${outfit.variable} h-full antialiased font-sans`}
            suppressHydrationWarning
        >
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-center" />
                </ThemeProvider>
            </body>
        </html>
    );
}
