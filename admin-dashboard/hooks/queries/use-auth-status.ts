import { useQuery } from "@tanstack/react-query"

import { ensureAuth } from "@/lib/api"

export function useAuthStatus() {
  return useQuery({
    queryKey: ["auth-status"],
    queryFn: ensureAuth,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}
