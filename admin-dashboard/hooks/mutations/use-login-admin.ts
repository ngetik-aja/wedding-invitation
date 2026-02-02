import { useMutation } from "@tanstack/react-query"

import { loginAdmin } from "@/lib/api"

export type LoginPayload = {
  email: string
  password: string
}

export function useLoginAdmin() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginPayload) => {
      const token = await loginAdmin(email, password)
      return token
    },
    retry: false,
  })
}
