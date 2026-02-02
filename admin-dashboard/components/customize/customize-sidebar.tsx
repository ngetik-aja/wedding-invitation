"use client";

import { cn } from "@/lib/utils";
import {
  Users,
  Calendar,
  MapPin,
  ImageIcon,
  Heart,
  CreditCard,
  Palette,
  Music,
} from "lucide-react";

interface CustomizeSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: "couple", label: "Data Pengantin", icon: Users },
  { id: "event", label: "Acara", icon: Calendar },
  { id: "location", label: "Lokasi", icon: MapPin },
  { id: "gallery", label: "Galeri Foto", icon: ImageIcon },
  { id: "story", label: "Kisah Cinta", icon: Heart },
  { id: "gift", label: "Amplop Digital", icon: CreditCard },
  { id: "theme", label: "Tema & Warna", icon: Palette },
  { id: "music", label: "Musik", icon: Music },
];

export function CustomizeSidebar({ activeSection, onSectionChange }: CustomizeSidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="font-serif text-xl font-bold text-foreground">Kustomisasi</h2>
        <p className="text-sm text-muted-foreground mt-1">Edit undangan Anda</p>
      </div>
      <nav className="p-3">
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
