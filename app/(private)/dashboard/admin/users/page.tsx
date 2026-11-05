
"use client";

import { useEffect, useState } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/dashboard/DataTable";
import { adminService } from "@/service/adminService";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isBanned: boolean;
}

export default function AllUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);

    useEffect(() => {
        adminService.getAllUsers({ page: 1, limit: 500 })
            .then((response) => {
                setUsers(response?.data?.data ?? []);
            })
            .catch(() => {
                toast.error("Couldn't load users");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const toggle = async (user: User) => {
        setBusy(user.id);

        try {
            await adminService.updateUserStatus(user.id, {
                isBanned: !user.isBanned,
            });

            setUsers((prev) =>
                prev.map((item) =>
                    item.id === user.id
                        ? { ...item, isBanned: !user.isBanned }
                        : item
                )
            );

            toast.success(user.isBanned ? "User unbanned" : "User banned");
        } catch {
            toast.error("Couldn't update that user");
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    All Users
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {users.length} registered users
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <Skeleton className="h-64 w-full" />
                    ) : (
                        <DataTable
                            rows={users}
                            searchText={(user) =>
                                `${user.name} ${user.email}`
                            }
                            filter={{
                                label: "Role",
                                options: ["TENANT", "LANDLORD", "ADMIN"],
                                value: (user) => user.role,
                            }}
                            columns={[
                                {
                                    header: "User",
                                    cell: (user) => (
                                        <>
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </>
                                    ),
                                },
                                {
                                    header: "Role",
                                    cell: (user) => (
                                        <Badge variant="secondary">
                                            {user.role}
                                        </Badge>
                                    ),
                                },
                                {
                                    header: "Status",
                                    cell: (user) => (
                                        <Badge
                                            variant={
                                                user.isBanned
                                                    ? "destructive"
                                                    : "default"
                                            }
                                        >
                                            {user.isBanned
                                                ? "Banned"
                                                : "Active"}
                                        </Badge>
                                    ),
                                },
                                {
                                    header: "Action",
                                    cell: (user) =>
                                        user.role === "ADMIN" ? (
                                            "—"
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant={
                                                    user.isBanned
                                                        ? "outline"
                                                        : "destructive"
                                                }
                                                disabled={busy === user.id}
                                                onClick={() => toggle(user)}
                                            >
                                                {user.isBanned ? (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Unban
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ban className="h-4 w-4" />
                                                        Ban
                                                    </>
                                                )}
                                            </Button>
                                        ),
                                },
                            ]}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
