import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/seo";

export const alt = `${SITE_NAME} Twitter preview`;
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    background: "#020617",
                    color: "#e2e8f0",
                    fontSize: 60,
                    fontWeight: 700,
                    letterSpacing: -1,
                }}
            >
                <div>{SITE_NAME}</div>
                <div
                    style={{
                        marginTop: 20,
                        fontSize: 28,
                        fontWeight: 400,
                        opacity: 0.9,
                    }}
                >
                    Quran reading and exploration
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
