import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type AdminMe = {
  id: string
  email: string
  created_at: string
}

export function useAdminMe(enabled = true) {
  return useQuery({
    queryKey: ["admin-me"],
    queryFn: async () => {
      const res = await api.get<AdminMe>("/api/v1/admin/me")
      return res.data
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
