import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types/rental.type";

const styles: Record<RequestStatus, string> = {
  PENDING: "bg-chart-3/15 text-chart-3",
  APPROVED: "bg-chart-2/15 text-chart-2",
  ACTIVE: "bg-primary/15 text-primary",
  COMPLETED: "bg-muted text-muted-foreground",
  REJECTED: "bg-destructive/10 text-destructive",
};

export default function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", styles[status], className)}>
      {status}
    </span>
  );
}