import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type InvitationDetail = {
  id: string
  customerId: string
  slug: string
  title?: string
  searchName?: string
  eventDate?: string | null
  themeKey?: string
  isPublished: boolean
  content: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export function useInvitation(invitationId: string) {
  return useQuery({
    queryKey: ["invitation", invitationId],
    queryFn: async () => {
      const res = await api.get<InvitationDetail>(
        `/api/v1/admin/invitations/${invitationId}`
      )
      return res.data
    },
    enabled: Boolean(invitationId),
  })
}
