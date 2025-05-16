import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showPagination?: boolean;
  className?: string;
}

export function SimpleTableSkeleton({
  rows = 10,
  columns = 6,
  className,
}: TableSkeletonProps) {
  return (
    <>
      <div
        className={cn("w-full overflow-hidden rounded-md border", className)}
      >
        {/* Table Header */}
        <div className="border-b bg-muted/40">
          <div className="flex w-full px-4 py-3 sm:px-6">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={`header-${index}`} className="flex-1 px-2">
                <Skeleton className="h-5 w-full max-w-[120px]" />
              </div>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex w-full items-center px-4 py-3 sm:px-6"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="flex-1 px-2"
                >
                  <Skeleton className="h-5 w-full max-w-[180px]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-2 py-2 sm:px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          <Skeleton className="h-5 w-[180px]" />
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </>
  );
}
