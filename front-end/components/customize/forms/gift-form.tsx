"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, CreditCard } from "lucide-react";

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface GiftFormProps {
  data: {
    banks: BankAccount[];
  };
  onChange: (data: GiftFormProps["data"]) => void;
}

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

export function GiftForm({ data, onChange }: GiftFormProps) {
  const addBank = () => {
    onChange({
      banks: [...data.banks, { bankName: "", accountNumber: "", accountName: "" }],
    });
  };

  const updateBank = (index: number, field: keyof BankAccount, value: string) => {
    const newBanks = [...data.banks];
    newBanks[index] = { ...newBanks[index], [field]: value };
    onChange({ banks: newBanks });
  };

  const removeBank = (index: number) => {
    const newBanks = data.banks.filter((_, i) => i !== index);
    onChange({ banks: newBanks });
  };

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
          {data.banks.length > 0 ? (
            data.banks.map((bank, index) => (
              <div
                key={index}
                className="relative p-4 rounded-lg border border-border bg-secondary/30"
              >
                <button
                  type="button"
                  onClick={() => removeBank(index)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Remove bank"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-4 pr-8">
                  <div className="space-y-2">
                    <Label>Bank / E-Wallet</Label>
                    <Select
                      value={bank.bankName}
                      onValueChange={(value) => updateBank(index, "bankName", value)}
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
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Rekening</Label>
                    <Input
                      placeholder="1234567890"
                      value={bank.accountNumber}
                      onChange={(e) => updateBank(index, "accountNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Pemilik Rekening</Label>
                    <Input
                      placeholder="John Doe"
                      value={bank.accountName}
                      onChange={(e) => updateBank(index, "accountName", e.target.value)}
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

          <Button onClick={addBank} variant="outline" className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Rekening
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
