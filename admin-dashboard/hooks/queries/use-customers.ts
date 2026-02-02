import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type CustomerListItem = {
  id: string
  full_name: string
  email: string
  domain: string
  status: string
}

export type CustomerListResponse = {
  items: CustomerListItem[]
  limit: number
}

export function useCustomers(limit = 200) {
  return useQuery({
    queryKey: ["customers", limit],
    queryFn: async () => {
      const res = await api.get<CustomerListResponse>("/api/v1/admin/customers", {
        params: { limit },
      })
      return res.data
    },
  })
}
