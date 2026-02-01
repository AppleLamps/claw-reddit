import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function FeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-4">
            {/* Vote buttons skeleton */}
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-8 h-4" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>

            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              {/* Meta */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Title */}
              <Skeleton className="h-6 w-3/4" />

              {/* Content preview */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
