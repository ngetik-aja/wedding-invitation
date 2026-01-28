"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CoupleFormProps {
  data: {
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
  onChange: (data: CoupleFormProps["data"]) => void;
}

export function CoupleForm({ data, onChange }: CoupleFormProps) {
  const handleChange = (field: keyof CoupleFormProps["data"], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Data Pengantin</h2>
        <p className="text-muted-foreground mt-1">
          Masukkan informasi kedua mempelai yang akan ditampilkan di undangan.
        </p>
      </div>

      {/* Groom Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mempelai Pria</CardTitle>
          <CardDescription>Informasi calon pengantin pria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groomName">Nama Panggilan</Label>
              <Input
                id="groomName"
                placeholder="John"
                value={data.groomName}
                onChange={(e) => handleChange("groomName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groomFullName">Nama Lengkap</Label>
              <Input
                id="groomFullName"
                placeholder="John Doe, S.Kom"
                value={data.groomFullName}
                onChange={(e) => handleChange("groomFullName", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groomFather">Nama Ayah</Label>
              <Input
                id="groomFather"
                placeholder="Bapak Robert Doe"
                value={data.groomFather}
                onChange={(e) => handleChange("groomFather", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groomMother">Nama Ibu</Label>
              <Input
                id="groomMother"
                placeholder="Ibu Sarah Doe"
                value={data.groomMother}
                onChange={(e) => handleChange("groomMother", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="groomPhoto">URL Foto</Label>
            <Input
              id="groomPhoto"
              placeholder="https://example.com/photo.jpg"
              value={data.groomPhoto}
              onChange={(e) => handleChange("groomPhoto", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Unggah foto ke layanan hosting gambar dan tempel URL-nya di sini.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bride Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mempelai Wanita</CardTitle>
          <CardDescription>Informasi calon pengantin wanita</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brideName">Nama Panggilan</Label>
              <Input
                id="brideName"
                placeholder="Jane"
                value={data.brideName}
                onChange={(e) => handleChange("brideName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brideFullName">Nama Lengkap</Label>
              <Input
                id="brideFullName"
                placeholder="Jane Smith, S.E"
                value={data.brideFullName}
                onChange={(e) => handleChange("brideFullName", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brideFather">Nama Ayah</Label>
              <Input
                id="brideFather"
                placeholder="Bapak Michael Smith"
                value={data.brideFather}
                onChange={(e) => handleChange("brideFather", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brideMother">Nama Ibu</Label>
              <Input
                id="brideMother"
                placeholder="Ibu Emily Smith"
                value={data.brideMother}
                onChange={(e) => handleChange("brideMother", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bridePhoto">URL Foto</Label>
            <Input
              id="bridePhoto"
              placeholder="https://example.com/photo.jpg"
              value={data.bridePhoto}
              onChange={(e) => handleChange("bridePhoto", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Unggah foto ke layanan hosting gambar dan tempel URL-nya di sini.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
