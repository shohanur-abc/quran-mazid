import { InfiniteAyahList } from "@/components/infinite-ayah-list";
import { getAyahs } from "../actions/getAyahs";
import metadata from "../../../public/metadata.json";
import { ReactNode } from "react";

type SupportedType = "surah" | "juz" | "page" | "hizb" | "manzil" | "sajda" | "ruku";
type MetadataEntry = {
    ayahStart: number;
    ayahEnd: number;
    nameTransliteration?: string;
    nameArabic?: string;
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

export function generateStaticParams(): { slug: string[] }[] {
    const params: { slug: string[] }[] = [];

    const surahs = metadata.surah.slice(1);
    for (const surah of surahs) {
        if (!surah) continue;
        params.push({ slug: [String(surah.surahNumber)] });
        params.push({ slug: ["surah", String(surah.surahNumber)] });
    }

    const extraTypes: SupportedType[] = ["juz", "page", "hizb", "manzil", "sajda", "ruku"];
    for (const type of extraTypes) {
        const items = (metadata[type] as Array<Record<string, unknown> | null>).slice(1);
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

    let type = "";
    let indexStr = "";
    let rangeStr = "";

    // Parse slug
    const firstSlug = decodeURIComponent(slug[0] || "").toLowerCase();

    if (!isNaN(Number(firstSlug))) {
        // e.g. /1 or /1/1:5 (meaning surah 1)
        type = "surah";
        indexStr = firstSlug;
        rangeStr = slug[1] || "";
    } else {
        // route with type e.g. /surah/1, /juz/1, /hizb-quarter/1
        type = firstSlug;
        // Normalize hizb variations
        if (type === "hizb-quarter" || type === "hizb quarter") {
            type = "hizb";
        }
        indexStr = slug[1] || "";
        rangeStr = slug[2] || "";
    }

    const index = parseInt(indexStr, 10);
    if (isNaN(index)) {
        return <div>Invalid ID</div>;
    }

    const allowedTypes: SupportedType[] = ["surah", "juz", "page", "hizb", "manzil", "sajda", "ruku"];
    if (!allowedTypes.includes(type as SupportedType)) {
        return <div>Unknown Route Type: {type}</div>;
    }

    const routeType = type as SupportedType;

    const typeDataArray = (metadata as Record<string, MetadataEntry[]>)[routeType];
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
