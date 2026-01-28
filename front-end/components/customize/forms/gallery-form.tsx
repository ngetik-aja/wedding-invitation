"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, ImageIcon } from "lucide-react";

interface GalleryFormProps {
  data: {
    photos: string[];
  };
  onChange: (data: GalleryFormProps["data"]) => void;
}

export function GalleryForm({ data, onChange }: GalleryFormProps) {
  const [newUrl, setNewUrl] = useState("");

  const addPhoto = () => {
    if (newUrl.trim()) {
      onChange({ photos: [...data.photos, newUrl.trim()] });
      setNewUrl("");
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index);
    onChange({ photos: newPhotos });
  };

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
          {/* Add Photo Input */}
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/photo.jpg"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPhoto()}
            />
            <Button onClick={addPhoto} type="button">
              <Plus className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          </div>

          {/* Photo Grid */}
          {data.photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {data.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-secondary group"
                >
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
