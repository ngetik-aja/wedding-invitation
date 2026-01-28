"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationFormProps {
  data: {
    akadVenue: string;
    akadAddress: string;
    akadMapsUrl: string;
    resepsiVenue: string;
    resepsiAddress: string;
    resepsiMapsUrl: string;
  };
  onChange: (data: LocationFormProps["data"]) => void;
}

export function LocationForm({ data, onChange }: LocationFormProps) {
  const handleChange = (field: keyof LocationFormProps["data"], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Lokasi Acara</h2>
        <p className="text-muted-foreground mt-1">
          Masukkan detail lokasi untuk memudahkan tamu menemukan tempat acara.
        </p>
      </div>

      {/* Akad Location */}
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
              value={data.akadVenue}
              onChange={(e) => handleChange("akadVenue", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="akadAddress">Alamat Lengkap</Label>
            <Textarea
              id="akadAddress"
              placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
              rows={3}
              value={data.akadAddress}
              onChange={(e) => handleChange("akadAddress", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="akadMapsUrl">Link Google Maps</Label>
            <Input
              id="akadMapsUrl"
              placeholder="https://maps.google.com/..."
              value={data.akadMapsUrl}
              onChange={(e) => handleChange("akadMapsUrl", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Buka Google Maps, cari lokasi, klik Share, lalu copy link-nya.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resepsi Location */}
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
              value={data.resepsiVenue}
              onChange={(e) => handleChange("resepsiVenue", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resepsiAddress">Alamat Lengkap</Label>
            <Textarea
              id="resepsiAddress"
              placeholder="Jl. Contoh No. 456, Kelurahan, Kecamatan, Kota"
              rows={3}
              value={data.resepsiAddress}
              onChange={(e) => handleChange("resepsiAddress", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resepsiMapsUrl">Link Google Maps</Label>
            <Input
              id="resepsiMapsUrl"
              placeholder="https://maps.google.com/..."
              value={data.resepsiMapsUrl}
              onChange={(e) => handleChange("resepsiMapsUrl", e.target.value)}
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
