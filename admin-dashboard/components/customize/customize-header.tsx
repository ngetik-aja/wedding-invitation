"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

interface CustomizeHeaderProps {
  onSave: () => void;
  isSaving: boolean;
  title?: string;
  subtitle?: string;
}

export function CustomizeHeader({ onSave, isSaving, title = "Buat Undangan", subtitle = "Klik simpan untuk menyimpan perubahan" }: CustomizeHeaderProps) {
  return (
    <header className="border-b border-border bg-card flex flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/invitations">
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-lg font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
        <Button size="sm" onClick={onSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </header>
  );
}
