import * as React from "react";

export type AyahTranslation = {
    id: string | number;
    source: string;
    text: string;
};

export interface AyahTranslationsProps {
    translations: AyahTranslation[];
}

export function AyahTranslations({ translations }: AyahTranslationsProps) {
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
                        {translation.text}
                    </p>
                </div>
            ))}
        </div>
    );
}
