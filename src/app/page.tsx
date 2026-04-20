import { SurahCard } from "@/components/surah-card";
import { ShowMoreWrapper } from "@/components/show-more-wrapper";
import metaData from "../../public/metadata.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SectionType = "page" | "sajda" | "ruku" | "manzil" | "hizb";

type RefType = {
    surahNumber: number;
    surahStart: number;
    surahEnd: number;
    ayahStart: number;
    ayahEnd: number;
};

function getSubtitle(type: SectionType, index: number): string {
    const surahs = metaData.surah;
    const ref = (metaData[type] as unknown as RefType[])?.[index];
    if (!ref) return "";

    switch (type) {
        case "sajda": {
            const surah = surahs[ref.surahNumber];
            return surah ? `${surah.nameTransliteration}:${ref.ayahStart - surah.ayahStart + 1}` : "";
        }
        case "ruku": {
            const surah = surahs[ref.surahNumber];
            return surah ? `${surah.nameTransliteration} ${surah.surahNumber}:${ref.ayahStart - surah.ayahStart + 1}-${ref.ayahEnd - surah.ayahStart + 1}` : "";
        }
        case "page":
        case "manzil":
        case "hizb": {
            const surah = surahs[ref.surahStart];
            const endSurah = surahs[ref.surahEnd];
            return surah && endSurah
                ? `${surah.nameTransliteration} ${surah.surahNumber}:${ref.ayahStart - surah.ayahStart + 1}-${ref.ayahEnd - endSurah.ayahStart + 1}`
                : "";
        }
        default:
            return "";
    }
}

export default function Home() {
    const surahs = metaData.surah.slice(1) as NonNullable<typeof metaData.surah[number]>[];

    const juzData = metaData.juz.slice(1).map((juzItem) => {
        const item = juzItem!;
        const surahsInJuz = [];
        for (let s = item.surahStart; s <= item.surahEnd; s++) {
            surahsInJuz.push(metaData.surah[s]!);
        }
        return {
            juz: item.juzNumber,
            surahs: surahsInJuz
        };
    });

    const pages = metaData.page.slice(1).map(p => p!.pageNumber);
    const sajdas = metaData.sajda.slice(1).map(s => s!.sajdaId);
    const rukus = metaData.ruku.slice(1).map(r => r!.rukuNumber);
    const manzils = metaData.manzil.slice(1).map(m => m!.manzilNumber);
    const hizbQuarters = metaData.hizb.slice(1).map(h => h!.hizbNumber);

    return (
        <div className="bg-background min-h-screen text-foreground font-sans p-4 @3xl:p-8 max-w-7xl mx-auto">
            <Tabs defaultValue="surah" className="w-full">
                <div className="flex flex-col @3xl:flex-row items-start @3xl:items-center justify-between mb-4 gap-4">
                    {/* <h1 className="text-3xl font-bold tracking-tight">Quran Mazid</h1> */}
                    <div className="w-full @3xl:w-auto overflow-x-auto ml-auto">
                        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-auto mb-2 @3xl:mb-0 whitespace-nowrap">
                            <TabsTrigger value="surah">Surah</TabsTrigger>
                            <TabsTrigger value="juz">Juz</TabsTrigger>
                            <TabsTrigger value="page">Page</TabsTrigger>
                            <TabsTrigger value="ruku">Ruku</TabsTrigger>
                            <TabsTrigger value="manzil">Manzil</TabsTrigger>
                            <TabsTrigger value="hizb">Hizb Quarter</TabsTrigger>
                            <TabsTrigger value="sajda">Sajda</TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <TabsContent value="surah">
                    <ShowMoreWrapper className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 gap-4 w-full" initialCount={30} step={100}>
                        {surahs.map((idx) => (
                            <SurahCard
                                key={idx.surahNumber}
                                idx={String(idx.surahNumber)}
                                title={idx.nameTransliteration}
                                subtitle={idx.nameMeaning}
                                arabicName={idx.nameArabic}
                                href={`/surah/${idx.surahNumber}`}
                            />
                        ))}
                    </ShowMoreWrapper>
                </TabsContent>

                <TabsContent value="juz">
                    <ShowMoreWrapper className="columns-1 @3xl:columns-2 @5xl:columns-3 @7xl:columns-4 gap-3 w-full" initialCount={20} step={10}>
                        {juzData.map((idx) => (
                            <div key={idx.juz} className="break-inside-avoid mb-3 bg-muted/20 p-4 rounded-md">
                                <h3 className="text-primary font-bold text-sm mb-4">Juz {String(idx.juz).padStart(2, '0')}</h3>
                                <div className="flex flex-col gap-3">
                                    {idx.surahs.map((surah) => (
                                        <SurahCard
                                            key={`${idx.juz}-${surah.surahNumber}`}
                                            idx={String(surah.surahNumber)}
                                            title={surah.nameTransliteration}
                                            subtitle={surah.nameMeaning}
                                            href={`/surah/${surah.surahNumber}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </ShowMoreWrapper>
                </TabsContent>

                <TabsContent value="page">
                    <ShowMoreWrapper className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-5 gap-4 w-full" initialCount={50} step={50}>
                        {pages.map((idx) => (
                            <SurahCard
                                key={idx}
                                idx={String(idx).padStart(2, '0')}
                                title={`Page ${String(idx).padStart(2, '0')}`}
                                subtitle={getSubtitle("page", idx)}
                                href={`/page/${idx}`}
                            />
                        ))}
                    </ShowMoreWrapper>
                </TabsContent>

                <TabsContent value="ruku">
                    <ShowMoreWrapper className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-5 gap-4 w-full" initialCount={50} step={50}>
                        {rukus.map((idx) => (
                            <SurahCard
                                key={idx}
                                idx={String(idx).padStart(2, '0')}
                                title={`Ruku ${String(idx).padStart(2, '0')}`}
                                subtitle={getSubtitle("ruku", idx)}
                                href={`/ruku/${idx}`}
                            />
                        ))}
                    </ShowMoreWrapper>
                </TabsContent>

                <TabsContent value="manzil">
                    <ShowMoreWrapper className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-5 gap-4 w-full" initialCount={7} step={7}>
                        {manzils.map((idx) => (
                            <SurahCard
                                key={idx}
                                idx={String(idx).padStart(2, '0')}
                                title={`Manzil ${String(idx).padStart(2, '0')}`}
                                subtitle={getSubtitle("manzil", idx)}
                                href={`/manzil/${idx}`}
                            />
                        ))}
                    </ShowMoreWrapper>
                </TabsContent>

                <TabsContent value="hizb">
                    <ShowMoreWrapper className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-5 gap-4 w-full" initialCount={50} step={50}>
                        {hizbQuarters.map((idx) => (
                            <SurahCard
                                key={idx}
                                idx={String(idx).padStart(2, '0')}
                                title={`Hizb ${String(idx).padStart(2, '0')}`}
                                subtitle={getSubtitle("hizb", idx)}
                                href={`/hizb/${idx}`}
                            />
                        ))}
                    </ShowMoreWrapper>
                </TabsContent>

                <TabsContent value="sajda">
                    <ShowMoreWrapper className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-5 gap-4 w-full" initialCount={15} step={15}>
                        {sajdas.map((idx) => (
                            <SurahCard
                                key={idx}
                                idx={String(idx).padStart(2, '0')}
                                title={`Sajda ${String(idx).padStart(2, '0')}`}
                                subtitle={getSubtitle("sajda", idx)}
                                href={`/sajda/${idx}`}
                            />
                        ))}
                    </ShowMoreWrapper>
                </TabsContent>
            </Tabs>
        </div>
    );
}

