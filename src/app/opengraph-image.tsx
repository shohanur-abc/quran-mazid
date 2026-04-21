import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/seo";

export const alt = `${SITE_NAME} social preview`;
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
                    background: "#0f172a",
                    color: "#f8fafc",
                    fontSize: 64,
                    fontWeight: 700,
                    letterSpacing: -1,
                }}
            >
                <div>{SITE_NAME}</div>
                <div
                    style={{
                        marginTop: 20,
                        fontSize: 30,
                        fontWeight: 400,
                        opacity: 0.9,
                    }}
                >
                    Read Quran with clarity and speed
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
