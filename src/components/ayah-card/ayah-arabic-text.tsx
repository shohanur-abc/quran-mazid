"use client";

import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AyahWord = {
    id: string | number;
    text: string;
    tooltip?: React.ReactNode;
    highlighted?: boolean;
    onClick?: () => void;
};

export interface AyahArabicTextProps {
    words?: AyahWord[];
    arabicText?: string;
}


export function AyahArabicText({
    words,
    arabicText,
}: AyahArabicTextProps) {
    return (
        <p
            dir="rtl"
            // data-font="uthmani"
            className="mb-4 text-right font-arabic"
            style={{
                fontSize: "var(--arabic-font-size)",
            }}
        >
            {words?.length ? (
                words.map((word, index) => {
                    const content = (
                        <span
                            data-uthmani={word.text}
                            className={cn(
                                "inline-flex cursor-pointer",
                                word.highlighted ? "text-primary" : "group-hover:text-primary",
                            )}
                        >
                            {word.text}
                        </span>
                    );

                    return (
                        <React.Fragment key={word.id}>
                            <span id="word-interaction" className="group cursor-pointer" data-state="closed" onClick={word.onClick}>
                                {word.tooltip ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>{content}</TooltipTrigger>
                                        <TooltipContent>{word.tooltip}</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    content
                                )}
                            </span>
                            {index < words.length - 1 ? " " : null}
                        </React.Fragment>
                    );
                })
            ) : (
                arabicText
            )}

            {/* {verseNumber ? (
                <span className="mx-3 font-ayat text-5xl">
                    {verseNumber}
                </span>
            ) : null} */}
        </p>
    );
}
