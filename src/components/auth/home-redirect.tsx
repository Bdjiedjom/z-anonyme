"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export function HomeAuthRedirect() {
    const { appUser, loading } = useAuth();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!loading && appUser) {
            setIsRedirecting(true);
            router.replace("/app");
        }
    }, [loading, appUser, router]);

    if (isRedirecting) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return null;
}
