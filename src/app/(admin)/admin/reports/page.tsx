"use client";

import { useEffect, useState } from "react";
import { strings } from "@/lib/strings";
import {
    getReports,
    resolveReport,
    deleteMessage,
    updateUserStatus,
    getMessage,
} from "@/lib/firestore-helpers";
import type { Report, Message } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/loading-skeleton";
import { CheckCircle, Trash2, UserX, Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReportWithMessage extends Report {
    message?: Message | null;
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<ReportWithMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"OPEN" | "RESOLVED">("OPEN");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchReports = async (status: "OPEN" | "RESOLVED") => {
        setLoading(true);
        try {
            const r = await getReports(status);
            // Fetch associated messages
            const withMessages = await Promise.all(
                r.map(async (report) => {
                    try {
                        const msg = await getMessage(report.messageId);
                        return { ...report, message: msg };
                    } catch {
                        return { ...report, message: null };
                    }
                })
            );
            setReports(withMessages);
        } catch (err) {
            console.error("Fetch reports error:", err);
            toast.error("Erreur: " + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(activeTab);
    }, [activeTab]);

    const handleResolve = async (reportId: string) => {
        setProcessingId(reportId);
        try {
            await resolveReport(reportId);
            setReports((prev) => prev.filter((r) => r.reportId !== reportId));
            toast.success("Signalement résolu");
        } catch {
            toast.error(strings.common.error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteMessage = async (report: ReportWithMessage) => {
        setProcessingId(report.reportId);
        try {
            if (report.messageId) {
                await deleteMessage(report.messageId);
            }
            await resolveReport(report.reportId);
            setReports((prev) => prev.filter((r) => r.reportId !== report.reportId));
            toast.success("Message supprimé et signalement résolu");
        } catch {
            toast.error(strings.common.error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleSuspendUser = async (report: ReportWithMessage) => {
        if (!report.message?.recipientUid) return;
        setProcessingId(report.reportId);
        try {
            await updateUserStatus(report.message.recipientUid, "SUSPENDED");
            await resolveReport(report.reportId);
            setReports((prev) => prev.filter((r) => r.reportId !== report.reportId));
            toast.success("Utilisateur suspendu et signalement résolu");
        } catch {
            toast.error(strings.common.error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6" suppressHydrationWarning>
            <div>
                <h1 className="text-2xl font-bold">{strings.admin.reports.title}</h1>
                <p className="text-sm text-muted-foreground">
                    {reports.length} signalement(s)
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "OPEN" | "RESOLVED")}>
                <TabsList>
                    <TabsTrigger value="OPEN">
                        <Flag className="mr-2 h-4 w-4" />
                        {strings.admin.reports.open}
                    </TabsTrigger>
                    <TabsTrigger value="RESOLVED">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {strings.admin.reports.resolved}
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {loading ? (
                <PageSkeleton />
            ) : reports.length === 0 ? (
                <EmptyState
                    icon="reports"
                    title="Aucun signalement"
                    subtitle={activeTab === "OPEN" ? "Aucun signalement en attente." : "Aucun signalement résolu."}
                />
            ) : (
                <div className="space-y-3">
                    {reports.map((report) => (
                        <Card key={report.reportId} className="rounded-2xl border-border/40">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Flag className="h-4 w-4 text-muted-foreground" />
                                        <CardTitle className="text-base">
                                            {strings.reportDialog.reasons[report.reason as keyof typeof strings.reportDialog.reasons] || report.reason}
                                        </CardTitle>
                                        <Badge variant={report.status === "OPEN" ? "destructive" : "secondary"}>
                                            {report.status === "OPEN" ? "Ouvert" : "Résolu"}
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {format(report.createdAt, "Pp", { locale: fr })}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Message content */}
                                {report.message && (
                                    <div className="rounded-xl bg-muted/30 p-4">
                                        <p className="text-sm">{report.message.content}</p>
                                    </div>
                                )}

                                {report.note && (
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-medium">Note:</span> {report.note}
                                    </div>
                                )}

                                {/* Actions */}
                                {report.status === "OPEN" && (
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl"
                                            onClick={() => handleResolve(report.reportId)}
                                            disabled={processingId === report.reportId}
                                        >
                                            {processingId === report.reportId ? (
                                                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                            )}
                                            {strings.admin.reports.resolve}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl text-destructive"
                                            onClick={() => handleDeleteMessage(report)}
                                            disabled={processingId === report.reportId}
                                        >
                                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                                            {strings.admin.reports.deleteMessage}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl text-destructive"
                                            onClick={() => handleSuspendUser(report)}
                                            disabled={processingId === report.reportId}
                                        >
                                            <UserX className="mr-1 h-3.5 w-3.5" />
                                            {strings.admin.reports.suspendUser}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
