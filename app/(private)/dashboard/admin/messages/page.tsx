"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/dashboard/DataTable";
import { adminService } from "@/service/adminService";

interface Msg { id: string; name: string; email: string; subject: string; message: string; createdAt: string }

export default function AdminMessages() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminService.getAllMessages().then((r) => setRows(r?.data ?? [])).finally(() => setLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rows.length} messages</p></div>
      <Card>
        <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-64 w-full" /> : (
            <DataTable
              rows={rows} pageSize={6}
              searchText={(m) => `${m.name} ${m.email} ${m.subject} ${m.message}`}
              columns={[
                { header: "From", cell: (m) => <><p className="font-medium">{m.name}</p><a className="text-xs text-primary" href={`mailto:${m.email}`}>{m.email}</a></> },
                { header: "Subject", cell: (m) => <span className="font-medium">{m.subject}</span> },
                { header: "Message", cell: (m) => <p className="line-clamp-2 max-w-md text-muted-foreground">{m.message}</p> },
                { header: "Received", cell: (m) => new Date(m.createdAt).toLocaleDateString(), className: "text-muted-foreground" },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}