"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface WeddingData {
  couple: {
    groomName: string;
    groomFullName: string;
    groomFather: string;
    groomMother: string;
    groomPhoto: string;
    brideName: string;
    brideFullName: string;
    brideFather: string;
    brideMother: string;
    bridePhoto: string;
  };
  event: {
    akadDate: string;
    akadTime: string;
    akadEndTime: string;
    resepsiDate: string;
    resepsiTime: string;
    resepsiEndTime: string;
  };
  location: {
    akadVenue: string;
    akadAddress: string;
    akadMapsUrl: string;
    resepsiVenue: string;
    resepsiAddress: string;
    resepsiMapsUrl: string;
  };
  gallery: {
    photos: string[];
  };
  story: {
    stories: { title: string; date: string; description: string }[];
  };
  gift: {
    banks: { bankName: string; accountNumber: string; accountName: string }[];
  };
  theme: {
    theme: string;
    primaryColor: string;
  };
  music: {
    enabled: boolean;
    selectedMusic: string;
    customMusicUrl: string;
  };
}

export const themes = {
  elegant: {
    name: "Elegant Rose",
    description: "Pink dan krem romantis",
    colors: {
      background: "oklch(0.98 0.01 350)",
      foreground: "oklch(0.25 0.02 350)",
      primary: "oklch(0.55 0.12 350)",
      primaryForeground: "oklch(0.98 0.01 350)",
      secondary: "oklch(0.95 0.02 350)",
      secondaryForeground: "oklch(0.35 0.02 350)",
      muted: "oklch(0.94 0.015 350)",
      mutedForeground: "oklch(0.5 0.02 350)",
      accent: "oklch(0.92 0.025 350)",
      accentForeground: "oklch(0.3 0.02 350)",
      border: "oklch(0.88 0.02 350)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.25 0.02 350)",
    },
  },
  rustic: {
    name: "Rustic Garden",
    description: "Hijau dan cokelat natural",
    colors: {
      background: "oklch(0.97 0.01 90)",
      foreground: "oklch(0.25 0.03 90)",
      primary: "oklch(0.45 0.1 145)",
      primaryForeground: "oklch(0.98 0.01 90)",
      secondary: "oklch(0.93 0.02 90)",
      secondaryForeground: "oklch(0.35 0.03 90)",
      muted: "oklch(0.92 0.015 90)",
      mutedForeground: "oklch(0.5 0.03 90)",
      accent: "oklch(0.90 0.03 145)",
      accentForeground: "oklch(0.3 0.03 145)",
      border: "oklch(0.85 0.025 90)",
      card: "oklch(0.99 0.005 90)",
      cardForeground: "oklch(0.25 0.03 90)",
    },
  },
  modern: {
    name: "Modern Minimalist",
    description: "Hitam putih dan emas",
    colors: {
      background: "oklch(0.99 0 0)",
      foreground: "oklch(0.15 0 0)",
      primary: "oklch(0.2 0 0)",
      primaryForeground: "oklch(0.98 0 0)",
      secondary: "oklch(0.95 0.01 85)",
      secondaryForeground: "oklch(0.2 0 0)",
      muted: "oklch(0.94 0 0)",
      mutedForeground: "oklch(0.45 0 0)",
      accent: "oklch(0.75 0.1 85)",
      accentForeground: "oklch(0.15 0 0)",
      border: "oklch(0.88 0 0)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.15 0 0)",
    },
  },
  gold: {
    name: "Classic Gold",
    description: "Emas mewah klasik",
    colors: {
      background: "oklch(0.97 0.015 85)",
      foreground: "oklch(0.3 0.05 60)",
      primary: "oklch(0.6 0.15 70)",
      primaryForeground: "oklch(0.15 0.03 60)",
      secondary: "oklch(0.93 0.025 85)",
      secondaryForeground: "oklch(0.35 0.05 60)",
      muted: "oklch(0.91 0.02 85)",
      mutedForeground: "oklch(0.5 0.04 60)",
      accent: "oklch(0.85 0.1 70)",
      accentForeground: "oklch(0.25 0.04 60)",
      border: "oklch(0.82 0.06 70)",
      card: "oklch(0.99 0.01 85)",
      cardForeground: "oklch(0.3 0.05 60)",
    },
  },
  tropical: {
    name: "Tropical Paradise",
    description: "Tosca dan coral pantai",
    colors: {
      background: "oklch(0.98 0.01 200)",
      foreground: "oklch(0.25 0.04 200)",
      primary: "oklch(0.6 0.12 185)",
      primaryForeground: "oklch(0.98 0.01 200)",
      secondary: "oklch(0.94 0.03 30)",
      secondaryForeground: "oklch(0.35 0.04 30)",
      muted: "oklch(0.93 0.02 200)",
      mutedForeground: "oklch(0.5 0.03 200)",
      accent: "oklch(0.75 0.15 30)",
      accentForeground: "oklch(0.25 0.04 30)",
      border: "oklch(0.85 0.04 185)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.25 0.04 200)",
    },
  },
  floral: {
    name: "Floral Dream",
    description: "Pastel watercolor bunga",
    colors: {
      background: "oklch(0.98 0.015 320)",
      foreground: "oklch(0.3 0.03 320)",
      primary: "oklch(0.7 0.1 320)",
      primaryForeground: "oklch(0.98 0.01 320)",
      secondary: "oklch(0.94 0.02 145)",
      secondaryForeground: "oklch(0.35 0.03 145)",
      muted: "oklch(0.93 0.02 320)",
      mutedForeground: "oklch(0.5 0.03 320)",
      accent: "oklch(0.85 0.08 145)",
      accentForeground: "oklch(0.3 0.03 145)",
      border: "oklch(0.88 0.03 320)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.3 0.03 320)",
    },
  },
};

export type ThemeKey = keyof typeof themes;

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
    selectedMusic: "romantic-1",
    customMusicUrl: "",
  },
};

const STORAGE_KEY = "wedding-invitation-data";

interface WeddingContextType {
  data: WeddingData;
  updateData: <K extends keyof WeddingData>(section: K, sectionData: WeddingData[K]) => void;
  setTheme: (theme: ThemeKey) => void;
  currentTheme: ThemeKey;
}

const WeddingContext = createContext<WeddingContextType | null>(null);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WeddingData>(defaultData);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData({ ...defaultData, ...parsed });
      } catch {
        // ignore parse errors
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isHydrated]);

  // Apply theme CSS variables
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

  const updateData = <K extends keyof WeddingData>(
    section: K,
    sectionData: WeddingData[K]
  ) => {
    setData((prev) => ({ ...prev, [section]: sectionData }));
  };

  const setTheme = (theme: ThemeKey) => {
    updateData("theme", { ...data.theme, theme });
  };

  const currentTheme = (data.theme.theme as ThemeKey) || "elegant";

  return (
    <WeddingContext.Provider value={{ data, updateData, setTheme, currentTheme }}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error("useWedding must be used within a WeddingProvider");
  }
  return context;
}

// Hook for preview page that only reads data
export function useWeddingData() {
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

    // Listen for storage changes from other tabs/frames
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorage);
    
    // Also poll for changes (for same-page iframe)
    const interval = setInterval(loadData, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return { data, isHydrated };
}
