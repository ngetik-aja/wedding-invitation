"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getPlanByCode, type Plan } from "@/lib/plans";
import { getCustomerSession } from "@/lib/session";
import { usePlans } from "@/lib/hooks/use-plans";
import { getPaymentErrorMessage, useSubmitPayment } from "@/lib/hooks/use-submit-payment";

type Step = "plan" | "payment";

const steps: { key: Step; label: string; description: string }[] = [
  { key: "plan", label: "Pilih Paket", description: "Tentukan paket undangan" },
  { key: "payment", label: "Pembayaran", description: "Konfirmasi pembayaran" },
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlan = useMemo(
    () => getPlanByCode(searchParams.get("plan")),
    [searchParams]
  );

  const [step, setStep] = useState<Step>("plan");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(preselectedPlan || null);
  const [proofNote, setProofNote] = useState("");
  const [proofFileName, setProofFileName] = useState("");

  const plansQuery = usePlans();
  const paymentMutation = useSubmitPayment();

  useEffect(() => {
    const session = getCustomerSession();
    if (!session) {
      router.replace("/register");
      return;
    }
    setCustomerId(session.customerId);
  }, [router]);

  const stepIndex = steps.findIndex((item) => item.key === step);
  const plans = plansQuery.data || [];

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Customer Onboarding</p>
          <h1 className="text-3xl font-serif font-bold text-foreground">Onboarding Akun</h1>
          <p className="text-muted-foreground">
            Pilih paket dan selesaikan pembayaran sebelum mulai mengatur undangan.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((item, index) => (
            <Card
              key={item.key}
              className={cn(
                "border",
                index === stepIndex
                  ? "border-primary shadow-sm"
                  : index < stepIndex
                    ? "border-border/60"
                    : "border-border/40"
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{item.label}</CardTitle>
                  {index < stepIndex && (
                    <Badge variant="secondary" className="text-xs">
                      Selesai
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {step === "plan" && (
          <Card>
            <CardHeader>
              <CardTitle>Pilih Paket</CardTitle>
              <CardDescription>Pilih paket undangan yang sesuai kebutuhan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => {
                  const isSelected = selectedPlan?.code === plan.code;
                  return (
                    <button
                      key={plan.code}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={cn(
                        "text-left rounded-xl border p-5 transition",
                        isSelected ? "border-primary shadow-sm" : "border-border hover:border-primary/60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        {plan.popular && <Badge variant="secondary">Populer</Badge>}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                      <p className="mt-4 text-2xl font-bold">Rp {plan.priceLabel}</p>
                    </button>
                  );
                })}
              </div>
              {!plansQuery.isLoading && plans.length === 0 && (
                <p className="text-sm text-muted-foreground">Belum ada data paket.</p>
              )}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => router.push("/register")}>
                  Ganti data akun
                </Button>
                <Button onClick={() => setStep("payment")} disabled={!selectedPlan}>
                  Lanjut ke pembayaran
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "payment" && (
          <Card>
            <CardHeader>
              <CardTitle>Pembayaran</CardTitle>
              <CardDescription>Konfirmasi pembayaran agar bisa membuat undangan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Paket dipilih</p>
                    <p className="text-lg font-semibold">{selectedPlan?.name}</p>
                  </div>
                  <p className="text-xl font-bold">Rp {selectedPlan?.priceLabel}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Transfer ke rekening yang sudah ditentukan admin, lalu unggah bukti pembayaran di bawah.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="proofNote">Catatan pembayaran (opsional)</Label>
                <Input
                  id="proofNote"
                  value={proofNote}
                  onChange={(event) => setProofNote(event.target.value)}
                  placeholder="Contoh: BCA 123456789 a/n Andi"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="proofFile">Bukti pembayaran (opsional)</Label>
                <Input
                  id="proofFile"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setProofFileName(file?.name || "");
                  }}
                />
                {proofFileName && (
                  <p className="text-xs text-muted-foreground">File terpilih: {proofFileName}</p>
                )}
              </div>

              {paymentMutation.isError && (
                <p className="text-sm text-destructive">
                  {getPaymentErrorMessage(paymentMutation.error)}
                </p>
              )}

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setStep("plan")}>
                  Kembali
                </Button>
                <Button
                  onClick={() =>
                    paymentMutation.mutate(
                      {
                        customerId: customerId || "",
                        planCode: selectedPlan?.code || "basic",
                        amount: selectedPlan?.price || 0,
                        currency: "IDR",
                        proofNote: proofNote.trim() || undefined,
                        proofFileName: proofFileName || undefined,
                      },
                      {
                        onSuccess: () => router.push("/customize"),
                      }
                    )
                  }
                  disabled={paymentMutation.isPending || !customerId || !selectedPlan}
                >
                  {paymentMutation.isPending ? "Memproses..." : "Konfirmasi & Buat Undangan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}


export default function OnboardingPage() {
  return (
    <Suspense
      fallback={(
        <main className="min-h-screen bg-background px-4 py-12">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="h-10 w-64 animate-pulse rounded bg-muted" />
            <div className="h-4 w-80 animate-pulse rounded bg-muted" />
          </div>
        </main>
      )}
    >
      <OnboardingContent />
    </Suspense>
  );
}
