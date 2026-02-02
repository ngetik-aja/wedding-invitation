"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handlePhotoChange = (field: "groomPhoto" | "bridePhoto", file?: File | null) => {
    if (!file) {
      handleChange(field, "");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      handleChange(field, result);
    };
    reader.readAsDataURL(file);
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
            <Label htmlFor="groomPhoto">Foto Mempelai Pria</Label>
            <Input
              id="groomPhoto"
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange("groomPhoto", e.target.files?.[0])}
            />
            {data.groomPhoto ? (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={data.groomPhoto}
                  alt="Preview mempelai pria"
                  className="h-20 w-20 rounded-full object-cover border"
                />
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => handleChange("groomPhoto", "")}
                >
                  Hapus foto
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Unggah foto langsung dari perangkat.</p>
            )}
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
            <Label htmlFor="bridePhoto">Foto Mempelai Wanita</Label>
            <Input
              id="bridePhoto"
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange("bridePhoto", e.target.files?.[0])}
            />
            {data.bridePhoto ? (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={data.bridePhoto}
                  alt="Preview mempelai wanita"
                  className="h-20 w-20 rounded-full object-cover border"
                />
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => handleChange("bridePhoto", "")}
                >
                  Hapus foto
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Unggah foto langsung dari perangkat.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
