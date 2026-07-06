"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { IconPhoto, IconVideo, IconX } from "@tabler/icons-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "./media-uploader";
import { MediaSidebar, buildCloudinaryUrl, type MediaItem } from "./media-sidebar";

interface MediaGridProps {
    media: MediaItem[];
    cloudName: string;
}

const DATE_OPTIONS = [
    { value: "ALL", label: "Toutes dates" },
    { value: "today", label: "Aujourd'hui" },
    { value: "week", label: "7 derniers jours" },
    { value: "month", label: "30 derniers jours" },
];

export function MediaGrid({ media: initialMedia, cloudName }: MediaGridProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const [media, setMedia] = useState(initialMedia);

    const typeFilter = searchParams.get("type") ?? "";
    const dateFilter = searchParams.get("date") ?? "";

    function setParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "ALL") params.set(key, value);
        else params.delete(key);
        router.push(`${pathname}?${params.toString()}`);
    }

    function handleDelete(id: string) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        setSelected(null);
    }

    const hasFilters = typeFilter || dateFilter;

    return (
        <div className="space-y-5">
            <MediaUploader />

            {/* Filters */}
            <nav className="flex flex-wrap items-center gap-2" aria-label="Filtres médiathèque">
                <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                    {(["", "IMAGE", "VIDEO"] as const).map((type) => (
                        <Button
                            key={type || "ALL"}
                            variant={typeFilter === type ? "secondary" : "ghost"}
                            size="sm"
                            className="h-7 px-2.5 text-xs gap-1.5"
                            onClick={() => setParam("type", type)}
                        >
                            {type === "IMAGE" && <IconPhoto size={13} />}
                            {type === "VIDEO" && <IconVideo size={13} />}
                            {type === "" ? "Tous" : type === "IMAGE" ? "Images" : "Vidéos"}
                        </Button>
                    ))}
                </div>

                <Select value={dateFilter || "ALL"} onValueChange={(v) => setParam("date", v)}>
                    <SelectTrigger className="w-44 h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DATE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={() => router.push(pathname)} className="gap-1.5">
                        <IconX size={14} />
                        Réinitialiser
                    </Button>
                )}
            </nav>

            {/* Grid */}
            {media.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-16">
                    Aucun fichier{hasFilters ? " pour ces filtres" : ""}. Importez votre premier média ci-dessus.
                </p>
            ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" role="list">
                    {media.map((item) => (
                        <li key={item.id}>
                            <article>
                                <button
                                    type="button"
                                    onClick={() => setSelected(item)}
                                    className={`group relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                        selected?.id === item.id
                                            ? "border-primary shadow-md"
                                            : "border-transparent hover:border-primary/40"
                                    }`}
                                    aria-label={item.name}
                                    aria-pressed={selected?.id === item.id}
                                >
                                    {cloudName ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={buildCloudinaryUrl(item.publicId, cloudName, item.type, "c_thumb,w_300,h_300")}
                                            alt=""
                                            className="w-full h-full object-cover bg-muted"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            {item.type === "VIDEO"
                                                ? <IconVideo size={32} className="text-muted-foreground" />
                                                : <IconPhoto size={32} className="text-muted-foreground" />
                                            }
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                                        <span className="text-white text-xs font-medium truncate w-full text-left">
                                            {item.name}
                                        </span>
                                    </div>

                                    {item.type === "VIDEO" && (
                                        <div className="absolute top-1.5 left-1.5">
                                            <span className="bg-black/60 text-white text-xs rounded px-1.5 py-0.5 flex items-center gap-1">
                                                <IconVideo size={10} />
                                                vidéo
                                            </span>
                                        </div>
                                    )}
                                </button>
                            </article>
                        </li>
                    ))}
                </ul>
            )}

            <MediaSidebar
                media={selected}
                cloudName={cloudName}
                onClose={() => setSelected(null)}
                onDelete={handleDelete}
            />
        </div>
    );
}
