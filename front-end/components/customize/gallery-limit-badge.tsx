"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryLimitBadgeProps {
  currentCount: number;
  maxAllowed: number;
}

export function GalleryLimitBadge({ currentCount, maxAllowed }: GalleryLimitBadgeProps) {
  const isOverLimit = currentCount > maxAllowed;
  const isAtLimit = currentCount === maxAllowed;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
        isOverLimit
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : isAtLimit
          ? "border-amber-400/40 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
          : "border-border bg-secondary text-muted-foreground"
      )}
    >
      {isOverLimit && <AlertCircle className="h-3.5 w-3.5" />}
      <span>
        {currentCount} / {maxAllowed} foto
      </span>
      {isOverLimit && (
        <span className="font-normal text-xs">— melebihi batas paket</span>
      )}
    </div>
  );
}
