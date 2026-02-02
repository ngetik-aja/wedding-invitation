"use client";

import { useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeddingFormValues } from "@/lib/wedding-form-schema";

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export function CoupleForm() {
  const { register, setValue, control } = useFormContext<WeddingFormValues>();
  const groomPhoto = useWatch({ control, name: "couple.groomPhoto" });
  const bridePhoto = useWatch({ control, name: "couple.bridePhoto" });

  const handleFileChange = useCallback(
    async (field: "couple.groomPhoto" | "couple.bridePhoto", file?: File | null) => {
      if (!file) return;
      try {
        const dataUrl = await fileToDataUrl(file);
        setValue(field, dataUrl, { shouldDirty: true });
      } catch {
        // ignore read errors
      }
    },
    [setValue]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Data Pengantin</h2>
        <p className="text-muted-foreground mt-1">
          Masukkan informasi kedua mempelai yang akan ditampilkan di undangan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mempelai Pria</CardTitle>
          <CardDescription>Informasi calon pengantin pria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groomName">Nama Panggilan</Label>
              <Input id="groomName" placeholder="John" {...register("couple.groomName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groomFullName">Nama Lengkap</Label>
              <Input id="groomFullName" placeholder="John Doe, S.Kom" {...register("couple.groomFullName")} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groomFather">Nama Ayah</Label>
              <Input id="groomFather" placeholder="Bapak Robert Doe" {...register("couple.groomFather")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groomMother">Nama Ibu</Label>
              <Input id="groomMother" placeholder="Ibu Sarah Doe" {...register("couple.groomMother")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Foto Mempelai Pria</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => handleFileChange("couple.groomPhoto", event.target.files?.[0])}
            />
            {groomPhoto && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={groomPhoto}
                  alt="Foto mempelai pria"
                  className="h-20 w-20 rounded-lg object-cover border"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setValue("couple.groomPhoto", "", { shouldDirty: true })}
                >
                  Hapus Foto
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Upload foto, nanti tersimpan sebagai data gambar (tanpa URL).
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mempelai Wanita</CardTitle>
          <CardDescription>Informasi calon pengantin wanita</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brideName">Nama Panggilan</Label>
              <Input id="brideName" placeholder="Jane" {...register("couple.brideName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brideFullName">Nama Lengkap</Label>
              <Input id="brideFullName" placeholder="Jane Smith, S.E" {...register("couple.brideFullName")} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brideFather">Nama Ayah</Label>
              <Input id="brideFather" placeholder="Bapak Michael Smith" {...register("couple.brideFather")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brideMother">Nama Ibu</Label>
              <Input id="brideMother" placeholder="Ibu Emily Smith" {...register("couple.brideMother")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Foto Mempelai Wanita</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => handleFileChange("couple.bridePhoto", event.target.files?.[0])}
            />
            {bridePhoto && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={bridePhoto}
                  alt="Foto mempelai wanita"
                  className="h-20 w-20 rounded-lg object-cover border"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setValue("couple.bridePhoto", "", { shouldDirty: true })}
                >
                  Hapus Foto
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Upload foto, nanti tersimpan sebagai data gambar (tanpa URL).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
