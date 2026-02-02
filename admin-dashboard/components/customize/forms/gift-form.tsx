"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, CreditCard } from "lucide-react";
import { WeddingFormValues } from "@/lib/wedding-form-schema";

const bankOptions = [
  "BCA",
  "BNI",
  "BRI",
  "Mandiri",
  "CIMB Niaga",
  "Bank Jago",
  "Bank Jenius",
  "OVO",
  "GoPay",
  "DANA",
  "ShopeePay",
  "LinkAja",
];

export function GiftForm() {
  const { control, register } = useFormContext<WeddingFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gift.banks",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Amplop Digital</h2>
        <p className="text-muted-foreground mt-1">
          Tambahkan rekening bank atau e-wallet untuk menerima hadiah dari tamu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rekening & E-Wallet</CardTitle>
          <CardDescription>
            Informasi ini akan ditampilkan untuk memudahkan tamu memberikan hadiah
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
                  aria-label="Hapus bank"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-4 pr-8">
                  <div className="space-y-2">
                    <Label>Bank / E-Wallet</Label>
                    <Controller
                      control={control}
                      name={`gift.banks.${index}.bankName` as const}
                      render={({ field: controllerField }) => (
                        <Select
                          value={controllerField.value || ""}
                          onValueChange={controllerField.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih bank atau e-wallet" />
                          </SelectTrigger>
                          <SelectContent>
                            {bankOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Rekening</Label>
                    <Input
                      placeholder="1234567890"
                      {...register(`gift.banks.${index}.accountNumber` as const)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Pemilik Rekening</Label>
                    <Input
                      placeholder="John Doe"
                      {...register(`gift.banks.${index}.accountName` as const)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CreditCard className="w-12 h-12 mb-4" />
              <p className="text-sm">Belum ada rekening. Tambahkan rekening pertama Anda.</p>
            </div>
          )}

          <Button
            onClick={() =>
              append({ bankName: "", accountNumber: "", accountName: "" })
            }
            variant="outline"
            className="w-full bg-transparent"
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Rekening
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
