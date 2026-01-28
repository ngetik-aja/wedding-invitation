"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Heart } from "lucide-react";

interface StoryItem {
  title: string;
  date: string;
  description: string;
}

interface StoryFormProps {
  data: {
    stories: StoryItem[];
  };
  onChange: (data: StoryFormProps["data"]) => void;
}

export function StoryForm({ data, onChange }: StoryFormProps) {
  const addStory = () => {
    onChange({
      stories: [...data.stories, { title: "", date: "", description: "" }],
    });
  };

  const updateStory = (index: number, field: keyof StoryItem, value: string) => {
    const newStories = [...data.stories];
    newStories[index] = { ...newStories[index], [field]: value };
    onChange({ stories: newStories });
  };

  const removeStory = (index: number) => {
    const newStories = data.stories.filter((_, i) => i !== index);
    onChange({ stories: newStories });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Love Story</h2>
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
          {data.stories.length > 0 ? (
            data.stories.map((story, index) => (
              <div
                key={index}
                className="relative p-4 rounded-lg border border-border bg-secondary/30"
              >
                <button
                  type="button"
                  onClick={() => removeStory(index)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Remove story"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-4 pr-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Judul Momen</Label>
                      <Input
                        placeholder="Pertama Kali Bertemu"
                        value={story.title}
                        onChange={(e) => updateStory(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal</Label>
                      <Input
                        placeholder="Januari 2020"
                        value={story.date}
                        onChange={(e) => updateStory(index, "date", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Textarea
                      placeholder="Ceritakan momen ini..."
                      rows={3}
                      value={story.description}
                      onChange={(e) => updateStory(index, "description", e.target.value)}
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

          <Button onClick={addStory} variant="outline" className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Momen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
