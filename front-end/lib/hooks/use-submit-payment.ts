import { useMutation } from "@tanstack/react-query"
import { submitPayment, type PaymentPayload } from "@/lib/payment"
import { getErrorMessage } from "@/lib/http"

export function useSubmitPayment() {
  return useMutation({
    mutationFn: (payload: PaymentPayload) => submitPayment(payload),
    onError: () => undefined,
    throwOnError: false,
  })
}

export function getPaymentErrorMessage(error: unknown) {
  return getErrorMessage(error, "Pembayaran gagal.")
}
