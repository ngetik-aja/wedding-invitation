"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getPlanByCode, type Plan } from "@/lib/plans";
import { getCustomerSession } from "@/lib/session";
import { usePlans } from "@/lib/hooks/use-plans";
import { getPaymentErrorMessage, useCheckPaymentProgress, useSubmitPayment } from "@/lib/hooks/use-submit-payment";
import type { CreatePaymentResponse } from "@/lib/payment";

type Step = "plan" | "payment";

const steps: { key: Step; label: string; description: string }[] = [
  { key: "plan", label: "Pilih Paket", description: "Tentukan paket undangan" },
  { key: "payment", label: "Pembayaran", description: "Selesaikan pembayaran Midtrans" },
];

function formatPaymentStatus(status: string | null) {
  if (!status) return "-";

  const normalized = status.toLowerCase();
  switch (normalized) {
    case "paid":
      return "Lunas";
    case "pending":
      return "Menunggu Pembayaran";
    case "failed":
      return "Gagal";
    case "refunded":
      return "Refund";
    default:
      return normalized;
  }
}

function PlanCardsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-xl border border-border p-5 animate-pulse">
          <div className="h-6 w-24 rounded bg-muted" />
          <div className="mt-3 h-4 w-44 rounded bg-muted" />
          <div className="mt-2 h-4 w-36 rounded bg-muted" />
          <div className="mt-6 h-10 w-32 rounded bg-muted" />
        </div>
      ))}
    </>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlanCode = useMemo(() => searchParams.get("plan"), [searchParams]);

  const [step, setStep] = useState<Step>("plan");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentResult, setPaymentResult] = useState<CreatePaymentResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const plansQuery = usePlans();
  const paymentMutation = useSubmitPayment();
  const paymentProgressMutation = useCheckPaymentProgress();

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

  useEffect(() => {
    if (!plans.length || !preselectedPlanCode) return;
    setSelectedPlan((current) => {
      if (current) return current;
      return getPlanByCode(plans, preselectedPlanCode) || null;
    });
  }, [plans, preselectedPlanCode]);

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Customer Onboarding</p>
          <h1 className="text-3xl font-serif font-bold text-foreground">Onboarding Akun</h1>
          <p className="text-muted-foreground">
            Pilih paket, lanjutkan pembayaran Midtrans, lalu cek progres pembayaran sampai lunas.
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
                {plansQuery.isLoading && !plans.length ? (
                  <PlanCardsSkeleton />
                ) : (
                  plans.map((plan) => {
                    const isSelected = selectedPlan?.code === plan.code;
                    return (
                      <button
                        key={plan.code}
                        type="button"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setPaymentResult(null);
                          setPaymentStatus(null);
                        }}
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
                  })
                )}
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
              <CardDescription>Buat transaksi Midtrans, lakukan pembayaran, lalu cek statusnya.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Paket dipilih</p>
                    <p className="text-lg font-semibold">{selectedPlan?.name}</p>
                  </div>
                  <p className="text-xl font-bold">Rp {selectedPlan?.priceLabel}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Klik tombol buat transaksi untuk membuka halaman pembayaran Midtrans.
                </p>
              </div>

              {paymentResult && (
                <div className="rounded-lg border border-border p-4 text-sm space-y-2">
                  <p><span className="text-muted-foreground">Payment ID:</span> {paymentResult.paymentId}</p>
                  <p><span className="text-muted-foreground">Order ID:</span> {paymentResult.midtransOrderId}</p>
                  <p><span className="text-muted-foreground">Status:</span> {formatPaymentStatus(paymentStatus || paymentResult.status)}</p>
                </div>
              )}

              {(paymentMutation.isError || paymentProgressMutation.isError) && (
                <p className="text-sm text-destructive">
                  {getPaymentErrorMessage(paymentMutation.error || paymentProgressMutation.error)}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Button variant="outline" onClick={() => setStep("plan")}>
                  Kembali
                </Button>

                <div className="flex items-center gap-3 flex-wrap">
                  {paymentResult?.midtransRedirect && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(paymentResult.midtransRedirect, "_blank", "noopener,noreferrer")}
                    >
                      Buka Halaman Midtrans
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!customerId || !paymentResult?.paymentId) return;
                      paymentProgressMutation.mutate(
                        {
                          customerId,
                          paymentId: paymentResult.paymentId,
                        },
                        {
                          onSuccess: (data) => {
                            setPaymentStatus(data.status);
                            setPaymentResult((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                status: data.status,
                              };
                            });
                          },
                        }
                      );
                    }}
                    disabled={paymentProgressMutation.isPending || !customerId || !paymentResult?.paymentId}
                  >
                    {paymentProgressMutation.isPending ? "Mengecek..." : "Cek Progress Pembayaran"}
                  </Button>

                  <Button
                    onClick={() => {
                      if ((paymentStatus || paymentResult?.status) === "paid") {
                        router.push("/customize");
                        return;
                      }

                      if (!customerId || !selectedPlan) return;
                      paymentMutation.mutate(
                        {
                          customerId,
                          planCode: selectedPlan.code,
                        },
                        {
                          onSuccess: (data) => {
                            setPaymentResult(data);
                            setPaymentStatus(data.status);
                            if (data.midtransRedirect) {
                              window.open(data.midtransRedirect, "_blank", "noopener,noreferrer");
                            }
                          },
                        }
                      );
                    }}
                    disabled={paymentMutation.isPending || !customerId || !selectedPlan}
                  >
                    {paymentMutation.isPending
                      ? "Membuat Transaksi..."
                      : (paymentStatus || paymentResult?.status) === "paid"
                        ? "Lanjut ke Customize"
                        : "Buat Transaksi Midtrans"}
                  </Button>
                </div>
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
