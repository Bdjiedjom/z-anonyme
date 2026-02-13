"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by rendering a placeholder until mounted
    if (!mounted) {
        return <div style={{ width: size, height: size }} className={className} />;
    }

    // In Dark mode, we use the white logo. In Light mode, we use the black logo.
    // Assuming filenames: logo-white.png and logo-black.png
    const src = resolvedTheme === "dark" ? "/logo-white.png" : "/logo-black.png";

    return (
        <Image
            src={src}
            alt="Z-Anonyme Logo"
            width={size}
            height={size}
            className={`rounded-full ${className || ""}`}
            style={{ mixBlendMode: resolvedTheme === "dark" ? "screen" : "multiply" }}
            priority
        />
    );
}
