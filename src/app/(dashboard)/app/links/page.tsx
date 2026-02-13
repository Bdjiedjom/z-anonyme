"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { strings } from "@/lib/strings";
import {
    getLinks,
    createLink,
    updateLink,
    deleteLink,
    rotateToken,
} from "@/lib/firestore-helpers";
import type { ShareLink } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageSkeleton } from "@/components/ui/loading-skeleton";
import {
    Plus,
    Link2,
    RefreshCw,
    Trash2,
    Globe,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function LinksPage() {
    const { appUser } = useAuth();
    const [links, setLinks] = useState<ShareLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newExpiry, setNewExpiry] = useState("");
    const [newMaxMessages, setNewMaxMessages] = useState("");
    const [creating, setCreating] = useState(false);

    const appUrl = typeof window !== "undefined" ? window.location.origin : "";

    useEffect(() => {
        async function fetchLinks() {
            if (!appUser) return;
            try {
                const l = await getLinks(appUser.uid);
                setLinks(l);
            } catch {
                toast.error(strings.common.error);
            } finally {
                setLoading(false);
            }
        }
        fetchLinks();
    }, [appUser]);

    const handleCreate = async () => {
        if (!appUser || !newName.trim()) return;
        setCreating(true);
        try {
            const expiresAt = newExpiry ? new Date(newExpiry) : null;
            const maxMessages = newMaxMessages ? parseInt(newMaxMessages) : null;
            const link = await createLink(appUser.uid, newName, expiresAt, maxMessages);
            setLinks((prev) => [link, ...prev]);
            setCreateOpen(false);
            setNewName("");
            setNewExpiry("");
            setNewMaxMessages("");
            toast.success("Lien créé !");
        } catch {
            toast.error(strings.common.error);
        } finally {
            setCreating(false);
        }
    };

    const handleToggle = async (link: ShareLink) => {
        try {
            await updateLink(link.linkId, { isActive: !link.isActive });
            setLinks((prev) =>
                prev.map((l) =>
                    l.linkId === link.linkId ? { ...l, isActive: !l.isActive } : l
                )
            );
            toast.success(link.isActive ? "Lien désactivé" : "Lien activé");
        } catch {
            toast.error(strings.common.error);
        }
    };

    const handleRotate = async (link: ShareLink) => {
        try {
            const newToken = await rotateToken(link.linkId);
            setLinks((prev) =>
                prev.map((l) =>
                    l.linkId === link.linkId ? { ...l, token: newToken } : l
                )
            );
            toast.success("Token renouvelé !");
        } catch {
            toast.error(strings.common.error);
        }
    };

    const handleDelete = async (linkId: string) => {
        try {
            await deleteLink(linkId);
            setLinks((prev) => prev.filter((l) => l.linkId !== linkId));
            toast.success("Lien supprimé");
        } catch {
            toast.error(strings.common.error);
        }
    };

    if (loading) return <PageSkeleton />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{strings.links.title}</h1>
                    <p className="text-sm text-muted-foreground">{links.length} lien(s)</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl">
                            <Plus className="mr-2 h-4 w-4" />
                            {strings.links.create}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>{strings.links.create}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>{strings.links.name}</Label>
                                <Input
                                    placeholder={strings.links.namePlaceholder}
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{strings.links.expiresAt}</Label>
                                <Input
                                    type="datetime-local"
                                    value={newExpiry}
                                    onChange={(e) => setNewExpiry(e.target.value)}
                                    className="rounded-xl"
                                />
                                <p className="text-xs text-muted-foreground">{strings.links.noExpiry}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>{strings.links.maxMessages}</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder={strings.links.noLimit}
                                    value={newMaxMessages}
                                    onChange={(e) => setNewMaxMessages(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => setCreateOpen(false)}>
                                {strings.common.cancel}
                            </Button>
                            <Button
                                className="rounded-xl"
                                onClick={handleCreate}
                                disabled={!newName.trim() || creating}
                            >
                                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {strings.links.create}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Public link info */}
            {appUser?.username && (
                <Card className="rounded-2xl border-border/40">
                    <CardContent className="flex items-center justify-between gap-3 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{strings.links.publicLink}</p>
                                <p className="text-xs text-muted-foreground">
                                    {appUrl}/u/{appUser.username}
                                </p>
                            </div>
                        </div>
                        <CopyButton
                            text={`${appUrl}/u/${appUser.username}`}
                            label={strings.links.copyLink}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Links list */}
            {links.length === 0 ? (
                <EmptyState
                    icon="links"
                    title={strings.links.empty}
                    subtitle={strings.links.emptySubtitle}
                />
            ) : (
                <div className="space-y-3">
                    {links.map((link) => (
                        <Card key={link.linkId} className="rounded-2xl border-border/40">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center gap-3">
                                    <Link2 className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-base">{link.name}</CardTitle>
                                    <Badge variant={link.isActive ? "default" : "secondary"}>
                                        {link.isActive ? strings.links.active : strings.links.inactive}
                                    </Badge>
                                </div>
                                <Switch
                                    checked={link.isActive}
                                    onCheckedChange={() => handleToggle(link)}
                                />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground truncate flex-1">
                                        {appUrl}/l/{link.token}
                                    </span>
                                    <CopyButton text={`${appUrl}/l/${link.token}`} />
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                    <span>{strings.links.messageCount}: {link.messageCount}</span>
                                    {link.expiresAt && (
                                        <span>
                                            {strings.links.expiresAt}:{" "}
                                            {format(link.expiresAt, "Pp", { locale: fr })}
                                        </span>
                                    )}
                                    {link.maxMessages && (
                                        <span>{strings.links.maxMessages}: {link.maxMessages}</span>
                                    )}
                                    <span>
                                        {strings.links.created}:{" "}
                                        {format(link.createdAt, "Pp", { locale: fr })}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl"
                                        onClick={() => handleRotate(link)}
                                    >
                                        <RefreshCw className="mr-1 h-3.5 w-3.5" />
                                        {strings.links.rotateToken}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl text-destructive"
                                        onClick={() => handleDelete(link.linkId)}
                                    >
                                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                                        {strings.links.delete}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
