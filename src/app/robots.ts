import type { MetadataRoute } from "next";

import { getSiteOrigin, isPreviewDeployment } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    const siteOrigin = getSiteOrigin();

    if (isPreviewDeployment()) {
        return {
            rules: {
                userAgent: "*",
                disallow: "/",
            },
            sitemap: `${siteOrigin}/sitemap.xml`,
            host: siteOrigin,
        };
    }

    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${siteOrigin}/sitemap.xml`,
        host: siteOrigin,
    };
}
