import {
  Palette,
  Share2,
  Clock,
  Heart,
  MessageSquare,
  Gift,
  MapPin,
  Music,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Desain Kustomisasi Penuh",
    description: "Ubah warna, font, dan layout sesuai selera Anda. Ratusan kombinasi tersedia.",
  },
  {
    icon: Share2,
    title: "Mudah Dibagikan",
    description: "Bagikan undangan via WhatsApp, Instagram, atau link langsung ke tamu.",
  },
  {
    icon: Clock,
    title: "Hitung Mundur Otomatis",
    description: "Tampilkan countdown menuju hari bahagia Anda secara real-time.",
  },
  {
    icon: Heart,
    title: "Love Story",
    description: "Ceritakan perjalanan cinta Anda dengan timeline yang indah.",
  },
  {
    icon: MessageSquare,
    title: "Ucapan & Doa",
    description: "Terima ucapan dan doa dari para tamu langsung di undangan.",
  },
  {
    icon: Gift,
    title: "Amplop Digital",
    description: "Fitur transfer bank dan e-wallet untuk kemudahan tamu memberikan hadiah.",
  },
  {
    icon: MapPin,
    title: "Integrasi Maps",
    description: "Petunjuk lokasi langsung terintegrasi dengan Google Maps.",
  },
  {
    icon: Music,
    title: "Background Musik",
    description: "Pilih musik latar yang romantis untuk pengalaman lebih berkesan.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
            Fitur Lengkap
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Semua yang Anda Butuhkan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fitur lengkap untuk membuat undangan pernikahan digital yang sempurna dan berkesan.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-lg bg-background border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
