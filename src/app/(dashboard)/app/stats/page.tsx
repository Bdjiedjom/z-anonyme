"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, TrendingUp, Link2, Calendar } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface DailyCount {
    date: string;
    count: number;
}

interface LinkStat {
    name: string;
    count: number;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

export default function StatsPage() {
    const { appUser } = useAuth();
    const [totalMessages, setTotalMessages] = useState(0);
    const [thisWeek, setThisWeek] = useState(0);
    const [totalLinks, setTotalLinks] = useState(0);
    const [dailyData, setDailyData] = useState<DailyCount[]>([]);
    const [linkStats, setLinkStats] = useState<LinkStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!appUser) return;

        const fetchStats = async () => {
            if (!db) return;
            try {
                // Fetch all messages
                const messagesRef = collection(db, "users", appUser.uid, "messages");
                const messagesSnap = await getDocs(query(messagesRef, orderBy("createdAt", "desc")));
                const messages = messagesSnap.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                setTotalMessages(messages.length);

                // This week count
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                const weekMessages = messages.filter((m: any) => {
                    const ts = m.createdAt?.toDate?.() || new Date(m.createdAt);
                    return ts >= oneWeekAgo;
                });
                setThisWeek(weekMessages.length);

                // Daily breakdown (last 14 days)
                const dailyCounts: Record<string, number> = {};
                const today = new Date();
                for (let i = 13; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    const key = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
                    dailyCounts[key] = 0;
                }

                messages.forEach((m: any) => {
                    const ts = m.createdAt?.toDate?.() || new Date(m.createdAt);
                    const fourteenDaysAgo = new Date();
                    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
                    if (ts >= fourteenDaysAgo) {
                        const key = ts.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
                        if (dailyCounts[key] !== undefined) {
                            dailyCounts[key]++;
                        }
                    }
                });

                setDailyData(
                    Object.entries(dailyCounts).map(([date, count]) => ({ date, count }))
                );

                // Messages by link
                const linkCounts: Record<string, number> = {};
                messages.forEach((m: any) => {
                    const linkName = m.linkName || m.source || "Profil public";
                    linkCounts[linkName] = (linkCounts[linkName] || 0) + 1;
                });
                setLinkStats(
                    Object.entries(linkCounts)
                        .map(([name, count]) => ({ name, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 6)
                );

                // Fetch links count
                const linksRef = collection(db, "users", appUser.uid, "links");
                const linksSnap = await getDocs(linksRef);
                setTotalLinks(linksSnap.size);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [appUser]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const avgPerDay = dailyData.length > 0
        ? Math.round((dailyData.reduce((sum, d) => sum + d.count, 0) / dailyData.length) * 10) / 10
        : 0;

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Statistiques</h1>
                <p className="text-muted-foreground">
                    Suivez l&apos;activité de votre compte Z-Anonyme.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total messages</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMessages}</div>
                        <p className="text-xs text-muted-foreground">Depuis la création du compte</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{thisWeek}</div>
                        <p className="text-xs text-muted-foreground">Messages reçus ces 7 derniers jours</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Moyenne / jour</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgPerDay}</div>
                        <p className="text-xs text-muted-foreground">Sur les 14 derniers jours</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Liens actifs</CardTitle>
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLinks}</div>
                        <p className="text-xs text-muted-foreground">Liens de partage créés</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Bar Chart - Messages per day */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Messages par jour</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        className="text-xs"
                                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            color: "hsl(var(--foreground))",
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                        name="Messages"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pie Chart - Messages by link */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Par source</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {linkStats.length > 0 ? (
                            <>
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={linkStats}
                                                dataKey="count"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                innerRadius={40}
                                            >
                                                {linkStats.map((_, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--card))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "8px",
                                                    color: "hsl(var(--foreground))",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {linkStats.map((stat, index) => (
                                        <div key={stat.name} className="flex items-center gap-2 text-sm">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="flex-1 truncate text-muted-foreground">
                                                {stat.name}
                                            </span>
                                            <span className="font-medium">{stat.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Aucune donnée à afficher.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
