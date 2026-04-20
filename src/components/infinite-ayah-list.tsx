"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AyahCard, AyahCardSkeleton } from "@/components/ayah-card";
import { AyahData, getAyahs } from "@/app/actions/getAyahs";
import { toast } from "sonner";

const PAGE_SIZE = 10;

interface InfiniteAyahListProps {
    globalStart: number;
    globalEnd: number;
    displayTitle: ReactNode;
    initialAyahs?: AyahData[];
}

export function InfiniteAyahList({ globalStart, globalEnd, displayTitle, initialAyahs = [] }: InfiniteAyahListProps) {
    const totalAyahs = globalEnd - globalStart + 1;
    const hasInitialAyahs = initialAyahs.length > 0;

    // We fetch data in chunks of PAGE_SIZE
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        status,
    } = useInfiniteQuery({
        queryKey: ["ayahs", globalStart, globalEnd],
        queryFn: async ({ pageParam = 0 }) => {
            const start = globalStart + pageParam * PAGE_SIZE;
            const end = Math.min(start + PAGE_SIZE - 1, globalEnd);
            if (start > globalEnd) return [];
            return await getAyahs(start, end);
        },
        initialData: hasInitialAyahs
            ? {
                pages: [initialAyahs],
                pageParams: [0],
            }
            : undefined,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const fetchedCount = allPages.reduce((sum, page) => sum + page.length, 0);
            if (fetchedCount < totalAyahs) {
                return allPages.length; // Next page index
            }
            return undefined;
        },
        staleTime: Infinity, // The Quran text doesn't change frequently
    });

    // Flatten all pages into a single array of items
    const allAyahs = data?.pages.flatMap((page) => page) ?? [];

    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
    const [highlightQuery, setHighlightQuery] = useState<string | undefined>(undefined);

    useEffect(() => {
        setScrollElement(document.getElementById("main-scroll-container"));
    }, []);

    const virtualizer = useVirtualizer({
        count: totalAyahs,
        getScrollElement: () => scrollElement,
        estimateSize: () => 300, // Estimated height of an AyahCard in pixels
        overscan: 10, // Render 3 items outside of the visible area
    });

    useEffect(() => {
        if (!scrollElement) return;

        const params = new URLSearchParams(window.location.search);
        const scrollTo = params.get("scrollTo");
        const query = params.get("q");

        if (query) {
            setHighlightQuery(query);
        }

        if (scrollTo) {
            // Find the index of the ayah with the matching globalIndex
            // In our case, the index in the list is simply globalIndex - globalStart
            const targetIndex = parseInt(scrollTo, 10) - globalStart;

            if (targetIndex >= 0 && targetIndex < totalAyahs) {
                // Delay slightly to allow virtualizer to compute properly
                setTimeout(() => {
                    virtualizer.scrollToIndex(targetIndex, { align: "center" });
                }, 100);
            }
        }
    }, [scrollElement, globalStart, totalAyahs]); // Note: removing virtualizer from deps so it only runs once per mount/scrollElement

    const items = virtualizer.getVirtualItems();

    useEffect(() => {
        const [lastItem] = [...items].reverse();

        if (!lastItem) {
            return;
        }

        if (
            lastItem.index >= allAyahs.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [
        hasNextPage,
        fetchNextPage,
        allAyahs.length,
        isFetchingNextPage,
        items,
    ]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full p-4 relative">
                <h1 className="text-3xl font-bold text-center mb-6 font-uthmani">{displayTitle}</h1>
                {Array.from({ length: 3 }).map((_, index) => (
                    <AyahCardSkeleton key={`ayah-skeleton-initial-${index}`} />
                ))}
            </div>
        );
    }

    if (status === "error") {
        return <div className="text-center py-10 text-red-500">Error loading data.</div>;
    }

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full p-4 relative">
            <h1 className="text-3xl font-bold text-center mb-6 ">
                {displayTitle}
            </h1>
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                    const isLoaderRow = virtualItem.index > allAyahs.length - 1;
                    const ayah = allAyahs[virtualItem.index];

                    return (
                        <div
                            key={virtualItem.key}
                            data-index={virtualItem.index}
                            ref={virtualizer.measureElement}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualItem.start}px)`,
                                paddingBottom: '2rem', // Equivalent to flex gap-8
                            }}
                        >
                            {isLoaderRow ? (
                                <AyahCardSkeleton />
                            ) : (
                                ayah && (
                                    <AyahCard
                                        ayahKey={ayah.id}
                                        arabicText={ayah.arabicText}
                                        words={ayah.words}
                                        translations={ayah.translations}
                                        verseNumber={ayah.ayahNumber}
                                        onBookmark={() => toast.info('this feature isnt implemented yet')}
                                        onCopyAyah={() => toast.info('this feature isnt implemented yet')}
                                        onCopyLink={() => toast.info('this feature isnt implemented yet')}
                                        onShare={() => toast.info('this feature isnt implemented yet')}
                                        onPlay={() => toast.info('this feature isnt implemented yet')}
                                        onTafsir={() => toast.info('this feature isnt implemented yet')}
                                        highlightQuery={highlightQuery}
                                    />
                                )
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

