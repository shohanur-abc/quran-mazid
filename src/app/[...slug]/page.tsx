import { InfiniteAyahList } from "@/components/infinite-ayah-list";
import { getAyahs } from "../actions/getAyahs";
import quranMetadata from "../../../public/metadata.json";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { isPreviewDeployment, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

type SupportedType = "surah" | "juz" | "page" | "hizb" | "manzil" | "sajda" | "ruku";
type MetadataEntry = {
    ayahStart: number;
    ayahEnd: number;
    nameTransliteration?: string;
    nameArabic?: string;
    nameMeaning?: string;
};

const TYPE_INDEX_KEYS: Record<SupportedType, string> = {
    surah: "surahNumber",
    juz: "juzNumber",
    page: "pageNumber",
    hizb: "hizbNumber",
    manzil: "manzilNumber",
    sajda: "sajdaId",
    ruku: "rukuNumber",
};

export const dynamicParams = false;

function parseRouteSlug(slug: string[]) {
    const firstSlug = decodeURIComponent(slug[0] || "").toLowerCase();

    let normalizedType = "";
    let indexStr = "";
    let rangeStr = "";

    if (!isNaN(Number(firstSlug))) {
        normalizedType = "surah";
        indexStr = firstSlug;
        rangeStr = slug[1] || "";
    } else {
        normalizedType = firstSlug;
        if (normalizedType === "hizb-quarter" || normalizedType === "hizb quarter") {
            normalizedType = "hizb";
        }
        indexStr = slug[1] || "";
        rangeStr = slug[2] || "";
    }

    const index = parseInt(indexStr, 10);
    const routeType = normalizedType as SupportedType;
    const isSupportedType = ["surah", "juz", "page", "hizb", "manzil", "sajda", "ruku"].includes(routeType);

    if (!isSupportedType || Number.isNaN(index)) {
        return {
            isValid: false,
            routeType: null,
            index: null,
            rangeStr: "",
            canonicalPath: "/",
        };
    }

    const canonicalPath = `/${routeType}/${index}${rangeStr ? `/${rangeStr}` : ""}`;

    return {
        isValid: true,
        routeType,
        index,
        rangeStr,
        canonicalPath,
    };
}

function getTitleAndDescription(type: SupportedType, index: number, entry: MetadataEntry): { title: string; description: string } {
    if (type === "surah") {
        const transliteration = entry.nameTransliteration ?? `Surah ${index}`;
        const arabicName = entry.nameArabic ? ` (${entry.nameArabic})` : "";
        const meaning = entry.nameMeaning ? ` — ${entry.nameMeaning}` : "";

        return {
            title: `${transliteration}${arabicName}`,
            description: `Read ${transliteration}${meaning} with Arabic text, translation, and navigation support on ${SITE_NAME}.`,
        };
    }

    const label = type.charAt(0).toUpperCase() + type.slice(1);

    return {
        title: `${label} ${index}`,
        description: `Read and explore ${label} ${index} in the Quran with Arabic text and translations on ${SITE_NAME}.`,
    };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const parsed = parseRouteSlug(slug);

    if (!parsed.isValid || parsed.routeType == null || parsed.index == null) {
        return {
            title: `Not Found | ${SITE_NAME}`,
            description: SITE_DESCRIPTION,
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const routeCollection = (quranMetadata as Record<string, MetadataEntry[]>)[parsed.routeType];
    const entry = routeCollection?.[parsed.index];

    if (!entry) {
        return {
            title: `Not Found | ${SITE_NAME}`,
            description: SITE_DESCRIPTION,
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const { title, description } = getTitleAndDescription(parsed.routeType, parsed.index, entry);

    return {
        title,
        description,
        alternates: {
            canonical: parsed.canonicalPath,
        },
        openGraph: {
            title,
            description,
            type: "article",
            url: parsed.canonicalPath,
            images: ["/opengraph-image"],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/twitter-image"],
        },
        robots: isPreviewDeployment()
            ? {
                index: false,
                follow: false,
                nocache: true,
            }
            : {
                index: true,
                follow: true,
            },
    };
}

export function generateStaticParams(): { slug: string[] }[] {
    const params: { slug: string[] }[] = [];

    const surahs = quranMetadata.surah.slice(1);
    for (const surah of surahs) {
        if (!surah) continue;
        params.push({ slug: [String(surah.surahNumber)] });
        params.push({ slug: ["surah", String(surah.surahNumber)] });
    }

    const extraTypes: SupportedType[] = ["juz", "page", "hizb", "manzil", "sajda", "ruku"];
    for (const type of extraTypes) {
        const items = (quranMetadata[type] as Array<Record<string, unknown> | null>).slice(1);
        const indexKey = TYPE_INDEX_KEYS[type];

        for (const item of items) {
            if (!item) continue;
            const id = item[indexKey];
            if (id == null) continue;

            params.push({ slug: [type, String(id)] });
            if (type === "hizb") {
                params.push({ slug: ["hizb-quarter", String(id)] });
            }
        }
    }

    return params;
}

export default async function DynamicRoute({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;

    const parsed = parseRouteSlug(slug);

    if (!parsed.isValid || parsed.routeType == null || parsed.index == null) {
        return <div>Invalid ID</div>;
    }

    const { routeType, index, rangeStr } = parsed;

    const typeDataArray = (quranMetadata as Record<string, MetadataEntry[]>)[routeType];
    if (!Array.isArray(typeDataArray)) {
        return <div>Data for {routeType} not found</div>;
    }

    const typeData = typeDataArray[index];
    if (!typeData) {
        return <div>{routeType} {index} not found</div>;
    }

    let globalStart = typeData.ayahStart;
    let globalEnd = typeData.ayahEnd;

    if (rangeStr) {
        const parts = rangeStr.split(":");
        let rStart = parseInt(parts[0], 10) || 1;
        let rEnd = parts.length > 1 ? parseInt(parts[1], 10) || rStart : rStart;

        const maxRange = typeData.ayahEnd - typeData.ayahStart + 1;
        rStart = Math.max(1, Math.min(maxRange, rStart));
        rEnd = Math.max(rStart, Math.min(maxRange, rEnd));

        // ensure start <= end
        if (rStart > rEnd) {
            const temp = rStart;
            rStart = rEnd;
            rEnd = temp;
        }

        globalStart = typeData.ayahStart + rStart - 1;
        globalEnd = typeData.ayahStart + rEnd - 1;
    }

    // Determine Title
    let displayTitle: ReactNode;
    if (routeType === "surah") {
        displayTitle = <>{typeData.nameTransliteration ?? "Surah"} <span className="font-uthmani"> ({typeData.nameArabic ?? ""})</span></>
    } else {
        const titleStr = routeType.charAt(0).toUpperCase() + routeType.slice(1);
        displayTitle = `${titleStr} ${index}`;
    }

    const initialEnd = Math.min(globalStart + 9, globalEnd);
    const initialAyahs = await getAyahs(globalStart, initialEnd);

    return (
        <InfiniteAyahList
            globalStart={globalStart}
            globalEnd={globalEnd}
            displayTitle={displayTitle}
            initialAyahs={initialAyahs}
        />
    );
}
