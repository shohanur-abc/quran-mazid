import * as React from "react";
import { HighlightText } from "@/components/ui/highlight-text";

export type AyahTranslation = {
    id: string | number;
    source: string;
    text: string;
};

export interface AyahTranslationsProps {
    translations: AyahTranslation[];
    highlightQuery?: string;
}

export function AyahTranslations({ translations, highlightQuery }: AyahTranslationsProps) {
    return (
        <div className="space-y-4">
            {translations.map((translation) => (
                <div key={translation.id} className="space-y-1">
                    <p className="text-muted-foreground text-sm">
                        {translation.source}
                    </p>
                    <p
                        className=""
                        style={{ fontSize: "var(--translation-font-size)" }}
                    >
                        <HighlightText text={translation.text} query={highlightQuery} />
                    </p>
                </div>
            ))}
        </div>
    );
}
