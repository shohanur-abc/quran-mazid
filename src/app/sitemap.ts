import type { MetadataRoute } from "next";

import quranMetadata from "../../public/metadata.json";
import { getSiteOrigin } from "@/lib/seo";

type RouteType = "surah" | "juz" | "page" | "hizb" | "manzil" | "sajda" | "ruku";

type RouteConfig = {
    type: RouteType;
    key: string;
};

const ROUTES: RouteConfig[] = [
    { type: "surah", key: "surahNumber" },
    { type: "juz", key: "juzNumber" },
    { type: "page", key: "pageNumber" },
    { type: "hizb", key: "hizbNumber" },
    { type: "manzil", key: "manzilNumber" },
    { type: "sajda", key: "sajdaId" },
    { type: "ruku", key: "rukuNumber" },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = getSiteOrigin();
    const now = new Date();

    const staticEntries: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1,
        },
    ];

    const dynamicEntries = ROUTES.flatMap(({ type, key }) => {
        const collection = (quranMetadata[type] as Array<Record<string, number> | null>).slice(1);

        return collection.flatMap((entry) => {
            if (!entry) return [];

            const id = entry[key];
            if (typeof id !== "number") return [];

            const canonicalPath = type === "hizb" ? `/hizb/${id}` : `/${type}/${id}`;

            return [
                {
                    url: `${baseUrl}${canonicalPath}`,
                    lastModified: now,
                    changeFrequency: "weekly" as const,
                    priority: type === "surah" ? 0.9 : 0.7,
                },
            ];
        });
    });

    return [...staticEntries, ...dynamicEntries];
}
