import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Z-Anonyme — Messages anonymes sécurisés";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Logo Circle */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                        borderRadius: "30px",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        marginBottom: 40,
                    }}
                >
                    <span
                        style={{
                            fontSize: 64,
                            fontWeight: 900,
                            color: "white",
                        }}
                    >
                        Z
                    </span>
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: 56,
                        fontWeight: 800,
                        color: "white",
                        margin: 0,
                        lineHeight: 1.2,
                    }}
                >
                    Z-Anonyme
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: 24,
                        color: "#94a3b8",
                        marginTop: 16,
                        textAlign: "center",
                        maxWidth: 600,
                    }}
                >
                    Recevez des messages anonymes. 100% sécurisé.
                </p>

                {/* Badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 32,
                        padding: "8px 20px",
                        borderRadius: 999,
                        background: "rgba(59, 130, 246, 0.15)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                    }}
                >
                    <span style={{ fontSize: 16, color: "#60a5fa" }}>
                        🔒 Anonymat garanti
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
