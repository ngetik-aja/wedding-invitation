"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import Image from "next/image";
import { Check } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { WeddingFormValues } from "@/lib/wedding-form-schema";

const themes = [
  {
    id: "elegant",
    name: "Elegant Rose",
    description: "Romantis dengan nuansa pink dan krem",
    image: "/themes/elegant-rose.jpg",
    colors: { primary: "#8B4513", secondary: "#FFF8F0", accent: "#D4A574" },
  },
  {
    id: "rustic",
    name: "Rustic Garden",
    description: "Natural dengan nuansa hijau dan cokelat",
    image: "/themes/rustic-garden.jpg",
    colors: { primary: "#5D6B4A", secondary: "#F5F5DC", accent: "#8B7355" },
  },
  {
    id: "modern",
    name: "Modern Minimalist",
    description: "Simpel dan elegan dengan hitam dan putih",
    image: "/themes/modern-minimalist.jpg",
    colors: { primary: "#1A1A1A", secondary: "#FFFFFF", accent: "#D4AF37" },
  },
  {
    id: "gold",
    name: "Classic Gold",
    description: "Mewah dengan aksen emas klasik",
    image: "/themes/classic-gold.jpg",
    colors: { primary: "#B8860B", secondary: "#FFFAF0", accent: "#DAA520" },
  },
  {
    id: "tropical",
    name: "Tropical Paradise",
    description: "Segar dengan nuansa pantai tropis",
    image: "/themes/tropical-paradise.jpg",
    colors: { primary: "#008080", secondary: "#E0FFFF", accent: "#FF7F50" },
  },
  {
    id: "floral",
    name: "Floral Dream",
    description: "Lembut dengan bunga watercolor",
    image: "/themes/floral-dream.jpg",
    colors: { primary: "#9370DB", secondary: "#FFF0F5", accent: "#DDA0DD" },
  },
];

const colorOptions = [
  { id: "brown", name: "Cokelat", color: "#8B4513" },
  { id: "green", name: "Hijau", color: "#5D6B4A" },
  { id: "black", name: "Hitam", color: "#1A1A1A" },
  { id: "gold", name: "Emas", color: "#B8860B" },
  { id: "teal", name: "Tosca", color: "#008080" },
  { id: "purple", name: "Ungu", color: "#9370DB" },
  { id: "navy", name: "Navy", color: "#1E3A5F" },
  { id: "maroon", name: "Maroon", color: "#800000" },
  { id: "pink", name: "Pink", color: "#DB7093" },
  { id: "sage", name: "Sage", color: "#9CAF88" },
];

export function ThemeForm() {
  const { control } = useFormContext<WeddingFormValues>();
  const selectedThemeId = useWatch({ control, name: "theme.theme" });
  const selectedPrimary = useWatch({ control, name: "theme.primaryColor" });
  const selectedTheme = themes.find((theme) => theme.id === selectedThemeId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Tema & Warna</h2>
        <p className="text-muted-foreground mt-1">
          Pilih tema dan warna yang sesuai dengan konsep pernikahan Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilih Tema</CardTitle>
          <CardDescription>
            Tema akan mengatur keseluruhan tampilan undangan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="theme.theme"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {themes.map((theme) => (
                  <div key={theme.id} className="relative">
                    <RadioGroupItem
                      value={theme.id}
                      id={theme.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={theme.id}
                      className={cn(
                        "block cursor-pointer rounded-xl border-2 border-border overflow-hidden transition-all hover:border-primary/50",
                        "peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/20"
                      )}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={theme.image || "/placeholder.svg"}
                          alt={theme.name}
                          fill
                          className="object-cover"
                        />
                        {field.value === theme.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-card">
                        <h3 className="font-medium text-foreground">{theme.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{theme.description}</p>
                        <div className="flex gap-2 mt-3">
                          {Object.values(theme.colors).map((color, index) => (
                            <div
                              key={index}
                              className="w-5 h-5 rounded-full border border-border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </CardContent>
      </Card>

      {selectedTheme && (
        <Card>
          <CardHeader>
            <CardTitle>Tema Terpilih: {selectedTheme.name}</CardTitle>
            <CardDescription>
              Warna-warna yang akan digunakan pada tema ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 text-center">
                <div
                  className="w-full h-16 rounded-lg border border-border mb-2"
                  style={{ backgroundColor: selectedTheme.colors.primary }}
                />
                <span className="text-sm text-muted-foreground">Primary</span>
              </div>
              <div className="flex-1 text-center">
                <div
                  className="w-full h-16 rounded-lg border border-border mb-2"
                  style={{ backgroundColor: selectedTheme.colors.secondary }}
                />
                <span className="text-sm text-muted-foreground">Background</span>
              </div>
              <div className="flex-1 text-center">
                <div
                  className="w-full h-16 rounded-lg border border-border mb-2"
                  style={{ backgroundColor: selectedTheme.colors.accent }}
                />
                <span className="text-sm text-muted-foreground">Accent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Warna Aksen Kustom</CardTitle>
          <CardDescription>
            Pilih warna aksen untuk tombol dan elemen interaktif (opsional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="theme.primaryColor"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-5 gap-4"
              >
                {colorOptions.map((color) => (
                  <div key={color.id} className="flex flex-col items-center gap-2">
                    <RadioGroupItem
                      value={color.id}
                      id={`color-${color.id}`}
                      className="peer sr-only"
                    />
                    <Label htmlFor={`color-${color.id}`} className="cursor-pointer">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full border-2 transition-all",
                          selectedPrimary === color.id
                            ? "border-foreground ring-2 ring-offset-2 ring-foreground/20"
                            : "border-border hover:border-muted-foreground"
                        )}
                        style={{ backgroundColor: color.color }}
                      />
                    </Label>
                    <span className="text-xs text-muted-foreground">{color.name}</span>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
