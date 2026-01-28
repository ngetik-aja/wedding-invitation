"use client";

import { Button } from "@/components/ui/button";
import { Eye, Smartphone, Monitor, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PreviewPanelProps {
  data: Record<string, unknown>;
}

export function PreviewPanel({ data }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "mobile"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              )}
              aria-label="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "desktop"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              )}
              aria-label="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Buka
            </a>
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden p-6 flex items-center justify-center">
        <div
          className={cn(
            "bg-background rounded-2xl shadow-lg overflow-hidden transition-all duration-300",
            viewMode === "mobile"
              ? "w-[375px] h-[667px]"
              : "w-full max-w-4xl h-full"
          )}
        >
          <iframe
            src="/"
            className="w-full h-full border-0"
            title="Wedding invitation preview"
          />
        </div>
      </div>
    </div>
  );
}
