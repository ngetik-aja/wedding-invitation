"use client";

import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";

interface MusicFormProps {
  data: {
    enabled: boolean;
    selectedMusic: string;
    customMusicUrl: string;
  };
  onChange: (data: MusicFormProps["data"]) => void;
}

const musicOptions = [
  {
    id: "mixkit-wedding-01",
    name: "Wedding 01",
    artist: "Francisco Alvear (Mixkit)",
    src: "/music/wedding-01.mp3",
  },
  {
    id: "mixkit-wedding-harp",
    name: "Wedding Harp",
    artist: "Francisco Alvear (Mixkit)",
    src: "/music/wedding-harp.mp3",
  },
  {
    id: "mixkit-wedding-02",
    name: "Wedding 02",
    artist: "Francisco Alvear (Mixkit)",
    src: "/music/wedding-02.mp3",
  },
  {
    id: "mixkit-wedding-music",
    name: "Wedding Music",
    artist: "Arulo (Mixkit)",
    src: "/music/wedding-music.mp3",
  },
  {
    id: "mixkit-wedding-song-03",
    name: "Wedding Song 03",
    artist: "Arulo (Mixkit)",
    src: "/music/wedding-song-03.mp3",
  },
  {
    id: "mixkit-wedding-03",
    name: "Wedding 03",
    artist: "Francisco Alvear (Mixkit)",
    src: "/music/wedding-03.mp3",
  },
  { id: "custom", name: "Musik Custom", artist: "Upload sendiri" },
];

type MusicOption = (typeof musicOptions)[number];

export function MusicForm({ data, onChange }: MusicFormProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!data.enabled && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingId(null);
    }
  }, [data.enabled]);

  useEffect(() => {
    if (data.selectedMusic === "custom" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingId(null);
    }
  }, [data.selectedMusic]);

  const handleTogglePreview = async (music: MusicOption) => {
    if (!music.src || !audioRef.current) return;

    const audio = audioRef.current;
    if (playingId === music.id && !audio.paused) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    if (playingId && playingId !== music.id) {
      audio.pause();
    }

    if (playingId !== music.id) {
      audio.src = music.src;
      audio.currentTime = 0;
    }

    try {
      await audio.play();
      setPlayingId(music.id);
    } catch {
      // ignore play interruption
    }
  };

  const handleAudioEnded = () => {
    setPlayingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Background Musik</h2>
        <p className="text-muted-foreground mt-1">
          Tambahkan musik latar untuk pengalaman undangan yang lebih berkesan.
        </p>
      </div>

      {/* Enable Music */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktifkan Musik</CardTitle>
              <CardDescription>
                Musik akan diputar otomatis saat undangan dibuka
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {data.enabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <Switch
                checked={data.enabled}
                onCheckedChange={(checked) => onChange({ ...data, enabled: checked })}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Music Selection */}
      {data.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Musik</CardTitle>
            <CardDescription>
              Pilih dari koleksi musik gratis untuk komersial (Mixkit) atau upload musik sendiri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={data.selectedMusic}
              onValueChange={(value) => onChange({ ...data, selectedMusic: value })}
              className="space-y-3"
            >
              {musicOptions.map((music) => (
                <div key={music.id}>
                  <RadioGroupItem
                    value={music.id}
                    id={music.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={music.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border border-border cursor-pointer transition-all hover:border-primary/50",
                      "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{music.name}</p>
                      <p className="text-sm text-muted-foreground">{music.artist}</p>
                    </div>
                    {music.src && (
                      <button
                        type="button"
                        aria-label={`Preview ${music.name}`}
                        className={cn(
                          "ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors",
                          "hover:border-primary/60 hover:text-primary"
                        )}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleTogglePreview(music);
                        }}
                      >
                        {playingId === music.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <audio ref={audioRef} onEnded={handleAudioEnded} />

            {/* Custom Music URL */}
            {data.selectedMusic === "custom" && (
              <div className="space-y-2 pt-4 border-t border-border">
                <Label htmlFor="customMusicUrl">URL Musik (MP3)</Label>
                <Input
                  id="customMusicUrl"
                  placeholder="https://example.com/music.mp3"
                  value={data.customMusicUrl}
                  onChange={(e) => onChange({ ...data, customMusicUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Unggah file MP3 ke layanan hosting dan tempel URL-nya di sini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
