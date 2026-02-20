"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Loader2 } from "lucide-react";

import { OnboardingGuide } from "@/components/dashboard/onboarding-guide";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { appUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !appUser) {
            router.push("/login");
        }
    }, [loading, appUser, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!appUser) return null;

    return (
        <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">
            <OnboardingGuide />
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar variant="dashboard" />
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
