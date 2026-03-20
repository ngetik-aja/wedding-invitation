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

type RawFeature = { label: string; included: boolean }

type PlansApiResponse = {
  items?: Array<{
    code: string
    name: string
    price_amount: number
    currency?: string
    features?: RawFeature[]
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

function formatPriceLabel(amount: number) {
  return amount.toLocaleString("id-ID")
}

function mapPlan(raw: NonNullable<PlansApiResponse["items"]>[number]): Plan {
  const code = (raw.code || "").trim().toLowerCase()
  const meta = planMeta[code] || {
    description: `Paket ${raw.name}`,
    cta: `Pilih ${raw.name}`,
  }

  const features: PlanFeature[] = (raw.features || []).map((f) => ({
    name: f.label,
    included: f.included,
  }))

  return {
    code,
    name: raw.name,
    price: raw.price_amount,
    priceLabel: formatPriceLabel(raw.price_amount),
    description: meta.description,
    cta: meta.cta,
    popular: meta.popular,
    features,
  }
}

export async function getPlans() {
  try {
    const { data } = await apiClient.get<PlansApiResponse>("/api/v1/public/plans")
    return (data.items || []).map(mapPlan)
  } catch {
    return []
  }
}

export function getPlanByCode(items: Plan[], code?: string | null) {
  if (!code) return undefined
  return items.find((plan) => plan.code === code)
}
