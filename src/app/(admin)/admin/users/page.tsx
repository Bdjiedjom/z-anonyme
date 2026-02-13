"use client";

import { useEffect, useState } from "react";
import { strings } from "@/lib/strings";
import {
    getAllUsers,
    updateUserRole,
    updateUserStatus,
} from "@/lib/firestore-helpers";
import type { AppUser } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { Search, MoreHorizontal, Shield, ShieldOff, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const u = await getAllUsers();
                setUsers(u);
            } catch {
                toast.error(strings.common.error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const handleRoleChange = async (uid: string, role: "USER" | "ADMIN") => {
        try {
            await updateUserRole(uid, role);
            setUsers((prev) =>
                prev.map((u) => (u.uid === uid ? { ...u, role } : u))
            );
            toast.success(`Rôle mis à jour: ${role}`);
        } catch {
            toast.error(strings.common.error);
        }
    };

    const handleStatusChange = async (uid: string, status: "ACTIVE" | "SUSPENDED") => {
        try {
            await updateUserStatus(uid, status);
            setUsers((prev) =>
                prev.map((u) => (u.uid === uid ? { ...u, status } : u))
            );
            toast.success(`Statut mis à jour: ${status}`);
        } catch {
            toast.error(strings.common.error);
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            (u.username && u.username.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{strings.admin.users.title}</h1>
                <p className="text-sm text-muted-foreground">
                    {users.length} utilisateur(s)
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={strings.admin.users.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-xl pl-9"
                />
            </div>

            <Card className="rounded-2xl border-border/40">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-4">
                            <TableSkeleton rows={5} cols={5} />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Utilisateur</TableHead>
                                    <TableHead>Pseudo</TableHead>
                                    <TableHead>{strings.admin.users.role}</TableHead>
                                    <TableHead>{strings.admin.users.status}</TableHead>
                                    <TableHead>{strings.admin.users.joinedAt}</TableHead>
                                    <TableHead className="text-right">{strings.admin.users.actions}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.uid}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.photoURL} />
                                                    <AvatarFallback className="text-xs">
                                                        {user.name?.charAt(0)?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {user.username ? `@${user.username}` : "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.status === "ACTIVE" ? "outline" : "destructive"}
                                            >
                                                {user.status === "ACTIVE" ? "Actif" : "Suspendu"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {format(user.createdAt, "P", { locale: fr })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {user.role === "USER" ? (
                                                        <DropdownMenuItem onClick={() => handleRoleChange(user.uid, "ADMIN")}>
                                                            <Shield className="mr-2 h-4 w-4" />
                                                            {strings.admin.users.makeAdmin}
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleRoleChange(user.uid, "USER")}>
                                                            <ShieldOff className="mr-2 h-4 w-4" />
                                                            {strings.admin.users.removeAdmin}
                                                        </DropdownMenuItem>
                                                    )}
                                                    {user.status === "ACTIVE" ? (
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleStatusChange(user.uid, "SUSPENDED")}
                                                        >
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            {strings.admin.users.suspend}
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange(user.uid, "ACTIVE")}
                                                        >
                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                            {strings.admin.users.activate}
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
