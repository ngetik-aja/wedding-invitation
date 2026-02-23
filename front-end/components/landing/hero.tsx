import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        {/*<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Lebih dari 10.000+ undangan telah dibuat</span>
        </div>*/}

        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
          Buat Undangan Pernikahan Digital yang Elegan
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Wujudkan undangan pernikahan impian Anda dengan desain yang indah, mudah disesuaikan, dan siap dibagikan dalam hitungan menit.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="text-base px-8">
            <Link href="/login">
              Buat Undangan
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8 bg-transparent">
            <Link href="/#templates">Lihat Contoh</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        {/*<div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">1000+</span>
            <span>Template tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">24/7</span>
            <span>Customer support</span>
          </div>
        </div>*/}
      </div>
    </section>
  );
}
