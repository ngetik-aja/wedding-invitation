import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type PaymentListItem = {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  plan_id: string
  plan_code: string
  plan_name: string
  amount: number
  currency: string
  status: string
  paid_at: string | null
  created_at: string
  updated_at: string
}

export type PaymentSummary = {
  total_revenue: number
  paid_count: number
  pending_count: number
  failed_count: number
  refunded_count: number
}

type PaymentListResponse = {
  items: PaymentListItem[]
  limit: number
  offset: number
  summary: PaymentSummary
}

type PaymentListParams = {
  customerId?: string
  status?: "pending" | "paid" | "failed" | "refunded"
  limit?: number
  offset?: number
}

export function usePayments(params: PaymentListParams = {}) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: async () => {
      const res = await api.get<PaymentListResponse>("/api/v1/admin/payments", {
        params: {
          customer_id: params.customerId,
          status: params.status,
          limit: params.limit,
          offset: params.offset,
        },
      })
      return res.data
    },
  })
}
