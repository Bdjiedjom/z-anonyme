"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { strings } from "@/lib/strings";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Inbox, Link2, Settings, Shield, Users, Flag, BarChart3 } from "lucide-react";

interface SidebarItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    adminOnly?: boolean;
}

const dashboardItems: SidebarItem[] = [
    { label: strings.nav.inbox, href: "/app", icon: Inbox },
    { label: strings.nav.links, href: "/app/links", icon: Link2 },
    { label: strings.nav.stats, href: "/app/stats", icon: BarChart3 },
    { label: strings.nav.settings, href: "/app/settings", icon: Settings },
];

const adminItems: SidebarItem[] = [
    { label: strings.admin.overview, href: "/admin", icon: BarChart3, adminOnly: true },
    { label: strings.admin.users.title, href: "/admin/users", icon: Users, adminOnly: true },
    { label: strings.admin.reports.title, href: "/admin/reports", icon: Flag, adminOnly: true },
];

export function Sidebar({ variant = "dashboard" }: { variant?: "dashboard" | "admin" }) {
    const pathname = usePathname();
    const { isAdmin } = useAuth();
    const items = variant === "admin" ? adminItems : dashboardItems;

    return (
        <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-background md:block h-full">
            <nav className="flex flex-col gap-1 p-4">
                {variant === "admin" && (
                    <div className="mb-4 flex items-center gap-2 px-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {strings.nav.admin}
                        </span>
                    </div>
                )}
                {items.map((item) => {
                    if (item.adminOnly && !isAdmin) return null;
                    const isActive =
                        item.href === "/app"
                            ? pathname === "/app"
                            : item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-foreground/5 text-foreground"
                                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}

                {variant === "dashboard" && isAdmin && (
                    <>
                        <div className="my-3 border-t border-border/40" />
                        <Link
                            href="/admin"
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                pathname.startsWith("/admin")
                                    ? "bg-foreground/5 text-foreground"
                                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                            )}
                        >
                            <Shield className="h-4 w-4" />
                            {strings.nav.admin}
                        </Link>
                    </>
                )}
            </nav>
        </aside>
    );
}
