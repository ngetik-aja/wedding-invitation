"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeddingFormValues } from "@/lib/wedding-form-schema";

export function EventForm() {
  const { register } = useFormContext<WeddingFormValues>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Informasi Acara</h2>
        <p className="text-muted-foreground mt-1">
          Atur tanggal dan waktu acara pernikahan Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Akad Nikah / Pemberkatan</CardTitle>
          <CardDescription>Waktu pelaksanaan akad atau pemberkatan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="akadDate">Tanggal</Label>
            <Input id="akadDate" type="date" {...register("event.akadDate")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="akadTime">Waktu Mulai</Label>
              <Input id="akadTime" type="time" {...register("event.akadTime")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="akadEndTime">Waktu Selesai</Label>
              <Input id="akadEndTime" type="time" {...register("event.akadEndTime")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resepsi</CardTitle>
          <CardDescription>Waktu pelaksanaan resepsi pernikahan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resepsiDate">Tanggal</Label>
            <Input id="resepsiDate" type="date" {...register("event.resepsiDate")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resepsiTime">Waktu Mulai</Label>
              <Input id="resepsiTime" type="time" {...register("event.resepsiTime")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resepsiEndTime">Waktu Selesai</Label>
              <Input id="resepsiEndTime" type="time" {...register("event.resepsiEndTime")} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
