"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { appUser, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!appUser) {
                router.push("/login");
            } else if (!isAdmin) {
                router.push("/app");
            }
        }
    }, [loading, appUser, isAdmin, router]);

    if (loading) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-background"
                suppressHydrationWarning
            >
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!appUser || !isAdmin) return null;

    return (
        <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar variant="admin" />
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
