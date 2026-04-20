"use server";

import mongoose from "mongoose";
import path from "path";
import fs from "fs/promises";
import { connectDB } from "@/lib/db";

let cachedMetadata: any = null;

async function getMetadata() {
  if (!cachedMetadata) {
    const metadataPath = path.join(process.cwd(), "public", "metadata.json");
    cachedMetadata = JSON.parse(await fs.readFile(metadataPath, "utf-8"));
  }
  return cachedMetadata;
}

export type SearchResult = {
  globalIndex: number;
  surahNumber: number;
  ayahNumber: number;
  text: string;
  source: string;
};

export async function searchAyahs(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 3) return [];

  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database not connected");

  const metadata = await getMetadata();
  const regexQuery = { $regex: query, $options: "i" };

  const [enDocs, bnDocs] = await Promise.all([
    db.collection("en_sahih_international").find({ text: regexQuery }).limit(10).toArray(),
    db.collection("bn_rawai_al_bayan").find({ text: regexQuery }).limit(10).toArray()
  ]);

  const mapToResult = (doc: any, source: string) => {
    const gi = doc._id;
    let surahNumber = 1;
    let ayahNumber = gi;

    for (let i = 1; i <= 114; i++) {
      const s = metadata.surah[i];
      if (s && gi >= s.ayahStart && gi <= s.ayahEnd) {
        surahNumber = i;
        ayahNumber = gi - s.ayahStart + 1;
        break;
      }
    }

    return {
      globalIndex: gi as number,
      surahNumber,
      ayahNumber,
      text: doc.text,
      source
    };
  };

  const results = [
    ...enDocs.map(d => mapToResult(d, "English")),
    ...bnDocs.map(d => mapToResult(d, "বাংলা"))
  ];

  // Sort intermixed based on index if needed, or return top 10
  return results.slice(0, 15);
}
