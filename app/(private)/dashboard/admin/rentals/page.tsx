"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/shared/StatusBadge";
import DataTable from "@/components/dashboard/DataTable";
import { adminService } from "@/service/adminService";
import { shortDate } from "@/lib/format";
import type { RequestStatus } from "@/types/rental.type";

interface Rental {
  id: string; status: RequestStatus; startDate?: string; createdAt: string;
  tenant?: { name: string; email: string }; property?: { title: string; city: string };
}

export default function AllRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService.getAllRentals()
      .then((r) => setRentals(r?.data ?? []))
      .catch(() => setError("Couldn't load rental requests. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rental Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rentals.length} total</p>
      </div>
      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <Card>
        <CardHeader><CardTitle>Requests</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-64 w-full" /> : (
            <DataTable
              rows={rentals}
              searchText={(r) => `${r.tenant?.name} ${r.tenant?.email} ${r.property?.title} ${r.property?.city}`}
              filter={{ label: "Status", options: ["PENDING", "APPROVED", "ACTIVE", "COMPLETED", "REJECTED"], value: (r) => r.status }}
              columns={[
                { header: "Tenant", cell: (r) => <><p className="font-medium">{r.tenant?.name ?? "Unknown"}</p><p className="text-xs text-muted-foreground">{r.tenant?.email}</p></> },
                { header: "Property", cell: (r) => <><p className="font-medium">{r.property?.title ?? "Unknown"}</p><p className="text-xs text-muted-foreground">{r.property?.city}</p></> },
                { header: "Requested", cell: (r) => shortDate(r.createdAt.slice(0, 10)), className: "text-muted-foreground" },
                { header: "Move-in", cell: (r) => (r.startDate ? shortDate(r.startDate.slice(0, 10)) : "—"), className: "text-muted-foreground" },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}