export function PageLoader() {
    return (
        <section className="space-y-6 animate-pulse">
            <header className="space-y-2">
                <div className="h-7 w-48 rounded-lg bg-muted" />
                <div className="h-4 w-72 rounded-lg bg-muted" />
            </header>

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
