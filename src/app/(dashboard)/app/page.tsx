"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { strings } from "@/lib/strings";
import {
    getMessages,
    updateMessageStatus,
    deleteMessage,
    bulkUpdateMessages,
    bulkDeleteMessages,
} from "@/lib/firestore-helpers";
import type { Message, MessageStatus } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InboxSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CopyButton } from "@/components/ui/copy-button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Archive,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    MessageCircle,
    Filter,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { DocumentSnapshot } from "firebase/firestore";

export default function InboxPage() {
    const { appUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState<MessageStatus | "ALL">("ALL");
    const [search, setSearch] = useState("");
    const [selectedLink, setSelectedLink] = useState<string>("ALL");
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const fetchMessages = useCallback(async (status?: MessageStatus) => {
        if (!appUser) return;
        setLoading(true);
        setSelected(new Set());
        try {
            const result = await getMessages(
                appUser.uid,
                status || undefined,
                undefined,
                20
            );
            setMessages(result.messages);
            setLastDoc(result.lastDoc);
            setHasMore(result.messages.length === 20);
        } catch {
            toast.error(strings.common.error);
        } finally {
            setLoading(false);
        }
    }, [appUser]);

    useEffect(() => {
        const status = activeTab === "ALL" ? undefined : activeTab;
        fetchMessages(status as MessageStatus | undefined);
    }, [activeTab, fetchMessages]);

    const loadMore = async () => {
        if (!appUser || !lastDoc) return;
        setLoadingMore(true);
        try {
            const status = activeTab === "ALL" ? undefined : activeTab;
            const result = await getMessages(
                appUser.uid,
                status as MessageStatus | undefined,
                lastDoc,
                20
            );
            setMessages((prev) => [...prev, ...result.messages]);
            setLastDoc(result.lastDoc);
            setHasMore(result.messages.length === 20);
        } catch {
            toast.error(strings.common.error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleStatusChange = async (messageId: string, status: MessageStatus) => {
        try {
            await updateMessageStatus(messageId, status);
            setMessages((prev) =>
                prev.map((m) => (m.messageId === messageId ? { ...m, status } : m))
            );
            toast.success(status === "READ" ? "Marqué comme lu" : status === "ARCHIVED" ? "Archivé" : "Marqué comme non lu");
        } catch {
            toast.error(strings.common.error);
        }
    };

    const handleDelete = async (messageId: string) => {
        try {
            await deleteMessage(messageId);
            setMessages((prev) => prev.filter((m) => m.messageId !== messageId));
            toast.success("Message supprimé");
        } catch {
            toast.error(strings.common.error);
        }
    };

    const handleBulkAction = async (action: "READ" | "ARCHIVED" | "NEW" | "DELETE") => {
        const ids = Array.from(selected);
        if (ids.length === 0) return;

        try {
            if (action === "DELETE") {
                await bulkDeleteMessages(ids);
                setMessages((prev) => prev.filter((m) => !selected.has(m.messageId)));
            } else {
                await bulkUpdateMessages(ids, { status: action });
                setMessages((prev) =>
                    prev.map((m) =>
                        selected.has(m.messageId) ? { ...m, status: action } : m
                    )
                );
            }
            setSelected(new Set());
            toast.success(`${ids.length} message(s) mis à jour`);
        } catch {
            toast.error(strings.common.error);
        }
    };

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === filteredMessages.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filteredMessages.map((m) => m.messageId)));
        }
    };

    // Extract unique link names for the filter dropdown
    const linkNames = Array.from(
        new Set(messages.map((m) => m.linkName || "Profil public").filter(Boolean))
    ).sort();

    const filteredMessages = messages.filter((m) => {
        const matchesSearch = search
            ? m.content.toLowerCase().includes(search.toLowerCase()) ||
            (m.linkName || "").toLowerCase().includes(search.toLowerCase())
            : true;
        const matchesLink =
            selectedLink === "ALL"
                ? true
                : (m.linkName || "Profil public") === selectedLink;
        return matchesSearch && matchesLink;
    });

    const appUrl = typeof window !== "undefined" ? window.location.origin : "";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{strings.messages.title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {messages.length} message(s)
                    </p>
                </div>
                {appUser?.username && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {appUrl}/u/{appUser.username}
                        </span>
                        <CopyButton
                            text={`${appUrl}/u/${appUser.username}`}
                            label={strings.links.copyLink}
                            variant="outline"
                            size="sm"
                        />
                    </div>
                )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MessageStatus | "ALL")}>
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="ALL">{strings.messages.all}</TabsTrigger>
                    <TabsTrigger value="NEW">
                        {strings.messages.new}
                    </TabsTrigger>
                    <TabsTrigger value="READ">{strings.messages.read}</TabsTrigger>
                    <TabsTrigger value="ARCHIVED">{strings.messages.archived}</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Search + Filter + Bulk Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={strings.messages.search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-xl pl-9"
                    />
                </div>
                {linkNames.length > 1 && (
                    <Select value={selectedLink} onValueChange={setSelectedLink}>
                        <SelectTrigger className="w-full sm:w-[200px] rounded-xl">
                            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Filtrer par lien" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les liens</SelectItem>
                            {linkNames.map((name) => (
                                <SelectItem key={name} value={name}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                {selected.size > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {selected.size} {strings.messages.selected}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handleBulkAction("READ")}>
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            Lu
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleBulkAction("ARCHIVED")}>
                            <Archive className="mr-1 h-3.5 w-3.5" />
                            Archiver
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleBulkAction("DELETE")}>
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Supprimer
                        </Button>
                    </div>
                )}
            </div>

            {/* Messages */}
            {loading ? (
                <InboxSkeleton />
            ) : filteredMessages.length === 0 ? (
                <EmptyState
                    icon="messages"
                    title={strings.messages.empty}
                    subtitle={strings.messages.emptySubtitle}
                />
            ) : (
                <div className="space-y-2">
                    {/* Select All */}
                    <div className="flex items-center gap-2 px-1">
                        <Checkbox
                            checked={selected.size === filteredMessages.length && filteredMessages.length > 0}
                            onCheckedChange={toggleSelectAll}
                        />
                        <span className="text-xs text-muted-foreground">
                            {selected.size === filteredMessages.length
                                ? strings.messages.deselectAll
                                : strings.messages.selectAll}
                        </span>
                    </div>

                    {filteredMessages.map((message) => (
                        <Card
                            key={message.messageId}
                            className={`border-border/40 transition-all duration-200 hover:shadow-sm ${message.status === "NEW" ? "border-l-2 border-l-foreground" : ""
                                }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        checked={selected.has(message.messageId)}
                                        onCheckedChange={() => toggleSelect(message.messageId)}
                                        className="mt-1"
                                    />
                                    <Link
                                        href={`/app/message/${message.messageId}`}
                                        className="flex-1 min-w-0"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            {message.status === "NEW" && (
                                                <Badge variant="default" className="text-[10px] px-1.5 py-0">
                                                    Nouveau
                                                </Badge>
                                            )}
                                            {message.linkName && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] px-1.5 py-0 text-muted-foreground font-normal border-border/60"
                                                >
                                                    via {message.linkName}
                                                </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(message.createdAt, {
                                                    addSuffix: true,
                                                    locale: fr,
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm line-clamp-2">{message.content}</p>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        {message.status === "NEW" ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleStatusChange(message.messageId, "READ")}
                                                title={strings.messages.markRead}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleStatusChange(message.messageId, "NEW")}
                                                title={strings.messages.markUnread}
                                            >
                                                <EyeOff className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                handleStatusChange(
                                                    message.messageId,
                                                    message.status === "ARCHIVED" ? "READ" : "ARCHIVED"
                                                )
                                            }
                                            title={
                                                message.status === "ARCHIVED"
                                                    ? strings.messages.unarchive
                                                    : strings.messages.archive
                                            }
                                        >
                                            <Archive className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() => handleDelete(message.messageId)}
                                            title={strings.messages.delete}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Load More */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="outline"
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="rounded-xl"
                            >
                                {loadingMore ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                )}
                                {strings.messages.loadMore}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
