"use client";

import { useFieldArray, useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Heart } from "lucide-react";
import { WeddingFormValues } from "@/lib/wedding-form-schema";

export function StoryForm() {
  const { control, register } = useFormContext<WeddingFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "story.stories",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Kisah Cinta</h2>
        <p className="text-muted-foreground mt-1">
          Ceritakan perjalanan cinta Anda dalam bentuk timeline yang indah.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Perjalanan Cinta</CardTitle>
          <CardDescription>
            Tambahkan momen-momen penting dalam hubungan Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="relative p-4 rounded-lg border border-border bg-secondary/30"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Hapus cerita"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-4 pr-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Judul Momen</Label>
                      <Input
                        placeholder="Pertama Kali Bertemu"
                        {...register(`story.stories.${index}.title` as const)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal</Label>
                      <Input
                        placeholder="Januari 2020"
                        {...register(`story.stories.${index}.date` as const)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Textarea
                      placeholder="Ceritakan momen ini..."
                      rows={3}
                      {...register(`story.stories.${index}.description` as const)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Heart className="w-12 h-12 mb-4" />
              <p className="text-sm">Belum ada cerita. Mulai tambahkan momen pertama Anda.</p>
            </div>
          )}

          <Button
            onClick={() => append({ title: "", date: "", description: "" })}
            variant="outline"
            className="w-full bg-transparent"
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Momen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
