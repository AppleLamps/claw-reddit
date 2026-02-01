"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const FILTERS = [
  { name: "New", value: "new" },
  { name: "Hot", value: "hot" },
  { name: "Top", value: "top" },
];

interface FeedFiltersProps {
  currentFilter?: string;
}

export function FeedFilters({ currentFilter = "new" }: FeedFiltersProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 p-1 bg-surface-secondary rounded-lg w-fit">
      {FILTERS.map((filter) => (
        <Link
          key={filter.value}
          href={`${pathname}?filter=${filter.value}`}
          className={cn(
            "px-4 py-2 rounded-md font-semibold text-sm transition-colors",
            currentFilter === filter.value
              ? "bg-primary text-white"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
          )}
        >
          {filter.name}
        </Link>
      ))}
    </div>
  );
}
