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
    wordByWord?: boolean;
}

export function AyahArabicText({
    words,
    arabicText,
    wordByWord = true, // Default to true based on user request, or make it configurable
}: AyahArabicTextProps) {
    return (
        <div
            dir="rtl"
            className={cn(
                "mb-4 text-right font-arabic",
                wordByWord ? "flex flex-wrap gap-x-5 gap-y-8 leading-normal" : "leading-loose"
            )}
            style={{
                fontSize: "var(--arabic-font-size)",
            }}
        >
            {words?.length ? (
                words.map((word, index) => {
                    if (wordByWord) {
                        return (
                            <div key={word.id} className="group inline-flex flex-col items-center justify-start cursor-pointer" onClick={word.onClick}>
                                <span
                                    data-uthmani={word.text}
                                    className={cn(
                                        "transition-colors",
                                        word.highlighted ? "text-primary" : "group-hover:text-primary"
                                    )}
                                >
                                    {word.text}
                                </span>
                                {word.tooltip && (
                                    <span className="text-sm text-center text-muted-foreground mt-2 font-sans font-normal" style={{ fontSize: "1rem", lineHeight: "1.4" }}>
                                        {word.tooltip}
                                    </span>
                                )}
                            </div>
                        );
                    }

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
        </div>
    );
}
