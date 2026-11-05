import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" /><Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-full" />
        <div className="flex justify-between border-t pt-3"><Skeleton className="h-6 w-20" /><Skeleton className="h-8 w-24" /></div>
      </div>
    </div>
  );
}