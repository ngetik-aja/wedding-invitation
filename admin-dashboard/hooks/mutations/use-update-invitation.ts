import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type { InvitationPayload } from "@/hooks/mutations/use-create-invitation"

export function useUpdateInvitation(invitationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: InvitationPayload) => {
      const res = await api.patch(`/api/v1/admin/invitations/${invitationId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["invitation", invitationId] })
    },
  })
}
