"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/dashboard/DataTable";
import { adminService } from "@/service/adminService";
import { currencyCents } from "@/lib/format";

interface Payment {
  id: string; transactionId: string; amount: number; provider: string;
  status: "PENDING" | "COMPLETED" | "FAILED"; createdAt: string;
  user: { name: string; email: string }; rentalRequest: { property?: { title: string } };
}
const variant = { PENDING: "secondary", COMPLETED: "default", FAILED: "destructive" } as const;

export default function AdminPayments() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminService.getAllPayments().then((r) => setRows(r?.data ?? [])).finally(() => setLoading(false)); }, []);

  const total = rows.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rows.length} transactions · {currencyCents(total)} collected</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All transactions</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-64 w-full" /> : (
            <DataTable
              rows={rows}
              searchText={(p) => `${p.user.name} ${p.user.email} ${p.transactionId} ${p.rentalRequest.property?.title}`}
              filter={{ label: "Status", options: ["PENDING", "COMPLETED", "FAILED"], value: (p) => p.status }}
              columns={[
                { header: "Tenant", cell: (p) => <><p className="font-medium">{p.user.name}</p><p className="text-xs text-muted-foreground">{p.user.email}</p></> },
                { header: "Property", cell: (p) => p.rentalRequest.property?.title ?? "—" },
                { header: "Amount", cell: (p) => <span className="font-medium">{currencyCents(p.amount)}</span> },
                { header: "Date", cell: (p) => new Date(p.createdAt).toLocaleDateString(), className: "text-muted-foreground" },
                { header: "Status", cell: (p) => <Badge variant={variant[p.status]}>{p.status}</Badge> },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}