
"use client";

import { useEffect, useState } from "react";
import { Calendar, CreditCard, Receipt } from "lucide-react";

import { paymentService } from "@/service/paymentService";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  provider: "STRIPE";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt: string | null;
  createdAt: string;
  rentalRequest: {
    id: string;
    property?: {
      title: string;
    };
  };
}

const statusVariant = {
  PENDING: "secondary",
  COMPLETED: "default",
  FAILED: "destructive",
} as const;

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await paymentService.getPaymentHistory();

        if (res.success) {
          setPayments(res.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load payment history:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load payments"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>

          <CardContent className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                  <Skeleton className="h-3 w-32" />
                </div>

                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage all your payment transactions.
        </p>
      </div>

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="py-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Payments
          </CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable
            rows={payments}
            empty="You have not made any payments yet."
            searchText={(p) =>
              `${p.rentalRequest.property?.title ?? "Property"} ${p.transactionId}`
            }
            filter={{
              label: "Status",
              options: ["PENDING", "COMPLETED", "FAILED"],
              value: (p) => p.status,
            }}
            columns={[
              {
                header: "Property",
                cell: (p) => (
                  <span className="font-medium">
                    {p.rentalRequest.property?.title ?? "Property"}
                  </span>
                ),
              },
              {
                header: "Transaction",
                cell: (p) => (
                  <span title={p.transactionId}>
                    {p.transactionId.length > 18
                      ? `${p.transactionId.slice(0, 18)}…`
                      : p.transactionId}
                  </span>
                ),
                className: "text-muted-foreground",
              },
              {
                header: "Date",
                cell: (p) => (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                ),
                className: "text-muted-foreground",
              },
              {
                header: "Provider",
                cell: (p) => (
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" />
                    {p.provider}
                  </span>
                ),
              },
              {
                header: "Amount",
                cell: (p) => (
                  <span className="font-semibold">
                    ${Number(p.amount).toFixed(2)}
                  </span>
                ),
              },
              {
                header: "Status",
                cell: (p) => (
                  <Badge variant={statusVariant[p.status]}>
                    {p.status}
                  </Badge>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
