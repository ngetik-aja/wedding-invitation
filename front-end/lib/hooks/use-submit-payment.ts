import { useMutation } from "@tanstack/react-query"
import { getPaymentProgress, submitPayment, type CreatePaymentPayload, type PaymentProgressPayload } from "@/lib/payment"
import { getErrorMessage } from "@/lib/http"

export function useSubmitPayment() {
  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) => submitPayment(payload),
    onError: () => undefined,
    throwOnError: false,
  })
}

export function useCheckPaymentProgress() {
  return useMutation({
    mutationFn: (payload: PaymentProgressPayload) => getPaymentProgress(payload),
    onError: () => undefined,
    throwOnError: false,
  })
}

export function getPaymentErrorMessage(error: unknown) {
  return getErrorMessage(error, "Pembayaran gagal.")
}
