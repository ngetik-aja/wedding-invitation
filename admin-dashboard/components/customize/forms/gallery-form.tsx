"use client";

import { useFieldArray, useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, ImageIcon } from "lucide-react";
import { WeddingFormValues } from "@/lib/wedding-form-schema";

export function GalleryForm() {
  const { control, register, watch } = useFormContext<WeddingFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gallery.photos",
  });

  const photos = watch("gallery.photos");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Galeri Foto</h2>
        <p className="text-muted-foreground mt-1">
          Tambahkan foto-foto prewedding atau momen spesial Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foto Galeri</CardTitle>
          <CardDescription>
            Tambahkan URL foto dari layanan hosting gambar (imgur, cloudinary, dll)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => append("")}
              type="button"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Foto
            </Button>
          </div>

          {fields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>URL Foto {index + 1}</Label>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                      Hapus
                    </button>
                  </div>
                  <Input
                    placeholder="https://example.com/photo.jpg"
                    {...register(`gallery.photos.${index}` as const)}
                  />
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
                    <img
                      src={photos?.[index] || "/placeholder.svg"}
                      alt={`Galeri ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-4" />
              <p className="text-sm">Belum ada foto. Tambahkan foto pertama Anda.</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Tip: Gunakan foto dengan rasio 1:1 atau 4:5 untuk hasil terbaik.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
