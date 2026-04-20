"use client";

import * as React from "react";
import { Copy, Link as LinkIcon, Share2 } from "lucide-react";
import { AyahActionsMobile, AyahMenuAction } from "./ayah-actions-mobile";
import { AyahActionsDesktop } from "./ayah-actions-desktop";
import { AyahArabicText, AyahWord } from "./ayah-arabic-text";
import { AyahTranslations, AyahTranslation } from "./ayah-translations";

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
}: AyahCardProps) {
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
                            words={words}
                            arabicText={arabicText}

                        />

                        <AyahTranslations translations={translations} />
                    </div>
                </div>
            </div>
        </div>
    );
}
