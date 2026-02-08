import { apiClient } from "@/lib/http"

export type InvitationUpdatePayload = {
  invitationId: string
  customerId: string
  title?: string
  eventDate?: string
  themeKey?: string
  isPublished?: boolean
  content: Record<string, unknown>
}

export async function updateInvitation(payload: InvitationUpdatePayload) {
  const { data } = await apiClient.patch(`/api/v1/customer/invitations/${payload.invitationId}`, {
    customer_id: payload.customerId,
    title: payload.title || "",
    event_date: payload.eventDate || "",
    theme_key: payload.themeKey || "",
    is_published: payload.isPublished,
    content: payload.content,
  })
  return data
}
