"use client";

import {
  Calendar,
  ChevronLeft,
  CreditCard,
  ExternalLink,
  Eye,
  Heart,
  ImageIcon,
  MapPin,
  Monitor,
  Music,
  Palette,
  Smartphone,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CustomizeHeader } from "@/components/customize/customize-header";
import { CoupleForm } from "@/components/customize/forms/couple-form";
import { EventForm } from "@/components/customize/forms/event-form";
import { GalleryForm } from "@/components/customize/forms/gallery-form";
import { GiftForm } from "@/components/customize/forms/gift-form";
import { LocationForm } from "@/components/customize/forms/location-form";
import { MusicForm } from "@/components/customize/forms/music-form";
import { StoryForm } from "@/components/customize/forms/story-form";
import { ThemeForm } from "@/components/customize/forms/theme-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ThemeKey, themes, type WeddingData } from "@/lib/wedding-context";

const sections = [
  { id: "couple", label: "Data Pengantin", icon: Users },
  { id: "event", label: "Acara", icon: Calendar },
  { id: "location", label: "Lokasi", icon: MapPin },
  { id: "gallery", label: "Galeri Foto", icon: ImageIcon },
  { id: "story", label: "Love Story", icon: Heart },
  { id: "gift", label: "Amplop Digital", icon: CreditCard },
  { id: "theme", label: "Tema & Warna", icon: Palette },
  { id: "music", label: "Musik", icon: Music },
];

const STORAGE_KEY = "wedding-invitation-data";

const defaultData: WeddingData = {
  couple: {
    groomName: "Daniel",
    groomFullName: "Daniel Pratama",
    groomFather: "Bapak Budi Santoso",
    groomMother: "Ibu Dewi Lestari",
    groomPhoto: "",
    brideName: "Sarah",
    brideFullName: "Sarah Amelia",
    brideFather: "Bapak Ahmad Hidayat",
    brideMother: "Ibu Siti Rahayu",
    bridePhoto: "",
  },
  event: {
    akadDate: "2025-03-15",
    akadTime: "10:00",
    akadEndTime: "11:30",
    resepsiDate: "2025-03-15",
    resepsiTime: "12:00",
    resepsiEndTime: "15:00",
  },
  location: {
    akadVenue: "St. Mary's Cathedral",
    akadAddress: "Jl. Katedral No. 7B, Jakarta Pusat",
    akadMapsUrl: "https://maps.google.com",
    resepsiVenue: "Grand Ballroom - Hotel Mulia",
    resepsiAddress: "Jl. Asia Afrika No. 8, Senayan, Jakarta",
    resepsiMapsUrl: "https://maps.google.com",
  },
  gallery: {
    photos: [],
  },
  story: {
    stories: [],
  },
  gift: {
    banks: [],
  },
  theme: {
    theme: "elegant",
    primaryColor: "rose",
  },
  music: {
    enabled: true,
    selectedMusic: "mixkit-wedding-01",
    customMusicUrl: "",
  },
};

export default function CustomizePage() {
  const [activeSection, setActiveSection] = useState("couple");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<WeddingData>(defaultData);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [showPreview, setShowPreview] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef(null);
  const mobileIframeRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFormData({ ...defaultData, ...parsed });
      } catch {
        // ignore parse errors
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when data changes (debounced preview refresh)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isHydrated]);

  // Refresh preview when theme changes
  useEffect(() => {
    if (isHydrated) {
      const timer = setTimeout(() => {
        setPreviewKey((k) => k + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData.theme.theme, isHydrated]);

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    await new Promise((resolve) => setTimeout(resolve, 300));
    setPreviewKey((k) => k + 1);
    setIsSaving(false);
  };

  const updateFormData = <K extends keyof WeddingData>(
    section: K,
    data: WeddingData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [section]: data }));
  };

  const renderForm = () => {
    if (!isHydrated) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      );
    }

    switch (activeSection) {
      case "couple":
        return (
          <CoupleForm
            data={formData.couple}
            onChange={(data) => updateFormData("couple", data)}
          />
        );
      case "event":
        return (
          <EventForm
            data={formData.event}
            onChange={(data) => updateFormData("event", data)}
          />
        );
      case "location":
        return (
          <LocationForm
            data={formData.location}
            onChange={(data) => updateFormData("location", data)}
          />
        );
      case "gallery":
        return (
          <GalleryForm
            data={formData.gallery}
            onChange={(data) => updateFormData("gallery", data)}
          />
        );
      case "story":
        return (
          <StoryForm
            data={formData.story}
            onChange={(data) => updateFormData("story", data)}
          />
        );
      case "gift":
        return (
          <GiftForm
            data={formData.gift}
            onChange={(data) => updateFormData("gift", data)}
          />
        );
      case "theme":
        return (
          <ThemeForm
            data={formData.theme}
            onChange={(data) => updateFormData("theme", data)}
          />
        );
      case "music":
        return (
          <MusicForm
            data={formData.music}
            onChange={(data) => updateFormData("music", data)}
          />
        );
      default:
        return null;
    }
  };

  // Get current theme for preview label
  const currentTheme = themes[formData.theme.theme as ThemeKey] || themes.elegant;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <CustomizeHeader onSave={handleSave} isSaving={isSaving} />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-[calc(100vh-65px)] sticky top-[65px]">
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
                    onClick={() => setActiveSection(section.id)}
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

          {/* Current Theme Info */}
          <div className="p-4 border-t border-border mt-auto">
            <div className="text-xs text-muted-foreground mb-1">Tema Aktif</div>
            <div className="font-medium text-foreground">{currentTheme.name}</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Section Tabs */}
          <div className="lg:hidden sticky top-[65px] z-10 bg-card border-b border-border overflow-x-auto">
            <div className="flex p-2 gap-2 min-w-max">
              {sections.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                    activeSection === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:flex">
            {/* Form Area */}
            <div className="flex-1 lg:max-w-2xl p-6">
              {renderForm()}

              {/* Mobile Preview Button */}
              <div className="lg:hidden mt-8">
                <Button
                  onClick={() => setShowPreview(true)}
                  className="w-full"
                  size="lg"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Lihat Preview
                </Button>
              </div>
            </div>

            {/* Preview Panel - Desktop */}
            <div className="hidden lg:block flex-1 border-l border-border bg-muted/30 h-dvh sticky top-[65px]">
              {/* Preview Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Preview</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {currentTheme.name}
                  </span>
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
                    <a href="/preview" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Buka
                    </a>
                  </Button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="px-6 flex items-start justify-center h-dvh overflow-auto">
                <div
                  className={cn(
                    "bg-background rounded-2xl shadow-lg overflow-hidden transition-all duration-300",
                    viewMode === "mobile"
                      ? "w-[375px] h-[667px]"
                      : "w-full max-w-4xl h-[600px]"
                  )}
                >
                  <iframe
                    key={`desktop-${previewKey}`}
                    src="/preview"
                    className="w-full h-full border-0"
                    title="Wedding invitation preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Preview Modal */}
      {showPreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali
            </button>
            <span className="font-medium">{currentTheme.name}</span>
            <Button variant="outline" size="sm" asChild>
              <a href="/preview" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
          <iframe
            key={`mobile-${previewKey}`}
            src="/preview"
            className="w-full h-[calc(100vh-65px)] border-0"
            title="Wedding invitation preview"
          />
        </div>
      )}
    </div>
  );
}
