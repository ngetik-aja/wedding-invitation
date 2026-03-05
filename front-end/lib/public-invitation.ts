import { apiClient } from "@/lib/http"

export type PublicWish = {
  id: string
  guestName: string
  message: string
  createdAt: string
}

type PublicWishRaw = {
  id: string
  guest_name: string
  message: string
  created_at: string
}

type PublicWishListResponse = {
  items: PublicWishRaw[]
}

export type SubmitRsvpPayload = {
  guestName: string
  attendance: string
  guestsCount: number
  message?: string
}

export async function submitPublicRsvp(owner: string, slug: string, payload: SubmitRsvpPayload) {
  const { data } = await apiClient.post(`/api/v1/public/${encodeURIComponent(owner)}/invitations/${encodeURIComponent(slug)}/rsvps`, {
    guest_name: payload.guestName,
    attendance: payload.attendance,
    guests_count: payload.guestsCount,
    message: payload.message || "",
  })
  return data
}

export async function listPublicWishes(owner: string, slug: string, limit = 30): Promise<PublicWish[]> {
  const { data } = await apiClient.get<PublicWishListResponse>(`/api/v1/public/${encodeURIComponent(owner)}/invitations/${encodeURIComponent(slug)}/wishes?limit=${limit}`)
  return (data.items || []).map((item) => ({
    id: item.id,
    guestName: item.guest_name,
    message: item.message,
    createdAt: item.created_at,
  }))
}
