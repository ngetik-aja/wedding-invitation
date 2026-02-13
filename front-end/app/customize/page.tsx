"use client";

import {
  Calendar,
  ChevronLeft,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  Heart,
  ImageIcon,
  LogOut,
  MapPin,
  Monitor,
  Music,
  Palette,
  Smartphone,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type ThemeKey, themes, type WeddingData } from "@/lib/wedding-context";
import {
  clearCustomerSession,
  getCustomerSession,
  setCustomerSession,
  type CustomerSession,
} from "@/lib/session";
import { getInvitationErrorMessage, useUpdateInvitation } from "@/lib/hooks/use-update-invitation";
import { apiClient } from "@/lib/http";

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

type InvitationResponse = {
  slug?: string | null;
  content?: unknown;
  theme_key?: string | null;
  is_published?: boolean | null;
};

function parseInvitationContent(raw: unknown): Partial<WeddingData> | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Partial<WeddingData>;
    } catch {
      return null;
    }
  }
  if (typeof raw === "object") {
    return raw as Partial<WeddingData>;
  }
  return null;
}


function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildOwnerFromCouple(groomName: string, brideName: string) {
  const groom = slugifySegment(groomName);
  const bride = slugifySegment(brideName);
  if (groom && bride) return `${groom}-${bride}`;
  return groom || bride;
}

function buildGuestSlug(guestName: string) {
  return slugifySegment(guestName);
}

function normalizeWhatsAppNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

function parseGuestRows(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line
        .split(/[;,\t|]/)
        .map((part) => part.trim())
        .filter(Boolean);

      if (parts.length === 0) return null;
      if (parts.length === 1) {
        return { name: parts[0], phone: "" };
      }

      return {
        name: parts[0],
        phone: normalizeWhatsAppNumber(parts[1]),
      };
    })
    .filter((item): item is { name: string; phone: string } => Boolean(item));
}

function buildBroadcastMessage(template: string, name: string, link: string, pasangan: string) {
  return template
    .replaceAll("{{nama}}", name)
    .replaceAll("{{link}}", link)
    .replaceAll("{{pasangan}}", pasangan);
}

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
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("couple");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<WeddingData>(defaultData);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [showPreview, setShowPreview] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
const [copiedBulk, setCopiedBulk] = useState(false);
const [copiedBulkMessage, setCopiedBulkMessage] = useState(false);
const [bulkGuestInput, setBulkGuestInput] = useState("");
const [messageTemplate, setMessageTemplate] = useState(
  "Halo {{nama}},\nKami mengundang Anda untuk hadir di acara pernikahan {{pasangan}}.\n\nBuka undangan: {{link}}\n\nTerima kasih."
);
  const [isHydrated, setIsHydrated] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [origin, setOrigin] = useState("");
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [invitationSlug, setInvitationSlug] = useState("");
  const derivedOwner = useMemo(
    () => buildOwnerFromCouple(formData.couple.groomName || "", formData.couple.brideName || ""),
    [formData.couple.groomName, formData.couple.brideName]
  );
  const coupleLabel = useMemo(() => {
    const groom = formData.couple.groomName?.trim() || "";
    const bride = formData.couple.brideName?.trim() || "";
    return [groom, bride].filter(Boolean).join(" & ") || "Kami";
  }, [formData.couple.groomName, formData.couple.brideName]);
  const parsedGuestRows = useMemo(() => parseGuestRows(bulkGuestInput), [bulkGuestInput]);
  const previewGuest = useMemo(() => {
    const firstGuest = parsedGuestRows[0]?.name || "";
    return buildGuestSlug(firstGuest);
  }, [parsedGuestRows]);
  const previewUrl = useMemo(() => {
    if (!session?.invitationId) return "/preview";
    const params = new URLSearchParams();
    params.set("id", session.invitationId);
    if (previewGuest) params.set("guest", previewGuest);
    return "/preview?" + params.toString();
  }, [previewGuest, session]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const updateInvitationMutation = useUpdateInvitation();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const mobileIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const stored = getCustomerSession();
    if (!stored) {
      setIsHydrated(true);
      return;
    }

    setSession(stored);

    let isActive = true;
    apiClient
      .get<InvitationResponse>("/api/v1/customer/invitations/" + stored.invitationId)
      .then((response) => {
        if (!isActive) return;

        const content = parseInvitationContent(response.data?.content);
        const themeKey = response.data?.theme_key?.trim();
        const mergedTheme = themeKey
          ? {
              ...(content?.theme || {}),
              theme: themeKey,
            }
          : content?.theme;

        const merged = {
          ...defaultData,
          ...(content || {}),
          ...(mergedTheme ? { theme: { ...defaultData.theme, ...mergedTheme } } : null),
        } as WeddingData;

        setFormData(merged);

        const slug = (response.data?.slug || "").trim();
        if (slug) setInvitationSlug(slug);

        const contentMap = (content && typeof content === "object")
          ? (content as Record<string, unknown>)
          : null;
        const broadcastRaw = contentMap?.broadcast;
        const broadcast = broadcastRaw && typeof broadcastRaw === "object"
          ? (broadcastRaw as Record<string, unknown>)
          : null;

        const templateRaw = typeof broadcast?.template === "string" ? broadcast.template : "";
        if (templateRaw.trim()) {
          setMessageTemplate(templateRaw);
        }

        const guestsRaw = Array.isArray(broadcast?.guests) ? broadcast.guests : [];
        const guestLines = guestsRaw
          .map((item) => {
            if (!item || typeof item !== "object") return "";
            const guest = item as Record<string, unknown>;
            const name = typeof guest.name === "string" ? guest.name.trim() : "";
            const phone = typeof guest.phone === "string" ? guest.phone.trim() : "";
            if (!name) return "";
            return phone ? `${name}, ${phone}` : name;
          })
          .filter(Boolean);
        if (guestLines.length > 0) {
          setBulkGuestInput(guestLines.join("\n"));
        }
      })
      .catch(() => {
        if (!isActive) return;
      })
      .finally(() => {
        if (isActive) setIsHydrated(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData, isHydrated]);

  const postPreviewUpdate = useCallback((target: HTMLIFrameElement | null) => {
    if (!target?.contentWindow) return;
    target.contentWindow.postMessage(
      { type: "WEDDING_PREVIEW_UPDATE", payload: formData },
      window.location.origin
    );
  }, [formData]);

  useEffect(() => {
    if (!isHydrated) return;
    const timer = setTimeout(() => {
      postPreviewUpdate(iframeRef.current);
      postPreviewUpdate(mobileIframeRef.current);
    }, 120);

    return () => clearTimeout(timer);
  }, [formData, isHydrated, postPreviewUpdate, showPreview]);

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
    const slugToPersist = generatedOwner || invitationSlug.trim();
    const contentPayload = {
      ...formData,
      broadcast: {
        template: messageTemplate,
        guests: parsedGuestRows.map((item) => ({ name: item.name, phone: item.phone })),
      },
    };

    try {
      await updateInvitationMutation.mutateAsync({
        invitationId: session.invitationId,
        customerId: session.customerId,
        slug: slugToPersist,
        title: meta.title,
        eventDate: meta.eventDate,
        themeKey: meta.themeKey,
        isPublished: false,
        content: contentPayload as unknown as Record<string, unknown>,
      });

      if (slugToPersist) {
        setInvitationSlug(slugToPersist);
        const nextSession = { ...session, slug: slugToPersist };
        setSession(nextSession);
        setCustomerSession(nextSession);
      }

      setPreviewKey((k) => k + 1);
    } catch (err) {
      setSaveError(getInvitationErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };
  const handleLogout = () => {
    clearCustomerSession();
    router.push("/login");
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
  const demoBase = (process.env.NEXT_PUBLIC_DEMO_BASE_URL || origin).replace(/\/$/, "");
  const generatedOwner = derivedOwner.trim();
  const cleanedOwner = generatedOwner || invitationSlug.trim();

  const buildShareLink = useCallback((owner: string, guest: string) => {
    if (!owner || !guest || !demoBase) {
      return "";
    }
    return `${demoBase}/${owner}/invitations/${guest}`;
  }, [demoBase]);

  const bulkGuestRows = useMemo(() => {
    if (!cleanedOwner) return [];
    const counters = new Map<string, number>();

    return parsedGuestRows
      .map((entry) => {
        const baseSlug = buildGuestSlug(entry.name);
        if (!baseSlug) return null;

        const count = (counters.get(baseSlug) || 0) + 1;
        counters.set(baseSlug, count);
        const finalSlug = count === 1 ? baseSlug : `${baseSlug}-${count}`;
        const link = buildShareLink(cleanedOwner, finalSlug);
        const message = buildBroadcastMessage(messageTemplate, entry.name, link, coupleLabel);
        const waUrl = entry.phone ? `https://wa.me/${entry.phone}?text=${encodeURIComponent(message)}` : "";

        return {
          name: entry.name,
          phone: entry.phone,
          guestSlug: finalSlug,
          link,
          message,
          waUrl,
        };
      })
      .filter((row): row is { name: string; phone: string; guestSlug: string; link: string; message: string; waUrl: string } => Boolean(row));
  }, [buildShareLink, cleanedOwner, coupleLabel, messageTemplate, parsedGuestRows]);

  const handleCopyBulk = async () => {
    if (typeof navigator === "undefined" || bulkGuestRows.length === 0) return;

    const lines = bulkGuestRows
      .filter((row) => row.link)
      .map((row) => `${row.name}${row.phone ? ` (${row.phone})` : ""}: ${row.link}`);

    if (lines.length === 0) return;

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedBulk(true);
      setTimeout(() => setCopiedBulk(false), 1500);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleCopyBulkMessages = async () => {
    if (typeof navigator === "undefined" || bulkGuestRows.length === 0) return;

    const lines = bulkGuestRows
      .filter((row) => row.message)
      .map((row) => `${row.phone || "-"} | ${row.name}\n${row.message}`);

    if (lines.length === 0) return;

    try {
      await navigator.clipboard.writeText(lines.join("\n\n"));
      setCopiedBulkMessage(true);
      setTimeout(() => setCopiedBulkMessage(false), 1500);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleCopySingleMessage = async (message: string) => {
    if (typeof navigator === "undefined" || !message) return;

    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownloadCsv = () => {
    if (typeof window === "undefined" || bulkGuestRows.length === 0) return;

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csvRows = [
      ["Nama Tamu", "No WA", "Slug", "Link", "Pesan", "WA URL"],
      ...bulkGuestRows
        .filter((row) => row.link)
        .map((row) => [row.name, row.phone, row.guestSlug, row.link, row.message, row.waUrl]),
    ];

    if (csvRows.length <= 1) return;

    const csv = csvRows
      .map((row) => row.map((value) => escapeCsv(value)).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateCode = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `guest-broadcast-${dateCode}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        onLogout={handleLogout}
        isSaving={isSaving}
        isShareOpen={showSharePanel}
      />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-card border-r border-border min-h-[calc(100vh-65px)] sticky top-[65px]">
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

          <div className="border-t border-border p-4 space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Tema Aktif</div>
              <div className="font-medium text-foreground">{currentTheme.name}</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Section Tabs */}
          <div className="lg:hidden sticky top-0 z-10 bg-card border-b border-border">
            <div className="flex max-w-xs gap-2 px-4 py-2 overflow-x-auto overscroll-x-contain md:max-w-full">
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
                    Kelola daftar tamu dan generate link undangan massal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className="grid gap-1 rounded-lg border border-border px-3 py-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Owner Link Otomatis</p>
                    <p className="text-sm font-medium text-foreground">{cleanedOwner || "(isi nama panggilan mempelai dulu)"}</p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="share-guest-bulk">Daftar tamu + WA (bulk)</Label>
                    <Textarea
                      id="share-guest-bulk"
                      value={bulkGuestInput}
                      onChange={(event) => setBulkGuestInput(event.target.value)}
                      placeholder={"Format per baris: Nama, 628xxxx\nContoh: Bapak Ujang, 628123456789"}
                      className="min-h-32"
                    />
                    <p className="text-xs text-muted-foreground">
                      Satu baris satu tamu. Format: nama, nomor WA. Nomor opsional, tapi dibutuhkan untuk buka WhatsApp otomatis.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message-template">Template ucapan</Label>
                    <Textarea
                      id="message-template"
                      value={messageTemplate}
                      onChange={(event) => setMessageTemplate(event.target.value)}
                      className="min-h-32"
                    />
                    <p className="text-xs text-muted-foreground">
                      Placeholder: {"{{nama}}"}, {"{{link}}"}, {"{{pasangan}}"}.
                    </p>
                  </div>

                  <div className="grid gap-2 rounded-lg border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">Generator Broadcast</p>
                        <p className="text-xs text-muted-foreground">
                          {bulkGuestRows.length} tamu siap dikirimkan.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={handleCopyBulk} disabled={bulkGuestRows.length === 0}>
                          <Copy className="w-4 h-4 mr-2" />
                          {copiedBulk ? "Link tersalin" : "Copy link"}
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCopyBulkMessages} disabled={bulkGuestRows.length === 0}>
                          <Copy className="w-4 h-4 mr-2" />
                          {copiedBulkMessage ? "Pesan tersalin" : "Copy pesan"}
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleDownloadCsv} disabled={bulkGuestRows.length === 0}>
                          <Download className="w-4 h-4 mr-2" />
                          Download CSV
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-auto rounded-md border border-border">
                      {bulkGuestRows.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-muted-foreground">Belum ada daftar tamu.</p>
                      ) : (
                        <ul className="divide-y divide-border text-xs">
                          {bulkGuestRows.slice(0, 200).map((row) => (
                            <li key={row.guestSlug} className="px-3 py-2 space-y-1">
                              <p className="font-medium text-foreground">{row.name}{row.phone ? ` (${row.phone})` : ""}</p>
                              <p className="truncate text-muted-foreground">{row.link}</p>
                              <p className="line-clamp-2 text-muted-foreground">{row.message}</p>
                              <div className="flex flex-wrap gap-2">
                                <Button type="button" size="sm" variant="outline" onClick={() => handleCopySingleMessage(row.message)}>
                                  Copy pesan
                                </Button>
                                {row.waUrl && (
                                  <Button type="button" size="sm" variant="outline" asChild>
                                    <a href={row.waUrl} target="_blank" rel="noopener noreferrer">
                                      Buka WA
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {bulkGuestRows.length > 200 && (
                      <p className="text-xs text-muted-foreground">
                        Menampilkan 200 pertama dari {bulkGuestRows.length} tamu.
                      </p>
                    )}
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
            <div className="hidden lg:flex flex-1 flex-col border-l border-border bg-muted/30 h-dvh sticky top-[65px]">
              {/* Preview Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Preview</span>
                  <span className="text-xs text-muted-foreground">Realtime preview</span>
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
              <div className="flex-1 min-h-0 overflow-auto px-6">
                <div className="flex h-full justify-center">
                  <div
                    className={cn(
                      "bg-background rounded-2xl shadow-lg overflow-hidden transition-all duration-300 w-full h-full",
                      viewMode === "mobile" ? "max-w-[420px]" : "max-w-4xl"
                    )}
                  >
                    <iframe
                      key={`desktop-${previewKey}`}
                      src={previewUrl}
                      className="w-full h-full border-0"
                      title="Wedding invitation preview"
                      ref={iframeRef}
                      onLoad={() => postPreviewUpdate(iframeRef.current)}
                    />
                  </div>
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
            ref={mobileIframeRef}
            onLoad={() => postPreviewUpdate(mobileIframeRef.current)}
          />
        </div>
      )}
    </div>
  );
}
