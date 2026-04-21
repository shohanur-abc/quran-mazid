const FALLBACK_SITE_URL = "https://quran-mazid-beta.vercel.app";

export const SITE_NAME = "Quran Mazid";
export const SITE_DESCRIPTION =
    "A modern Quran reading experience focused on speed, clarity, and flexible navigation across Surah, Juz, Page, Ruku, Manzil, Hizb, and Sajda.";

export function isPreviewDeployment(): boolean {
    return process.env.VERCEL_ENV === "preview";
}

export function getBaseUrl(): URL {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
        return new URL(siteUrl);
    }

    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
        return new URL(`https://${vercelUrl}`);
    }

    if (process.env.NODE_ENV === "development") {
        return new URL("http://localhost:3000");
    }

    return new URL(FALLBACK_SITE_URL);
}

export function getSiteOrigin(): string {
    return getBaseUrl().toString().replace(/\/$/, "");
}
