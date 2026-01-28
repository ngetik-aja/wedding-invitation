"use client";

import { useEffect, useState } from "react";
import { CountdownSection } from "@/components/wedding/countdown-section";
import { CoupleSection } from "@/components/wedding/couple-section";
import { EventSection } from "@/components/wedding/event-section";
import { FooterSection } from "@/components/wedding/footer-section";
import { GallerySection } from "@/components/wedding/gallery-section";
import { GiftSection } from "@/components/wedding/gift-section";
import { HeroSection } from "@/components/wedding/hero-section";
import { RsvpSection } from "@/components/wedding/rsvp-section";
import { WishesSection } from "@/components/wedding/wishes-section";
import { type ThemeKey, themes, type WeddingData } from "@/lib/wedding-context";

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

// Default gallery images if none provided
const defaultGallery = [
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", caption: "Our engagement day" },
  { url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80", caption: "Pre-wedding shoot" },
  { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80", caption: "Together forever" },
  { url: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=800&q=80", caption: "Love story" },
  { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80", caption: "Memories" },
  { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80", caption: "Our journey" },
];

// Default wishes
const defaultWishes = [
  {
    name: "John & Jane",
    message: "Wishing you both a lifetime of love, laughter, and endless happiness. Congratulations on your wedding!",
    date: "Jan 20, 2025",
  },
  {
    name: "Michael",
    message: "May your love grow stronger each day. So happy for you both!",
    date: "Jan 18, 2025",
  },
  {
    name: "Lisa Wong",
    message: "What a beautiful couple! Wishing you all the best on this new journey together.",
    date: "Jan 15, 2025",
  },
];

// Default gifts
const defaultGifts = [
  {
    type: "bank" as const,
    name: "Bank Central Asia (BCA)",
    accountNumber: "1234567890",
    accountName: "Sarah Amelia",
  },
  {
    type: "bank" as const,
    name: "Bank Mandiri",
    accountNumber: "0987654321",
    accountName: "Daniel Pratama",
  },
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "Saturday, March 15th, 2025";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(startTime: string, endTime: string): string {
  if (!startTime) return "10:00 AM - 11:30 AM";
  
  const formatSingleTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime || startTime)}`;
}

export default function WeddingInvitation() {
  const [data, setData] = useState<WeddingData>(defaultData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setData({ ...defaultData, ...parsed });
        } catch {
          // ignore
        }
      }
      setIsHydrated(true);
    };

    loadData();

    // Listen for storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorage);
    
    // Poll for changes (for iframe in same page)
    const interval = setInterval(loadData, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Apply theme
  useEffect(() => {
    if (!isHydrated) return;
    
    const themeKey = data.theme.theme as ThemeKey;
    const theme = themes[themeKey] || themes.elegant;
    const root = document.documentElement;

    root.style.setProperty("--background", theme.colors.background);
    root.style.setProperty("--foreground", theme.colors.foreground);
    root.style.setProperty("--primary", theme.colors.primary);
    root.style.setProperty("--primary-foreground", theme.colors.primaryForeground);
    root.style.setProperty("--secondary", theme.colors.secondary);
    root.style.setProperty("--secondary-foreground", theme.colors.secondaryForeground);
    root.style.setProperty("--muted", theme.colors.muted);
    root.style.setProperty("--muted-foreground", theme.colors.mutedForeground);
    root.style.setProperty("--accent", theme.colors.accent);
    root.style.setProperty("--accent-foreground", theme.colors.accentForeground);
    root.style.setProperty("--border", theme.colors.border);
    root.style.setProperty("--card", theme.colors.card);
    root.style.setProperty("--card-foreground", theme.colors.cardForeground);
  }, [data.theme.theme, isHydrated]);

  // Prepare display data
  const weddingData = {
    bride: {
      name: data.couple.brideName || "Sarah Amelia",
      fullName: data.couple.brideFullName || "Sarah Amelia",
      parentInfo: data.couple.brideFather && data.couple.brideMother
        ? `Putri dari ${data.couple.brideFather} & ${data.couple.brideMother}`
        : "Daughter of Mr. Ahmad & Mrs. Siti",
      description: "A passionate soul who loves life and happiness.",
      photo: data.couple.bridePhoto,
    },
    groom: {
      name: data.couple.groomName || "Daniel Pratama",
      fullName: data.couple.groomFullName || "Daniel Pratama",
      parentInfo: data.couple.groomFather && data.couple.groomMother
        ? `Putra dari ${data.couple.groomFather} & ${data.couple.groomMother}`
        : "Son of Mr. Budi & Mrs. Dewi",
      description: "A loving person with dreams and ambitions.",
      photo: data.couple.groomPhoto,
    },
    weddingDate: formatDate(data.event.akadDate),
    targetDate: data.event.akadDate ? new Date(`${data.event.akadDate}T${data.event.akadTime || "10:00"}:00`) : new Date("2025-03-15T10:00:00"),
    guestName: "Bapak/Ibu/Saudara/i",
    events: [
      {
        title: "Akad Nikah / Pemberkatan",
        date: formatDate(data.event.akadDate),
        time: formatTime(data.event.akadTime, data.event.akadEndTime),
        venue: data.location.akadVenue || "Venue Akad",
        address: data.location.akadAddress || "Alamat akan diumumkan",
        mapUrl: data.location.akadMapsUrl || "https://maps.google.com",
      },
      {
        title: "Resepsi Pernikahan",
        date: formatDate(data.event.resepsiDate),
        time: formatTime(data.event.resepsiTime, data.event.resepsiEndTime),
        venue: data.location.resepsiVenue || "Venue Resepsi",
        address: data.location.resepsiAddress || "Alamat akan diumumkan",
        mapUrl: data.location.resepsiMapsUrl || "https://maps.google.com",
      },
    ],
    gallery: data.gallery.photos.length > 0 
      ? data.gallery.photos.map((url, i) => ({ url, caption: `Photo ${i + 1}` }))
      : defaultGallery,
    wishes: defaultWishes,
    gifts: data.gift.banks.length > 0
      ? data.gift.banks.map((bank) => ({
          type: "bank" as const,
          name: bank.bankName,
          accountNumber: bank.accountNumber,
          accountName: bank.accountName,
        }))
      : defaultGifts,
  };

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection
        brideName={weddingData.bride.name}
        groomName={weddingData.groom.name}
        weddingDate={weddingData.weddingDate}
        guestName={weddingData.guestName}
      />

      <CoupleSection bride={weddingData.bride} groom={weddingData.groom} />

      <CountdownSection targetDate={weddingData.targetDate} />

      <EventSection events={weddingData.events} />

      <GallerySection images={weddingData.gallery} />

      <RsvpSection guestName={weddingData.guestName} />

      <WishesSection wishes={weddingData.wishes} />

      <GiftSection gifts={weddingData.gifts} />

      <FooterSection
        brideName={weddingData.bride.name}
        groomName={weddingData.groom.name}
      />
    </main>
  );
}
