import { useMutation } from "@tanstack/react-query"
import { registerCustomer } from "@/lib/customer"
import { getErrorMessage } from "@/lib/http"

export function useRegisterCustomer() {
  return useMutation({
    mutationFn: registerCustomer,
    onError: () => undefined,
    throwOnError: false,
  })
}

export function getRegisterErrorMessage(error: unknown) {
  return getErrorMessage(error, "Registrasi gagal.")
}
