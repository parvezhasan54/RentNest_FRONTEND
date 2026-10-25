import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types/rental.type";

const styles: Record<RequestStatus, string> = {
  PENDING: "bg-accent text-accent-foreground",
  APPROVED: "bg-primary/10 text-primary",
  ACTIVE: "bg-primary text-primary-foreground",
  COMPLETED: "bg-secondary text-secondary-foreground",
  REJECTED: "bg-destructive/10 text-destructive",
};

export default function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", styles[status], className)}>
      {status}
    </span>
  );
}