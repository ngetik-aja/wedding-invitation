import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type InvitationPayload = {
  customerId: string
  slug: string
  title?: string
  searchName?: string
  eventDate?: string
  themeKey?: string
  isPublished?: boolean
  content: Record<string, unknown>
}

export function useCreateInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: InvitationPayload) => {
      const res = await api.post("/api/v1/admin/invitations", {
        customer_id: payload.customerId,
        slug: payload.slug,
        title: payload.title,
        search_name: payload.searchName,
        event_date: payload.eventDate,
        theme_key: payload.themeKey,
        is_published: payload.isPublished,
        content: payload.content,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] })
    },
  })
}
