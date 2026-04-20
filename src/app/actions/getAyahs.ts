"use server";

import fs from "fs/promises";
import path from "path";

const dbCache: Record<string, unknown> = {};

export type AyahWord = {
    id: string;
    text: string;
    tooltip: string;
};

export type AyahTranslation = {
    id: string;
    language: "bn" | "en";
    text: string;
    translator: string;
    source: string;
};

export type AyahData = {
    id: string;
    surahNumber: number;
    ayahNumber: number;
    arabicText: string;
    words: AyahWord[];
    translations: AyahTranslation[];
};

const loadDb = async <T>(filename: string): Promise<T> => {
    if (dbCache[filename]) {
        return dbCache[filename] as T;
    }
    const filepath = path.join(process.cwd(), "src", "db", filename);
    const data = await fs.readFile(filepath, "utf-8");
    const parsed = JSON.parse(data) as T;
    dbCache[filename] = parsed;
    return parsed;
};

export async function getAyahs(start: number, end: number): Promise<AyahData[]> {
    const metadataPath = path.join(process.cwd(), "public", "metadata.json");
    const metadataRaw = await fs.readFile(metadataPath, "utf-8");
    const metadata = JSON.parse(metadataRaw);

    const globalToAyah: Record<number, { surah: number; ayah: number }> = {};
    for (let i = 1; i <= 114; i++) {
        const surah = metadata.surah[i];
        if (surah) {
            for (let g = surah.ayahStart; g <= surah.ayahEnd; g++) {
                globalToAyah[g] = { surah: i, ayah: g - surah.ayahStart + 1 };
            }
        }
    }

    const [
        bnTranslationsData,
        enTranslationsData,
        wbwUthmaniRaw,
        wbwBanglaRaw,
    ] = await Promise.all([
        loadDb<string[]>("aba-bn-rawai-al-bayan-simple.json"),
        loadDb<string[]>("aba-en-sahih-international-simple.json"),
        loadDb<Record<string, string>>("wbw-uthmani.json"),
        loadDb<Record<string, string>>("wbw-bangali-word-by-word-translation.json"),
    ]);

    const bnTranslations = bnTranslationsData || [];
    const enTranslations = enTranslationsData || [];

    const requiredKeys = new Set<string>();
    for (let globalIdx = start; globalIdx <= end; globalIdx++) {
        const mapping = globalToAyah[globalIdx];
        if (mapping) {
            requiredKeys.add(`${mapping.surah}:${mapping.ayah}`);
        }
    }

    const keysByAyahKey: Record<string, string[]> = {};
    for (const key of Object.keys(wbwUthmaniRaw)) {
        const parts = key.split(':');
        if (parts.length >= 3) {
            const ayahKey = `${parts[0]}:${parts[1]}`;
            if (requiredKeys.has(ayahKey)) {
                if (!keysByAyahKey[ayahKey]) keysByAyahKey[ayahKey] = [];
                keysByAyahKey[ayahKey].push(key);
            }
        }
    }

    for (const k in keysByAyahKey) {
        keysByAyahKey[k].sort((k1, k2) => {
            const w1 = parseInt(k1.split(':')[2], 10);
            const w2 = parseInt(k2.split(':')[2], 10);
            return w1 - w2;
        });
    }

    const ayahs: AyahData[] = [];

    for (let globalIdx = start; globalIdx <= end; globalIdx++) {
        const mapping = globalToAyah[globalIdx];
        if (!mapping) continue;

        const { surah, ayah: relativeAyah } = mapping;
        const ayahKey = `${surah}:${relativeAyah}`;

        const ayahKeys = keysByAyahKey[ayahKey] || [];
        const words = ayahKeys.map(k => ({
            id: k,
            text: wbwUthmaniRaw[k] || "",
            tooltip: wbwBanglaRaw[k] || ""
        }));

        const textBN = bnTranslations[globalIdx] || "";
        const textEN = enTranslations[globalIdx] || "";

        ayahs.push({
            id: ayahKey,
            surahNumber: surah,
            ayahNumber: relativeAyah,
            arabicText: words.map(w => w.text).join(' '),
            words,
            translations: [
                {
                    id: `bn-${surah}-${relativeAyah}`,
                    language: 'bn',
                    text: textBN,
                    translator: "Rawai Al-Bayan",
                    source: "Rawai Al-Bayan",
                },
                {
                    id: `en-${surah}-${relativeAyah}`,
                    language: 'en',
                    text: textEN,
                    translator: "Sahih International",
                    source: "Sahih International",
                }
            ]
        });
    }

    return ayahs;
}
