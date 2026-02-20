"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { appUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && appUser) {
            router.replace("/app");
        }
    }, [loading, appUser, router]);

    // Show loading spinner while Auth checks session or if a redirect is imminent
    if (loading || appUser) {
        return (
            <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return <>{children}</>;
}
