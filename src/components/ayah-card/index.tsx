"use client";

import * as React from "react";
import { Copy, Link as LinkIcon, Share2 } from "lucide-react";
import { AyahActionsMobile, AyahMenuAction } from "./ayah-actions-mobile";
import { AyahActionsDesktop } from "./ayah-actions-desktop";
import { AyahArabicText, AyahWord } from "./ayah-arabic-text";
import { AyahTranslations, AyahTranslation } from "./ayah-translations";
import { useLocalStorage } from "@/hooks/use-local-storage";

export * from "./rail-icon-button";
export * from "./ayah-actions-mobile";
export * from "./ayah-actions-desktop";
export * from "./ayah-arabic-text";
export * from "./ayah-translations";
export * from "./skeleton";

export interface AyahCardProps {
    id?: string;
    ayahKey: string;
    arabicText?: string;
    words?: AyahWord[];
    verseNumber?: string | number;
    translations: AyahTranslation[];
    desktopActions?: boolean;
    mobileActions?: boolean;
    onPlay?: () => void;
    onTafsir?: () => void;
    onBookmark?: () => void;
    onCopyAyah?: () => void;
    onCopyLink?: () => void;
    onShare?: () => void;
    extraMenuActions?: AyahMenuAction[];
    highlightQuery?: string;
}


export function AyahCard({
    id,
    ayahKey,
    arabicText,
    words,
    translations,
    desktopActions = true,
    mobileActions = true,
    onPlay,
    onTafsir,
    onBookmark,
    onCopyAyah,
    onCopyLink,
    onShare,
    extraMenuActions = [],
    highlightQuery,
}: AyahCardProps) {
    const [showWordByWord] = useLocalStorage<boolean>("show-word-by-word", true);
    const [selectedTranslations] = useLocalStorage<string[]>("selected-translations", ["bengali"]);
    const [wbwTranslationLang] = useLocalStorage<string>("wbw-translation-lang", "bengali");

    const filteredTranslations = translations.filter(t => selectedTranslations.includes((t as any).language === "bn" ? "bengali" : "english"));
    
    // Add WbW translations to the words
    const mappedWords = words?.map(word => {
        const wbw = (word as any).translations?.find((t: any) => typeof t.translation_id === "number" && (wbwTranslationLang === "bengali" && t.translation_id === 161 || wbwTranslationLang === "english" && t.translation_id === 20));
        return {
            ...word,
            tooltip: wbw ? wbw.text : word.tooltip
        }
    });

    const menuActions: AyahMenuAction[] = [
        {
            label: "Copy Ayah",
            icon: <Copy />,
            onClick: onCopyAyah,
            hidden: false,
        },
        {
            label: "Copy Link",
            icon: <LinkIcon />,
            onClick: onCopyLink,
            hidden: false,
        },
        {
            label: "Share Ayah",
            icon: <Share2 />,
            onClick: onShare,
            hidden: false,
        },
        ...extraMenuActions,
    ].filter((action) => !action.hidden);

    return (
        <div>
            <div
                id={id ?? `ayah-card-${ayahKey}`}
                className="overflow-hidden border-b py-6 transition-colors duration-200 relative"

            >
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary @3xl:pl-2">
                        {ayahKey}
                    </p>

                    <div className="flex items-center gap-3">
                        {mobileActions ? (
                            <AyahActionsMobile
                                onPlay={onPlay}
                                onTafsir={onTafsir}
                                onBookmark={onBookmark}
                                menuActions={menuActions}
                            />
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-7 pt-3 @3xl:grid-cols-[auto_1fr]">
                    {desktopActions ? (
                        <AyahActionsDesktop
                            onPlay={onPlay}
                            onTafsir={onTafsir}
                            onBookmark={onBookmark}
                            menuActions={menuActions}
                        />
                    ) : null}

                    <div >
                        <AyahArabicText
                            words={mappedWords || words}
                            arabicText={arabicText}
                            wordByWord={showWordByWord}
                        />

                        <AyahTranslations translations={filteredTranslations} highlightQuery={highlightQuery} />
                    </div>
                </div>
            </div>
        </div>
    );
}
