"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { strings } from "@/lib/strings";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, LogOut, Settings, LayoutDashboard, Shield, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
    const { appUser, logout, isAdmin } = useAuth();
    const { theme, setTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href={appUser ? "/app" : "/"} className="flex items-center gap-2">
                    <Logo size={40} />
                    <span className="text-lg font-semibold tracking-tight">
                        {strings.appName}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden items-center gap-2 md:flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">
                            {theme === "dark" ? strings.common.lightMode : strings.common.darkMode}
                        </span>
                    </Button>

                    {appUser ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={appUser.photoURL} alt={appUser.name} />
                                        <AvatarFallback className="text-xs">
                                            {appUser.name?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex flex-col space-y-1 p-2">
                                    <p className="text-sm font-medium">{appUser.name}</p>
                                    <p className="text-xs text-muted-foreground">{appUser.email}</p>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/app" className="flex items-center gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        {strings.nav.inbox}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/app/settings" className="flex items-center gap-2">
                                        <Settings className="h-4 w-4" />
                                        {strings.nav.settings}
                                    </Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin" className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            {strings.nav.admin}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {strings.nav.logout}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild variant="default" size="sm">
                            <Link href="/login">{strings.nav.login}</Link>
                        </Button>
                    )}
                </div>

                {/* Mobile Nav */}
                <div className="flex items-center gap-2 md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Menu de navigation</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 pt-8">
                                {appUser ? (
                                    <>
                                        <div className="flex items-center gap-3 px-2">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={appUser.photoURL} alt={appUser.name} />
                                                <AvatarFallback>{appUser.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{appUser.name}</p>
                                                <p className="text-xs text-muted-foreground">{appUser.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                                                <Link href="/app"><LayoutDashboard className="mr-2 h-4 w-4" />{strings.nav.inbox}</Link>
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                                                <Link href="/app/links"><Settings className="mr-2 h-4 w-4" />{strings.nav.links}</Link>
                                            </Button>
                                            <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                                                <Link href="/app/settings"><Settings className="mr-2 h-4 w-4" />{strings.nav.settings}</Link>
                                            </Button>
                                            {isAdmin && (
                                                <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                                                    <Link href="/admin"><Shield className="mr-2 h-4 w-4" />{strings.nav.admin}</Link>
                                                </Button>
                                            )}
                                        </div>
                                        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { logout(); setMobileOpen(false); }}>
                                            <LogOut className="mr-2 h-4 w-4" />{strings.nav.logout}
                                        </Button>
                                    </>
                                ) : (
                                    <Button asChild onClick={() => setMobileOpen(false)}>
                                        <Link href="/login">{strings.nav.login}</Link>
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
