import { apiClient } from "@/lib/http"

export type RegisterPayload = {
  fullName: string
  email: string
  password: string
  slug?: string
  title?: string
  eventDate?: string
  themeKey?: string
  content?: Record<string, unknown>
}

export type RegisterResponse = {
  customer_id: string
  invitation_id: string
  slug: string
  domain: string
}

export async function registerCustomer(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>("/api/v1/customer/register", {
    full_name: payload.fullName,
    email: payload.email,
    password: payload.password,
    slug: payload.slug || "",
    title: payload.title || "",
    event_date: payload.eventDate || "",
    theme_key: payload.themeKey || "",
    content: payload.content || {},
  })
  return data
}
