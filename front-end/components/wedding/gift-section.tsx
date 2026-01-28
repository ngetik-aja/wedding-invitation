"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check, CreditCard, Wallet } from "lucide-react";

interface GiftInfo {
  type: "bank" | "ewallet";
  name: string;
  accountNumber: string;
  accountName: string;
}

interface GiftSectionProps {
  gifts: GiftInfo[];
}

export function GiftSection({ gifts }: GiftSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Wedding Gift
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Send Your Love
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your presence at our wedding is the greatest gift. However, if you
            wish to honor us with a gift, we have provided the following
            options.
          </p>
        </div>

        <div className="space-y-4">
          {gifts.map((gift, index) => (
            <div
              key={index}
              className="bg-background p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {gift.type === "bank" ? (
                    <CreditCard className="w-6 h-6 text-primary" />
                  ) : (
                    <Wallet className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1">
                    {gift.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    a/n {gift.accountName}
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="text-lg font-mono text-foreground bg-muted px-3 py-1 rounded">
                      {gift.accountNumber}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(gift.accountNumber, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
