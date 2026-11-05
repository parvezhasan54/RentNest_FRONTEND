
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RentalRequest } from "@/types/rental.type";
import { getMyPendingRequests } from "@/service/tenant.service";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MyRentalRequests = () => {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getMyPendingRequests();
        setRequests(data);
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to load requests"
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          My Rental Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your rental requests and payment status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rental Requests</CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable
            rows={requests}
            empty="You have not submitted any rental requests yet."
            searchText={(r) =>
              `${r.property.title} ${r.property.address ?? ""} ${r.property.city ?? ""}`
            }
            filter={{
              label: "Status",
              options: [
                "PENDING",
                "APPROVED",
                "ACTIVE",
                "COMPLETED",
                "REJECTED",
              ],
              value: (r) => r.status,
            }}
            columns={[
              {
                header: "Property",
                cell: (r) => (
                  <div>
                    <p className="font-medium">
                      {r.property.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.property.address}, {r.property.city}
                    </p>
                  </div>
                ),
              },
              {
                header: "Dates",
                cell: (r) => (
                  <span className="text-sm">
                    {formatDate(r.startDate)} to {formatDate(r.endDate)}
                  </span>
                ),
                className: "text-muted-foreground",
              },
              {
                header: "Message",
                cell: (r) =>
                  r.message ? (
                    <span
                      className="block max-w-48 truncate text-sm text-muted-foreground"
                      title={r.message}
                    >
                      {r.message}
                    </span>
                  ) : (
                    "—"
                  ),
              },
              {
                header: "Status",
                cell: (r) => (
                  <StatusBadge status={r.status} />
                ),
              },
              {
                header: "Action",
                cell: (r) =>
                  r.status === "APPROVED" ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/dashboard/tenant/payment/${r.id}`
                        )
                      }
                    >
                      Pay Now
                    </Button>
                  ) : (
                    "—"
                  ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyRentalRequests;
