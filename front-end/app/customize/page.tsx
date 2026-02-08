"use client";

import {
  Calendar,
  ChevronLeft,
  Copy,
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
import { useEffect, useMemo, useRef, useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { type ThemeKey, themes, type WeddingData } from "@/lib/wedding-context";
import { getCustomerSession, type CustomerSession } from "@/lib/session";
import { getInvitationErrorMessage, useUpdateInvitation } from "@/lib/hooks/use-update-invitation";

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
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [shareMode, setShareMode] = useState<"demo" | "subdomain" | "custom">("demo");
  const [shareOwner, setShareOwner] = useState("");
  const [shareSlug, setShareSlug] = useState("");
  const [copied, setCopied] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [origin, setOrigin] = useState("");
  const [session, setSession] = useState<CustomerSession | null>(null);
  const previewUrl = useMemo(() => {
    if (session?.invitationId) {
      return `/preview?id=${session.invitationId}`;
    }
    return "/preview";
  }, [session]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const updateInvitationMutation = useUpdateInvitation();
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const stored = getCustomerSession();
    if (stored) {
      setSession(stored);
      setShareOwner((prev) => prev || stored.slug);
      setShareSlug((prev) => prev || stored.slug);
    }
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
    setSaveError(null);
    setIsSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

    if (!session) {
      setSaveError("Session customer tidak ditemukan. Silakan ulangi onboarding.");
      setIsSaving(false);
      return;
    }

    const meta = buildInvitationMeta();

    try {
      await updateInvitationMutation.mutateAsync({
        invitationId: session.invitationId,
        customerId: session.customerId,
        title: meta.title,
        eventDate: meta.eventDate,
        themeKey: meta.themeKey,
        isPublished,
        content: formData as unknown as Record<string, unknown>,
      });
      setPreviewKey((k) => k + 1);
    } catch (err) {
      setSaveError(getInvitationErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishError(null);
    if (!session) {
      setPublishError("Session customer tidak ditemukan. Silakan ulangi onboarding.");
      return;
    }
    const meta = buildInvitationMeta();
    try {
      await updateInvitationMutation.mutateAsync({
        invitationId: session.invitationId,
        customerId: session.customerId,
        title: meta.title,
        eventDate: meta.eventDate,
        themeKey: meta.themeKey,
        isPublished: true,
        content: formData as unknown as Record<string, unknown>,
      });
      setIsPublished(true);
    } catch (err) {
      setPublishError(getInvitationErrorMessage(err));
    }
  };

  const updateFormData = <K extends keyof WeddingData>(
    section: K,
    data: WeddingData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [section]: data }));
  };

  const buildInvitationMeta = () => {
    const groom = formData.couple.groomName?.trim() || "";
    const bride = formData.couple.brideName?.trim() || "";
    const names = [groom, bride].filter(Boolean).join(" & ");
    const title = names ? `Pernikahan ${names}` : formData.couple.groomFullName || formData.couple.brideFullName || "";
    const eventDate = formData.event.akadDate || formData.event.resepsiDate || "";
    return {
      title: title.trim(),
      eventDate,
      themeKey: formData.theme.theme || "elegant",
    };
  };

  const baseDomain = (process.env.NEXT_PUBLIC_BASE_DOMAIN || "").trim();
  const demoBase = (process.env.NEXT_PUBLIC_DEMO_BASE_URL || origin).replace(/\/$/, "");
  const cleanedOwner = shareOwner.trim();
  const cleanedSlug = shareSlug.trim();

  const shareLink = (() => {
    if (!cleanedOwner || !cleanedSlug) {
      return "";
    }
    if (shareMode === "demo") {
      if (!demoBase) {
        return "";
      }
      return `${demoBase}/api/v1/public/${cleanedOwner}/invitation/${cleanedSlug}`;
    }
    if (shareMode === "subdomain") {
      if (!baseDomain) {
        return "";
      }
      return `https://${cleanedOwner}.${baseDomain}/api/v1/public/invitation/${cleanedSlug}`;
    }
    return `https://${cleanedOwner}/api/v1/public/invitation/${cleanedSlug}`;
  })();

  const ownerLabel = shareMode === "custom" ? "Custom domain" : "Owner / Subdomain";
  const ownerPlaceholder = shareMode === "custom" ? "undangan-andi.com" : "andi";

  const handleCopy = async () => {
    if (!shareLink || typeof navigator === "undefined") {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard errors
    }
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
      <CustomizeHeader
        onSave={handleSave}
        onShare={() => setShowSharePanel((prev) => !prev)}
        isSaving={isSaving}
        isShareOpen={showSharePanel}
      />

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
          <div className="lg:hidden sticky top-0 z-10 bg-card border-b border-border overflow-hidden">
            <div className="flex w-max gap-2 px-4 py-2 overflow-x-auto overscroll-x-contain">
              {sections.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
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

          {showSharePanel && (
            <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
              <Card className="shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Link Undangan</CardTitle>
                  <CardDescription>
                    Atur format link untuk demo (path), subdomain, atau custom domain.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
                      <p className="text-sm font-medium">{isPublished ? "Published" : "Draft"}</p>
                    </div>
                    <Button type="button" size="sm" onClick={handlePublish} disabled={updateInvitationMutation.isPending}>
                      {updateInvitationMutation.isPending ? "Memproses..." : "Publikasikan"}
                    </Button>
                  </div>
                  {publishError && (
                    <p className="text-xs text-destructive">{publishError}</p>
                  )}
                  <div className="grid gap-3">
                    <Label>Mode</Label>
                    <RadioGroup
                      className="grid gap-2 sm:grid-cols-3"
                      value={shareMode}
                      onValueChange={(value) => setShareMode(value as "demo" | "subdomain" | "custom")}
                    >
                      <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                        <RadioGroupItem id="share-demo" value="demo" />
                        <Label htmlFor="share-demo">Demo (path)</Label>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                        <RadioGroupItem id="share-subdomain" value="subdomain" />
                        <Label htmlFor="share-subdomain">Subdomain</Label>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                        <RadioGroupItem id="share-custom" value="custom" />
                        <Label htmlFor="share-custom">Custom domain</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="share-owner">{ownerLabel}</Label>
                    <Input
                      id="share-owner"
                      value={shareOwner}
                      onChange={(event) => setShareOwner(event.target.value)}
                      placeholder={ownerPlaceholder}
                    />
                    <p className="text-xs text-muted-foreground">
                      {shareMode === "demo"
                        ? "Contoh demo: andi (link jadi /andi/invitation/...)"
                        : shareMode === "subdomain"
                          ? baseDomain
                            ? `Akan dipakai sebagai ${ownerPlaceholder}.${baseDomain}`
                            : "Set NEXT_PUBLIC_BASE_DOMAIN untuk generate link subdomain."
                          : "Isi domain lengkap, contoh: undangan-andi.com"}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="share-slug">Slug undangan</Label>
                    <Input
                      id="share-slug"
                      value={shareSlug}
                      onChange={(event) => setShareSlug(event.target.value)}
                      placeholder="andi-sarah"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Link undangan</Label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input value={shareLink} readOnly placeholder="Isi owner & slug terlebih dulu" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopy}
                        disabled={!shareLink}
                        className="sm:w-[140px]"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copied ? "Tersalin" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {shareMode === "demo"
                        ? "Pakai link ini untuk demo di fly.dev atau localhost."
                        : shareMode === "subdomain"
                          ? "Pastikan DNS wildcard sudah diarahkan ke server."
                          : "Pastikan domain customer sudah mengarah ke server."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="lg:flex">
            {/* Form Area */}
            <div className="flex-1 lg:max-w-2xl p-4 sm:p-6">
              {saveError && (
                <p className="mb-3 text-sm text-destructive">{saveError}</p>
              )}

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
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
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
                    src={previewUrl}
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
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
          <iframe
            key={`mobile-${previewKey}`}
            src={previewUrl}
            className="w-full h-[calc(100vh-65px)] border-0"
            title="Wedding invitation preview"
          />
        </div>
      )}
    </div>
  );
}
