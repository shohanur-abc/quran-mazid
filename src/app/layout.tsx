import type { Metadata } from "next";
import { Amiri, Cairo, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./provider";
import localFont from 'next/font/local'
import { cn } from "@/lib/utils"; import { SiteHeader } from "@/components/layout/site-header";
import { getBaseUrl, isPreviewDeployment, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn("h-full scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable, uthmani.variable, amiri.variable, cairo.variable)}
        >
            <body className="@container min-h-full">
                <Provider>
                    <div className=" h-full bg-background">
                        <SiteHeader />
                        {children}
                    </div>
                </Provider>
            </body>
        </html>
    );
}


const uthmani = localFont({
    src: './fonts/uthmani.ttf',
    variable: '--font-uthmani',
})

const cairo = Cairo({
    variable: "--font-cairo",
    subsets: ["latin", "arabic"],
    weight: ["400", "500", "600", "700"],
});

const amiri = Amiri({
    variable: "--font-amiri",
    weight: "400",
    subsets: ["arabic"],
});


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export const metadata: Metadata = {
    metadataBase: getBaseUrl(),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    alternates: {
        canonical: "/",
    },
    keywords: [
        "Quran",
        "Al Quran",
        "Quran Mazid",
        "Surah",
        "Juz",
        "Tafsir",
        "Word by word Quran",
        "Islamic study",
    ],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "education",
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: "/",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} Preview`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: ["/twitter-image"],
    },
    robots: isPreviewDeployment()
        ? {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: true,
                "max-video-preview": -1,
                "max-image-preview": "none",
                "max-snippet": -1,
            },
        }
        : {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
};
