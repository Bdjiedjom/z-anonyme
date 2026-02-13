"use client";

import { useEffect, useState } from "react";
import { strings } from "@/lib/strings";
import { getAdminStats } from "@/lib/firestore-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCardSkeleton } from "@/components/ui/loading-skeleton";
import { Users, MessageCircle, Flag, Link2 } from "lucide-react";
import { toast } from "sonner";

interface Stats {
    totalUsers: number;
    totalMessages: number;
    totalReports: number;
    activeLinks: number;
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const s = await getAdminStats();
                setStats(s);
            } catch {
                toast.error(strings.common.error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            title: strings.admin.totalUsers,
            value: stats?.totalUsers ?? 0,
            icon: Users,
        },
        {
            title: strings.admin.totalMessages,
            value: stats?.totalMessages ?? 0,
            icon: MessageCircle,
        },
        {
            title: strings.admin.totalReports,
            value: stats?.totalReports ?? 0,
            icon: Flag,
        },
        {
            title: strings.admin.activeLinks,
            value: stats?.activeLinks ?? 0,
            icon: Link2,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{strings.admin.title}</h1>
                <p className="text-sm text-muted-foreground">{strings.admin.overview}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                    : statCards.map((card) => (
                        <Card key={card.title} className="rounded-2xl border-border/40">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </CardTitle>
                                <card.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{card.value}</div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
