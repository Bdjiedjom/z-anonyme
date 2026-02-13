"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema, type MessageFormData } from "@/lib/validations";
import { getUserByUsername, sendAnonymousMessage } from "@/lib/firestore-helpers";
import { strings } from "@/lib/strings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send, MessageCircle, CheckCircle2 } from "lucide-react";
import type { AppUser } from "@/lib/types";

export default function PublicUserPage() {
    const params = useParams();
    const username = params?.username as string;
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<MessageFormData>({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: "" },
    });

    useEffect(() => {
        async function fetchUser() {
            if (!username) return;
            try {
                const u = await getUserByUsername(username);
                setUser(u);
            } catch {
                setError(strings.publicForm.userNotFound);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [username]);

    const onSubmit = async (data: MessageFormData) => {
        if (!user) return;
        setSending(true);
        setError(null);
        try {
            await sendAnonymousMessage(user.uid, `public-${user.uid}`, data.content, "Profil Public");
            setSent(true);
        } catch {
            setError(strings.publicForm.error);
        } finally {
            setSending(false);
        }
    };

    const content = form.watch("content");

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md rounded-2xl border-border/40">
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">{strings.publicForm.userNotFound}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (user.status === "SUSPENDED") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md rounded-2xl border-border/40">
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">Ce profil n&apos;est pas disponible.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (sent) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md rounded-2xl border-border/40 shadow-lg">
                    <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold">{strings.sent.title}</h2>
                        <p className="text-center text-sm text-muted-foreground">
                            {strings.sent.subtitle}
                        </p>
                        <Button
                            variant="outline"
                            className="mt-2 rounded-xl"
                            onClick={() => {
                                setSent(false);
                                form.reset();
                            }}
                        >
                            {strings.sent.sendAnother}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12" suppressHydrationWarning>
            <Card className="w-full max-w-md rounded-2xl border-border/40 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <MessageCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">
                        {strings.publicForm.title}
                    </CardTitle>
                    <CardDescription>
                        à <span className="font-medium text-foreground">@{user.username || user.name}</span>
                        <br />
                        {strings.publicForm.subtitle}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
                        <div className="space-y-2">
                            <Label htmlFor="content" className="sr-only">Message</Label>
                            <Textarea
                                id="content"
                                placeholder={strings.publicForm.placeholder}
                                className="min-h-[140px] resize-none rounded-xl text-base"
                                maxLength={500}
                                {...form.register("content")}
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                    {form.formState.errors.content?.message}
                                </span>
                                <span className={content.length > 450 ? "text-destructive" : ""}>
                                    {content.length}/500
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-destructive/10 p-3 text-center text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full rounded-xl"
                            size="lg"
                            disabled={sending || !content.trim()}
                        >
                            {sending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-4 w-4" />
                            )}
                            {sending ? strings.publicForm.sending : strings.publicForm.send}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <footer className="fixed bottom-4 text-center text-xs text-muted-foreground">
                Propulsé par <span className="font-medium">Z-Anonyme</span>
            </footer>
        </div>
    );
}
