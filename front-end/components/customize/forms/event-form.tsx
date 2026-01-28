"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EventFormProps {
  data: {
    akadDate: string;
    akadTime: string;
    akadEndTime: string;
    resepsiDate: string;
    resepsiTime: string;
    resepsiEndTime: string;
  };
  onChange: (data: EventFormProps["data"]) => void;
}

export function EventForm({ data, onChange }: EventFormProps) {
  const handleChange = (field: keyof EventFormProps["data"], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Informasi Acara</h2>
        <p className="text-muted-foreground mt-1">
          Atur tanggal dan waktu acara pernikahan Anda.
        </p>
      </div>

      {/* Akad Section */}
      <Card>
        <CardHeader>
          <CardTitle>Akad Nikah / Pemberkatan</CardTitle>
          <CardDescription>Waktu pelaksanaan akad atau pemberkatan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="akadDate">Tanggal</Label>
            <Input
              id="akadDate"
              type="date"
              value={data.akadDate}
              onChange={(e) => handleChange("akadDate", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="akadTime">Waktu Mulai</Label>
              <Input
                id="akadTime"
                type="time"
                value={data.akadTime}
                onChange={(e) => handleChange("akadTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="akadEndTime">Waktu Selesai</Label>
              <Input
                id="akadEndTime"
                type="time"
                value={data.akadEndTime}
                onChange={(e) => handleChange("akadEndTime", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resepsi Section */}
      <Card>
        <CardHeader>
          <CardTitle>Resepsi</CardTitle>
          <CardDescription>Waktu pelaksanaan resepsi pernikahan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resepsiDate">Tanggal</Label>
            <Input
              id="resepsiDate"
              type="date"
              value={data.resepsiDate}
              onChange={(e) => handleChange("resepsiDate", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resepsiTime">Waktu Mulai</Label>
              <Input
                id="resepsiTime"
                type="time"
                value={data.resepsiTime}
                onChange={(e) => handleChange("resepsiTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resepsiEndTime">Waktu Selesai</Label>
              <Input
                id="resepsiEndTime"
                type="time"
                value={data.resepsiEndTime}
                onChange={(e) => handleChange("resepsiEndTime", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
