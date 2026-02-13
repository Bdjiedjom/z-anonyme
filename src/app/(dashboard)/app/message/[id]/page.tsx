"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { strings } from "@/lib/strings";
import {
    getMessage,
    updateMessageStatus,
    deleteMessage,
    createReport,
} from "@/lib/firestore-helpers";
import type { Message } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PageSkeleton } from "@/components/ui/loading-skeleton";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Archive,
    Trash2,
    Flag,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function MessageDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { appUser } = useAuth();
    const messageId = params?.id as string;
    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportNote, setReportNote] = useState("");
    const [reporting, setReporting] = useState(false);

    useEffect(() => {
        async function fetchMessage() {
            if (!messageId) return;
            try {
                const m = await getMessage(messageId);
                setMessage(m);
                // Auto-mark as read
                if (m && m.status === "NEW") {
                    await updateMessageStatus(messageId, "READ");
                    setMessage({ ...m, status: "READ" });
                }
            } catch {
                toast.error(strings.common.error);
            } finally {
                setLoading(false);
            }
        }
        fetchMessage();
    }, [messageId]);

    const handleStatusChange = async (status: "NEW" | "READ" | "ARCHIVED") => {
        if (!message) return;
        try {
            await updateMessageStatus(message.messageId, status);
            setMessage({ ...message, status });
            toast.success("Statut mis à jour");
        } catch {
            toast.error(strings.common.error);
        }
    };

    const handleDelete = async () => {
        if (!message) return;
        try {
            await deleteMessage(message.messageId);
            toast.success("Message supprimé");
            router.push("/app");
        } catch {
            toast.error(strings.common.error);
        }
    };

    const handleReport = async () => {
        if (!message || !appUser || !reportReason) return;
        setReporting(true);
        try {
            await createReport(message.messageId, appUser.uid, reportReason, reportNote);
            toast.success(strings.reportDialog.success);
            setReportOpen(false);
            setReportReason("");
            setReportNote("");
        } catch {
            toast.error(strings.common.error);
        } finally {
            setReporting(false);
        }
    };

    if (loading) return <PageSkeleton />;

    if (!message) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground">Message introuvable.</p>
                <Button variant="outline" className="mt-4 rounded-xl" onClick={() => router.push("/app")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {strings.common.back}
                </Button>
            </div>
        );
    }

    const statusBadge = {
        NEW: <Badge variant="default">Nouveau</Badge>,
        READ: <Badge variant="secondary">Lu</Badge>,
        ARCHIVED: <Badge variant="outline">Archivé</Badge>,
    };

    return (
        <div className="space-y-6">
            {/* Back button */}
            <Button variant="ghost" className="rounded-xl" onClick={() => router.push("/app")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {strings.common.back}
            </Button>

            {/* Message card */}
            <Card className="rounded-2xl border-border/40">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">{strings.messages.detail}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {strings.messages.receivedAt}{" "}
                            {format(message.createdAt, "PPp", { locale: fr })}
                        </p>
                    </div>
                    {statusBadge[message.status]}
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl bg-muted/30 p-6">
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
                {message.status === "NEW" || message.status === "ARCHIVED" ? (
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleStatusChange("READ")}>
                        <Eye className="mr-2 h-4 w-4" />
                        {strings.messages.markRead}
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleStatusChange("NEW")}>
                        <EyeOff className="mr-2 h-4 w-4" />
                        {strings.messages.markUnread}
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() =>
                        handleStatusChange(message.status === "ARCHIVED" ? "READ" : "ARCHIVED")
                    }
                >
                    <Archive className="mr-2 h-4 w-4" />
                    {message.status === "ARCHIVED" ? strings.messages.unarchive : strings.messages.archive}
                </Button>

                {/* Report Dialog */}
                <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-xl">
                            <Flag className="mr-2 h-4 w-4" />
                            {strings.messages.report}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>{strings.reportDialog.title}</DialogTitle>
                            <DialogDescription>
                                Ce message sera examiné par notre équipe de modération.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Select value={reportReason} onValueChange={setReportReason}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder={strings.reportDialog.reasonPlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(strings.reportDialog.reasons).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Textarea
                                placeholder={strings.reportDialog.notePlaceholder}
                                value={reportNote}
                                onChange={(e) => setReportNote(e.target.value)}
                                className="rounded-xl"
                                maxLength={500}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => setReportOpen(false)}>
                                {strings.common.cancel}
                            </Button>
                            <Button
                                className="rounded-xl"
                                onClick={handleReport}
                                disabled={!reportReason || reporting}
                            >
                                {reporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {strings.reportDialog.submit}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-destructive"
                    onClick={handleDelete}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {strings.messages.delete}
                </Button>
            </div>
        </div>
    );
}
