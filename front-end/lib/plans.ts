export type PlanFeature = {
  name: string
  included: boolean
}

export type Plan = {
  code: "basic" | "premium" | "exclusive"
  name: string
  price: number
  priceLabel: string
  description: string
  features: PlanFeature[]
  popular?: boolean
  cta: string
}

export const plans: Plan[] = [
  {
    code: "basic",
    name: "Basic",
    price: 150000,
    priceLabel: "150.000",
    description: "Cocok untuk undangan sederhana dengan fitur dasar.",
    features: [
      { name: "1 Template pilihan", included: true },
      { name: "Informasi acara", included: true },
      { name: "Galeri foto (max 4)", included: true },
      { name: "RSVP online", included: true },
      { name: "Countdown timer", included: true },
      { name: "Love story timeline", included: false },
      { name: "Background musik", included: false },
      { name: "Amplop digital", included: false },
      { name: "Custom domain", included: false },
    ],
    popular: false,
    cta: "Pilih Basic",
  },
  {
    code: "premium",
    name: "Premium",
    price: 350000,
    priceLabel: "350.000",
    description: "Pilihan terpopuler dengan fitur lengkap untuk hari spesial Anda.",
    features: [
      { name: "Semua template premium", included: true },
      { name: "Informasi acara", included: true },
      { name: "Galeri foto (max 8)", included: true },
      { name: "RSVP online", included: true },
      { name: "Countdown timer", included: true },
      { name: "Love story timeline", included: true },
      { name: "Background musik", included: true },
      { name: "Amplop digital", included: true },
      { name: "Custom domain", included: false },
    ],
    popular: true,
    cta: "Pilih Premium",
  },
  {
    code: "exclusive",
    name: "Exclusive",
    price: 750000,
    priceLabel: "750.000",
    description: "Pengalaman premium dengan kustomisasi tanpa batas.",
    features: [
      { name: "Semua template + exclusive", included: true },
      { name: "Informasi acara", included: true },
      { name: "Galeri foto (max 12)", included: true },
      { name: "RSVP online + reminder", included: true },
      { name: "Countdown timer", included: true },
      { name: "Love story timeline", included: true },
      { name: "Background musik custom", included: true },
      { name: "Amplop digital multi-bank", included: true },
      { name: "Custom domain", included: true },
    ],
    popular: false,
    cta: "Pilih Exclusive",
  },
]

export async function getPlans() {
  return plans
}

export function getPlanByCode(code?: string | null) {
  if (!code) return undefined
  return plans.find((plan) => plan.code === code)
}
