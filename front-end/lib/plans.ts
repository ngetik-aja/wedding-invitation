import { apiClient } from "@/lib/http"

export type PlanFeature = {
  name: string
  included: boolean
}

export type Plan = {
  code: string
  name: string
  price: number
  priceLabel: string
  description: string
  features: PlanFeature[]
  popular?: boolean
  cta: string
}

type PlansApiResponse = {
  items?: Array<{
    code: string
    name: string
    price_amount: number
    currency?: string
    features?: Record<string, unknown>
    limits?: Record<string, unknown>
  }>
}

const planMeta: Record<string, { description: string; cta: string; popular?: boolean }> = {
  basic: {
    description: "Mulai cepat dengan fitur penting untuk undangan yang tetap elegan.",
    cta: "Pilih Basic",
  },
  premium: {
    description: "Paket paling favorit untuk pengalaman undangan yang lebih lengkap dan berkesan.",
    cta: "Pilih Premium",
    popular: true,
  },
  exclusive: {
    description: "Solusi paling lengkap untuk undangan premium dengan kebebasan kustomisasi maksimal.",
    cta: "Pilih Exclusive",
  },
}

export const plans: Plan[] = [
  {
    code: "basic",
    name: "Basic",
    price: 150000,
    priceLabel: "150.000",
    description: "Mulai cepat dengan fitur penting untuk undangan yang tetap elegan.",
    features: [
      { name: "RSVP online untuk konfirmasi tamu", included: true },
      { name: "Countdown acara otomatis", included: true },
      { name: "Template undangan: 1 pilihan", included: true },
      { name: "Amplop digital (hadiah cashless)", included: false },
      { name: "Background musik undangan", included: false },
      { name: "Timeline cerita cinta (Love Story)", included: false },
      { name: "Galeri foto hingga 4 foto", included: true },
      { name: "Custom domain personal", included: false },
    ],
    popular: false,
    cta: "Pilih Basic",
  },
  {
    code: "premium",
    name: "Premium",
    price: 350000,
    priceLabel: "350.000",
    description: "Paket paling favorit untuk pengalaman undangan yang lebih lengkap dan berkesan.",
    features: [
      { name: "RSVP online untuk konfirmasi tamu", included: true },
      { name: "Countdown acara otomatis", included: true },
      { name: "Template undangan: semua template", included: true },
      { name: "Amplop digital (hadiah cashless)", included: true },
      { name: "Background musik undangan", included: true },
      { name: "Timeline cerita cinta (Love Story)", included: true },
      { name: "Galeri foto hingga 8 foto", included: true },
      { name: "Custom domain personal", included: false },
    ],
    popular: true,
    cta: "Pilih Premium",
  },
  {
    code: "exclusive",
    name: "Exclusive",
    price: 750000,
    priceLabel: "750.000",
    description: "Solusi paling lengkap untuk undangan premium dengan kebebasan kustomisasi maksimal.",
    features: [
      { name: "RSVP online untuk konfirmasi tamu", included: true },
      { name: "Countdown acara otomatis", included: true },
      { name: "Reminder tamu", included: true },
      { name: "Template undangan: semua template", included: true },
      { name: "Amplop digital (hadiah cashless)", included: true },
      { name: "Background musik undangan", included: true },
      { name: "Timeline cerita cinta (Love Story)", included: true },
      { name: "Galeri foto hingga 12 foto", included: true },
      { name: "Custom domain personal", included: true },
    ],
    popular: false,
    cta: "Pilih Exclusive",
  },
]

const featureOrder = [
  "rsvp",
  "countdown",
  "reminder",
  "templates",
  "gifts",
  "music",
  "love_story",
  "gallery_photos",
  "custom_domain",
]

function formatPriceLabel(amount: number) {
  return amount.toLocaleString("id-ID")
}

function normalizeText(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function labelForFeature(key: string, value: unknown) {
  switch (key) {
    case "rsvp":
      return "RSVP online untuk konfirmasi tamu"
    case "countdown":
      return "Countdown acara otomatis"
    case "reminder":
      return "Reminder tamu"
    case "templates":
      if (typeof value === "number") return `Template undangan: ${value} pilihan`
      if (String(value).toLowerCase() === "all") return "Template undangan: semua template"
      return `Template undangan: ${String(value)}`
    case "gifts":
      return "Amplop digital (hadiah cashless)"
    case "music":
      return "Background musik undangan"
    case "love_story":
      return "Timeline cerita cinta (Love Story)"
    case "gallery_photos":
      return `Galeri foto hingga ${String(value)} foto`
    case "custom_domain":
      return "Custom domain personal"
    default:
      if (typeof value === "boolean") return normalizeText(key)
      return `${normalizeText(key)}: ${String(value)}`
  }
}

function toFeatureList(features?: Record<string, unknown>, limits?: Record<string, unknown>): PlanFeature[] {
  const merged: Record<string, unknown> = {
    ...(features || {}),
    ...(limits || {}),
  }

  const orderedKeys = [
    ...featureOrder.filter((key) => Object.prototype.hasOwnProperty.call(merged, key)),
    ...Object.keys(merged).filter((key) => !featureOrder.includes(key)),
  ]

  return orderedKeys.map((key) => {
    const value = merged[key]
    const included = typeof value === "boolean" ? value : true
    return {
      name: labelForFeature(key, value),
      included,
    }
  })
}

function mapPlan(raw: NonNullable<PlansApiResponse["items"]>[number]): Plan {
  const code = (raw.code || "").trim().toLowerCase()
  const meta = planMeta[code] || {
    description: `Paket ${raw.name}`,
    cta: `Pilih ${raw.name}`,
  }

  return {
    code,
    name: raw.name,
    price: raw.price_amount,
    priceLabel: formatPriceLabel(raw.price_amount),
    description: meta.description,
    cta: meta.cta,
    popular: meta.popular,
    features: toFeatureList(raw.features, raw.limits),
  }
}

export async function getPlans() {
  try {
    const { data } = await apiClient.get<PlansApiResponse>("/api/v1/customer/plans")
    const items = (data.items || []).map(mapPlan)
    if (items.length > 0) return items
    return plans
  } catch {
    return plans
  }
}

export function getPlanByCode(items: Plan[], code?: string | null) {
  if (!code) return undefined
  return items.find((plan) => plan.code === code)
}
