import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type RegisterCustomerPayload = {
  fullName: string
  email: string
  password: string
  title?: string
  eventDate?: string
  themeKey?: string
  content: Record<string, unknown>
}

export type RegisterCustomerResponse = {
  customer_id: string
  invitation_id: string
}

export function useRegisterCustomer() {
  return useMutation({
    mutationFn: async (payload: RegisterCustomerPayload) => {
      const res = await api.post("/api/v1/customer/register", {
        full_name: payload.fullName,
        email: payload.email,
        password: payload.password,
        title: payload.title,
        event_date: payload.eventDate,
        theme_key: payload.themeKey,
        content: payload.content,
      })
      return res.data as RegisterCustomerResponse
    },
  })
}
