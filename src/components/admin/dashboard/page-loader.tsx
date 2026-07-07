function LoaderHeader() {
    return (
        <header className="space-y-2">
            <div className="h-7 w-48 rounded-lg bg-muted" />
            <div className="h-4 w-72 rounded-lg bg-muted" />
        </header>
    );
}

// ─── Dashboard (KPI + chart + tables) ────────────────────────────────────────

export function PageLoader() {
    return (
        <section className="space-y-6 animate-pulse">
            <LoaderHeader />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-28 rounded-xl bg-muted" />
                ))}
            </div>

            <div className="h-64 rounded-xl bg-muted" />

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 h-72 rounded-xl bg-muted" />
                <div className="h-72 rounded-xl bg-muted" />
            </div>
        </section>
    );
}

// ─── Posts (filtres + table) ─────────────────────────────────────────────────

export function PostsLoader() {
    return (
        <section className="space-y-6 animate-pulse">
            <header className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-7 w-32 rounded-lg bg-muted" />
                    <div className="h-4 w-20 rounded-lg bg-muted" />
                </div>
                <div className="h-9 w-36 rounded-lg bg-muted" />
            </header>

            <div className="flex flex-wrap gap-2">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-9 w-40 rounded-lg bg-muted" />
                ))}
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
                <div className="h-10 bg-muted/60" />
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 h-12 border-t border-border">
                        <div className="h-4 flex-1 max-w-xs rounded bg-muted" />
                        <div className="h-5 w-20 rounded-full bg-muted hidden sm:block" />
                        <div className="h-5 w-24 rounded-full bg-muted" />
                        <div className="h-4 w-24 rounded bg-muted hidden md:block" />
                        <div className="h-4 w-16 rounded bg-muted hidden lg:block" />
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── Éditeur de post (2 colonnes) ────────────────────────────────────────────

export function EditorLoader() {
    return (
        <section className="animate-pulse">
            <header className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted" />
                    <div className="h-6 w-40 rounded-lg bg-muted" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-28 rounded-lg bg-muted" />
                    <div className="h-8 w-24 rounded-lg bg-muted" />
                </div>
            </header>

            <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
                <div className="space-y-5">
                    <div className="h-10 w-full rounded bg-muted" />
                    <div className="h-8 w-2/3 rounded bg-muted" />
                    <div className="h-20 w-full rounded-lg bg-muted" />
                    <div className="h-72 w-full rounded-lg bg-muted" />
                </div>
                <div className="rounded-xl border border-border p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 rounded-lg bg-muted" />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Médiathèque (upload + grille) ───────────────────────────────────────────

export function MediaLoader() {
    return (
        <section className="space-y-6 animate-pulse">
            <LoaderHeader />

            <div className="h-32 rounded-xl border-2 border-dashed border-border" />

            <div className="flex flex-wrap gap-2">
                <div className="h-9 w-44 rounded-lg bg-muted" />
                <div className="h-9 w-44 rounded-lg bg-muted" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted" />
                ))}
            </div>
        </section>
    );
}

// ─── Settings (tabs + formulaire) ────────────────────────────────────────────

export function SettingsLoader() {
    return (
        <section className="space-y-6 animate-pulse">
            <LoaderHeader />

            <div className="h-9 w-full max-w-96 rounded-lg bg-muted" />

            <div className="space-y-4 max-w-xl">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-9 w-full rounded-lg bg-muted" />
                    </div>
                ))}
                <div className="h-9 w-28 rounded-lg bg-muted" />
            </div>
        </section>
    );
}
