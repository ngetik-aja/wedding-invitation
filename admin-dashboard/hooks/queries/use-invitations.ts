import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type InvitationListItem = {
  id: string
  customerId: string
  customerName?: string
  customerDomain?: string
  slug: string
  title: string
  searchName: string
  eventDate?: string | null
  themeKey: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

type ListResponse = {
  items: InvitationListItem[]
  limit: number
  offset: number
}

type ListParams = {
  customerId?: string
  q?: string
  status?: "published" | "draft"
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}

export function useInvitations(params: ListParams = {}) {
  return useQuery({
    queryKey: ["invitations", params],
    queryFn: async () => {
      const res = await api.get<ListResponse>("/api/v1/admin/invitations", {
        params: {
          customer_id: params.customerId,
          q: params.q,
          status: params.status,
          date_from: params.dateFrom,
          date_to: params.dateTo,
          limit: params.limit,
          offset: params.offset,
        },
      })
      return res.data
    },
  })
}
