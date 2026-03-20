import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/http"

export type PlanCode = "basic" | "premium" | "exclusive" | "none"

export type PlanLimits = {
  gallery_photos: number
  love_story: boolean
  music: boolean
  gifts: boolean
  custom_domain: boolean
  templates: "1" | "all"
}

type CustomerPlanResponse = {
  plan_code: PlanCode
  limits: PlanLimits
}

const defaultLimits: PlanLimits = {
  gallery_photos: 4,
  love_story: false,
  music: false,
  gifts: false,
  custom_domain: false,
  templates: "1",
}

async function fetchCustomerPlan(customerId: string): Promise<CustomerPlanResponse> {
  const { data } = await apiClient.get<CustomerPlanResponse>(
    `/api/v1/customer/my-plan?customer_id=${customerId}`
  )
  return data
}

export function useCustomerPlan(customerId?: string | null) {
  const query = useQuery({
    queryKey: ["customer-plan", customerId],
    queryFn: () => fetchCustomerPlan(customerId!),
    enabled: Boolean(customerId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  const planCode: PlanCode = query.data?.plan_code ?? "none"
  const limits: PlanLimits = query.data?.limits ?? defaultLimits
  const isPaid = planCode !== "none"

  return {
    planCode,
    limits,
    isLoading: query.isLoading,
    isPaid,
  }
}
