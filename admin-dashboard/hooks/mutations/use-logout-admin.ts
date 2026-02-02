import { useMutation } from "@tanstack/react-query"

import { logoutAdmin } from "@/lib/api"

export function useLogoutAdmin() {
  return useMutation({
    mutationFn: async () => {
      await logoutAdmin()
      return true
    },
  })
}
