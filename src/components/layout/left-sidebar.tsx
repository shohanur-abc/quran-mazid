"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import metadata from "../../../public/metadata.json";
import { usePathname } from "next/navigation";
import { SurahCard } from "../surah-card";

export function LeftSidebar() {

    const pathname = usePathname() || "";
    const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");
    const [searchQuery, setSearchQuery] = useState("");

    const surahs = metadata.surah.slice(1);
    const juzs = metadata.juz.slice(1);
    const pages = metadata.page.slice(1);

    const filteredSurahs = surahs.filter((s) =>
        !searchQuery ||
        s?.nameTransliteration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s?.nameMeaning?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s?.nameArabic?.includes(searchQuery) ||
        String(s?.surahNumber) === searchQuery
    );

    const filteredJuzs = juzs.filter((j) => !searchQuery || String(j?.juzNumber) === searchQuery);
    const filteredPages = pages.filter((p) => !searchQuery || String(p?.pageNumber) === searchQuery);

    const isActive = (path: string) => {
        if (pathname === path) return true;
        if (path.startsWith("/surah/") && pathname === `/${path.split("/")[2]}`) return true;
        return false;
    };

    return (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "surah" | "juz" | "page")} className="flex h-full flex-col bg-background text-foreground border-r">
            <div className="p-4 flex flex-col gap-4">
                <div className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-foreground/5 p-1 rounded-full">
                        <TabsTrigger className="rounded-full data-[state=active]:bg-foreground/10" value="surah">Surah</TabsTrigger>
                        <TabsTrigger className="rounded-full data-[state=active]:bg-foreground/10" value="juz">Juz</TabsTrigger>
                        <TabsTrigger className="rounded-full data-[state=active]:bg-foreground/10" value="page">Page</TabsTrigger>
                    </TabsList>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={`Search ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-foreground/5 border-border/10 rounded-full focus-visible:ring-1 focus-visible:ring-border/20"
                    />
                </div>
            </div>

            <div className="flex-1  overflow-y-auto scrollbar-thin ">
                <TabsContent value="surah" className="flex flex-col gap-2 p-4 pt-0 m-0">
                    {filteredSurahs.map((surah) => {
                        if (!surah) return null;
                        const isMatch = isActive(`/${surah.surahNumber}`) || isActive(`/surah/${surah.surahNumber}`);
                        return (
                            <SurahCard
                                key={surah.surahNumber}
                                idx={surah.surahNumber}
                                href={`/${surah.surahNumber}`}
                                title={surah.nameTransliteration}
                                subtitle={surah.nameMeaning}
                                isActive={isMatch}
                                classNames={{ card: "py-3" }}
                            />
                        );
                    })}
                </TabsContent>

                <TabsContent value="juz" className="flex flex-col gap-2 p-4 pt-0 m-0">
                    {filteredJuzs.map((juz) => {
                        if (!juz) return null;
                        const isMatch = isActive(`/juz/${juz.juzNumber}`);
                        return (
                            <SurahCard
                                key={juz.juzNumber}
                                idx={juz.juzNumber}
                                href={`/juz/${juz.juzNumber}`}
                                title={`Juz ${juz.juzNumber}`}
                                subtitle={`Surah ${surahs[juz.surahStart - 1]?.nameTransliteration}`}
                                isActive={isMatch}
                                classNames={{ card: "py-3" }}
                            />
                        );
                    })}
                </TabsContent>

                <TabsContent value="page" className="flex flex-col gap-2 p-4 pt-0 m-0">
                    {filteredPages.map((page) => {
                        if (!page) return null;
                        const isMatch = isActive(`/page/${page.pageNumber}`);
                        return (
                            <SurahCard
                                key={page.pageNumber}
                                idx={page.pageNumber}
                                href={`/page/${page.pageNumber}`}
                                title={`Page ${page.pageNumber}`}
                                subtitle={`Surah ${surahs[page.surahStart - 1]?.nameTransliteration}`}
                                isActive={isMatch}
                                classNames={{ card: "py-3" }}
                            />
                        );
                    })}
                </TabsContent>
            </div>
        </Tabs>
    );
}
