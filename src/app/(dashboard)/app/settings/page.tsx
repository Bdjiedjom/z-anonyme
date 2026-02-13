"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth-context";
import { strings } from "@/lib/strings";
import { settingsSchema, type SettingsFormData } from "@/lib/validations";
import {
    isUsernameTaken,
    claimUsername,
    updateUserSettings,
} from "@/lib/firestore-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, Bell } from "lucide-react";
import { toast } from "sonner";
import {
    requestNotificationPermission,
    isNotificationSupported,
    getNotificationStatus,
} from "@/lib/notifications";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
    const { appUser, refreshUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [pushEnabled, setPushEnabled] = useState(
        typeof window !== "undefined" && getNotificationStatus() === "granted"
    );

    const handlePushToggle = async (checked: boolean) => {
        if (!appUser) return;
        if (checked) {
            if (!isNotificationSupported()) {
                toast.error("Les notifications ne sont pas supportées par ce navigateur.");
                return;
            }
            const token = await requestNotificationPermission(appUser.uid);
            if (token) {
                setPushEnabled(true);
                if (db) {
                    await updateDoc(doc(db, "users", appUser.uid), {
                        notificationsEnabled: true,
                    });
                }
                toast.success("Notifications push activées !");
            } else {
                toast.error("Permission de notification refusée.");
            }
        } else {
            setPushEnabled(false);
            if (db) {
                await updateDoc(doc(db, "users", appUser.uid), {
                    notificationsEnabled: false,
                });
            }
            toast.success("Notifications push désactivées.");
        }
    };

    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: appUser?.name || "",
            username: appUser?.username || "",
            emailNotifications: appUser?.settings?.emailNotifications ?? false,
            showOnlineStatus: appUser?.settings?.showOnlineStatus ?? true,
            allowPublicProfile: appUser?.settings?.allowPublicProfile ?? true,
        },
    });

    const onSubmit = async (data: SettingsFormData) => {
        if (!appUser) return;
        setSaving(true);
        setUsernameError("");

        try {
            // Handle username change
            if (data.username !== appUser.username) {
                const taken = await isUsernameTaken(data.username);
                if (taken) {
                    setUsernameError(strings.settings.usernameTaken);
                    setSaving(false);
                    return;
                }
                const success = await claimUsername(
                    appUser.uid,
                    data.username,
                    data.name,
                    appUser.photoURL || "",
                    appUser.username || undefined
                );
                if (!success) {
                    setUsernameError(strings.settings.usernameTaken);
                    setSaving(false);
                    return;
                }
            }

            // Update user settings
            await updateUserSettings(
                appUser.uid,
                {
                    name: data.name,
                    settings: {
                        emailNotifications: data.emailNotifications,
                        showOnlineStatus: data.showOnlineStatus,
                        allowPublicProfile: data.allowPublicProfile,
                    },
                },
                // Pass username to sync public profile data if name changed
                data.username || appUser.username || undefined
            );

            await refreshUser();
            toast.success(strings.settings.saved);
        } catch {
            toast.error(strings.common.error);
        } finally {
            setSaving(false);
        }
    };

    if (!appUser) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{strings.settings.title}</h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile */}
                <Card className="rounded-2xl border-border/40">
                    <CardHeader>
                        <CardTitle>{strings.settings.profile}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar preview */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={appUser.photoURL} />
                                <AvatarFallback className="text-lg">
                                    {appUser.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{appUser.name}</p>
                                <p className="text-sm text-muted-foreground">{appUser.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">{strings.settings.displayName}</Label>
                            <Input
                                id="name"
                                placeholder={strings.settings.displayNamePlaceholder}
                                className="rounded-xl"
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-xs text-destructive">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">{strings.settings.username}</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">@</span>
                                <Input
                                    id="username"
                                    placeholder={strings.settings.usernamePlaceholder}
                                    className="rounded-xl"
                                    {...form.register("username")}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {strings.settings.usernameHint}
                            </p>
                            {form.formState.errors.username && (
                                <p className="text-xs text-destructive">
                                    {form.formState.errors.username.message}
                                </p>
                            )}
                            {usernameError && (
                                <p className="text-xs text-destructive">{usernameError}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{strings.settings.email}</Label>
                            <Input
                                id="email"
                                value={appUser.email}
                                disabled
                                className="rounded-xl"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="rounded-2xl border-border/40">
                    <CardHeader>
                        <CardTitle>{strings.settings.notifications}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    {strings.settings.emailNotifications}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {strings.settings.emailNotificationsDesc}
                                </p>
                            </div>
                            <Switch
                                checked={form.watch("emailNotifications")}
                                onCheckedChange={(checked) =>
                                    form.setValue("emailNotifications", checked)
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    Notifications push
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Recevoir une notification dans le navigateur à chaque nouveau message.
                                </p>
                            </div>
                            <Switch
                                checked={pushEnabled}
                                onCheckedChange={handlePushToggle}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy */}
                <Card className="rounded-2xl border-border/40">
                    <CardHeader>
                        <CardTitle>{strings.settings.privacy}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    {strings.settings.showOnlineStatus}
                                </p>
                            </div>
                            <Switch
                                checked={form.watch("showOnlineStatus")}
                                onCheckedChange={(checked) =>
                                    form.setValue("showOnlineStatus", checked)
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    {strings.settings.allowPublicProfile}
                                </p>
                            </div>
                            <Switch
                                checked={form.watch("allowPublicProfile")}
                                onCheckedChange={(checked) =>
                                    form.setValue("allowPublicProfile", checked)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save */}
                <Button
                    type="submit"
                    className="w-full rounded-xl sm:w-auto"
                    disabled={saving}
                >
                    {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {saving ? strings.settings.saving : strings.settings.save}
                </Button>
            </form>
        </div>
    );
}
