"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeddingFormValues } from "@/lib/wedding-form-schema";

export function LocationForm() {
  const { register } = useFormContext<WeddingFormValues>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Lokasi Acara</h2>
        <p className="text-muted-foreground mt-1">
          Masukkan detail lokasi untuk memudahkan tamu menemukan tempat acara.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lokasi Akad / Pemberkatan</CardTitle>
          <CardDescription>Alamat tempat pelaksanaan akad atau pemberkatan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="akadVenue">Nama Tempat</Label>
            <Input
              id="akadVenue"
              placeholder="Masjid Al-Ikhlas"
              {...register("location.akadVenue")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="akadAddress">Alamat Lengkap</Label>
            <Textarea
              id="akadAddress"
              placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
              rows={3}
              {...register("location.akadAddress")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="akadMapsUrl">Link Google Maps</Label>
            <Input
              id="akadMapsUrl"
              placeholder="https://maps.google.com/..."
              {...register("location.akadMapsUrl")}
            />
            <p className="text-xs text-muted-foreground">
              Buka Google Maps, cari lokasi, klik Share, lalu copy link-nya.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lokasi Resepsi</CardTitle>
          <CardDescription>Alamat tempat pelaksanaan resepsi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resepsiVenue">Nama Tempat</Label>
            <Input
              id="resepsiVenue"
              placeholder="Gedung Serbaguna Harmony"
              {...register("location.resepsiVenue")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resepsiAddress">Alamat Lengkap</Label>
            <Textarea
              id="resepsiAddress"
              placeholder="Jl. Contoh No. 456, Kelurahan, Kecamatan, Kota"
              rows={3}
              {...register("location.resepsiAddress")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resepsiMapsUrl">Link Google Maps</Label>
            <Input
              id="resepsiMapsUrl"
              placeholder="https://maps.google.com/..."
              {...register("location.resepsiMapsUrl")}
            />
            <p className="text-xs text-muted-foreground">
              Buka Google Maps, cari lokasi, klik Share, lalu copy link-nya.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
