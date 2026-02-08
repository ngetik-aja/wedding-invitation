import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { plans } from "@/lib/plans";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
            Harga Transparan
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pilih Paket yang Sesuai
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Harga sekali bayar, tanpa biaya tersembunyi. Undangan aktif selamanya.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-6 lg:p-8 ${
                plan.popular
                  ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-lg"
                  : "bg-background border border-border"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  Paling Populer
                </Badge>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    plan.popular ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-sm ${
                      plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    Rp
                  </span>
                  <span
                    className={`text-4xl font-bold ${
                      plan.popular ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {plan.priceLabel}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check
                        className={`w-5 h-5 shrink-0 ${
                          plan.popular ? "text-primary-foreground" : "text-primary"
                        }`}
                      />
                    ) : (
                      <X
                        className={`w-5 h-5 shrink-0 ${
                          plan.popular ? "text-primary-foreground/40" : "text-muted-foreground/50"
                        }`}
                      />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? plan.popular
                            ? "text-primary-foreground"
                            : "text-foreground"
                          : plan.popular
                            ? "text-primary-foreground/40"
                            : "text-muted-foreground/50"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full"
                variant={plan.popular ? "secondary" : "default"}
              >
                <Link href={`/register?plan=${plan.code}`}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          Garansi uang kembali 7 hari jika tidak puas. Tanpa pertanyaan.
        </p>
      </div>
    </section>
  );
}
