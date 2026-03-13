"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/lib/hooks/use-plans";
import { plans as fallbackPlans } from "@/lib/plans";

function PricingCardsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border/70 bg-background/80 p-6 lg:p-8 animate-pulse backdrop-blur-sm">
          <div className="h-6 w-24 rounded bg-muted" />
          <div className="mt-4 h-4 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-40 rounded bg-muted" />
          <div className="mt-6 h-10 w-36 rounded bg-muted" />

          <div className="mt-8 space-y-3">
            {Array.from({ length: 7 }).map((__, featureIndex) => (
              <div key={featureIndex} className="h-4 w-40 rounded bg-muted" />
            ))}
          </div>

          <div className="mt-8 h-11 w-full rounded bg-muted" />
        </div>
      ))}
    </>
  );
}

export function Pricing() {
  const plansQuery = usePlans();
  const planItems = plansQuery.data ?? [];
  const isLoading = plansQuery.isLoading && planItems.length === 0;
  const items = planItems.length ? planItems : fallbackPlans;

  return (
    <section id="pricing" className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_20%,rgba(139,87,74,0.09),transparent_35%),radial-gradient(circle_at_85%_22%,rgba(181,140,97,0.12),transparent_42%),linear-gradient(180deg,#f8f5f3_0%,#f5f1ee_48%,#f9f6f4_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(138,98,84,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(138,98,84,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="pointer-events-none absolute -left-24 top-16 -z-10 h-52 w-52 rounded-full bg-[#caa38f]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 -z-10 h-60 w-60 rounded-full bg-[#7d4f44]/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary/90">
            Harga Transparan
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Pilih Paket yang Sesuai
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Harga sekali bayar, tanpa biaya tersembunyi. Undangan aktif selamanya.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {isLoading ? (
            <PricingCardsSkeleton />
          ) : (
            items.map((plan) => (
              <div
                key={plan.code}
                className={`group relative rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/80 shadow-[0_24px_55px_rgba(93,45,32,0.25)]"
                    : "border border-border/70 bg-background/85 shadow-[0_12px_36px_rgba(72,40,30,0.08)] backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(72,40,30,0.12)]"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground shadow">
                    Paling Populer
                  </Badge>
                )}

                <div className="mb-6">
                  <h3
                    className={`mb-2 text-xl font-semibold ${
                      plan.popular ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mb-4 text-sm ${
                      plan.popular ? "text-primary-foreground/85" : "text-muted-foreground"
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-primary-foreground/85" : "text-muted-foreground"
                      }`}
                    >
                      Rp
                    </span>
                    <span
                      className={`text-4xl font-bold tracking-tight ${
                        plan.popular ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {plan.priceLabel}
                    </span>
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check
                          className={`h-5 w-5 shrink-0 ${
                            plan.popular ? "text-primary-foreground" : "text-primary"
                          }`}
                        />
                      ) : (
                        <X
                          className={`h-5 w-5 shrink-0 ${
                            plan.popular ? "text-primary-foreground/45" : "text-muted-foreground/50"
                          }`}
                        />
                      )}
                      <span
                        className={`text-sm leading-6 ${
                          feature.included
                            ? plan.popular
                              ? "text-primary-foreground"
                              : "text-foreground"
                            : plan.popular
                              ? "text-primary-foreground/45"
                              : "text-muted-foreground/55"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full" variant={plan.popular ? "secondary" : "default"}>
                  <Link href={`/register?plan=${plan.code}`}>{plan.cta}</Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
