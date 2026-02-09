import { useMutation } from "@tanstack/react-query"
import { loginCustomer } from "@/lib/customer"
import { getErrorMessage } from "@/lib/http"

export function useLoginCustomer() {
  return useMutation({
    mutationFn: loginCustomer,
    onError: () => undefined,
    throwOnError: false,
  })
}

export function getLoginErrorMessage(error: unknown) {
  return getErrorMessage(error, "Login gagal.")
}
