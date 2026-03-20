import { ArrowRight, Sparkles, Star, Users, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 h-dvh flex items-center overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_25%_20%,rgba(139,87,74,0.13),transparent_55%),radial-gradient(ellipse_at_78%_75%,rgba(181,140,97,0.11),transparent_50%),linear-gradient(180deg,#faf7f5_0%,#f6f1ed_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(rgba(138,98,84,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute -left-40 top-1/4 -z-10 h-80 w-80 rounded-full bg-[#e8c4b0]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-[#c9a882]/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-20 -z-10 h-64 w-64 rounded-full bg-[#e0d0c0]/20 blur-3xl" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/60 text-secondary-foreground text-sm mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Undangan digital eksklusif untuk hari istimewa Anda</span>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
          Rayakan Momen Anda dengan Elegan.
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Undangan digital eksklusif tanpa ornamen berlebihan. Diciptakan untuk Anda yang menghargai estetika minimalis, privasi, dan kenyamanan tamu saat mengakses undangan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button size="lg" asChild className="text-base px-8 shadow-md">
            <Link href="/login">
              Buat Undangan
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8 bg-background/60 backdrop-blur-sm">
            <Link href="/#templates">Lihat Contoh</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span>4.9/5 Rating</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span><span className="font-semibold text-foreground">500+</span> Pasangan puas</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Pembayaran aman</span>
          </div>
        </div>
      </div>
    </section>
  );
}
