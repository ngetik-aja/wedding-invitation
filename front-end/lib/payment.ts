import { apiClient } from "@/lib/http"

export type CreatePaymentPayload = {
  customerId: string
  planCode: string
}

export type CreatePaymentResponse = {
  paymentId: string
  status: string
  amount: number
  currency: string
  midtransOrderId: string
  midtransToken: string
  midtransRedirect: string
}

type CreatePaymentResponseRaw = {
  payment_id: string
  status: string
  amount: number
  currency: string
  midtrans_order_id: string
  midtrans_token: string
  midtrans_redirect: string
}

export async function submitPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResponse> {
  const { data } = await apiClient.post<CreatePaymentResponseRaw>("/api/v1/customer/payments", {
    customer_id: payload.customerId,
    plan_code: payload.planCode,
  })

  return {
    paymentId: data.payment_id,
    status: data.status,
    amount: data.amount,
    currency: data.currency,
    midtransOrderId: data.midtrans_order_id,
    midtransToken: data.midtrans_token,
    midtransRedirect: data.midtrans_redirect,
  }
}

export type PaymentProgressPayload = {
  customerId: string
  paymentId?: string
}

export type PaymentProgressResponse = {
  paymentId: string
  status: string
  midtransStatus: string
  paidAt: string | null
  midtransOrderId: string
  midtransRedirect: string
}

type PaymentProgressResponseRaw = {
  payment_id: string
  status: string
  midtrans_status: string
  paid_at: string | null
  midtrans_order_id: string
  midtrans_redirect: string
}

export async function getPaymentProgress(payload: PaymentProgressPayload): Promise<PaymentProgressResponse> {
  const params = new URLSearchParams({
    customer_id: payload.customerId,
  })

  if (payload.paymentId) {
    params.set("payment_id", payload.paymentId)
  }

  const { data } = await apiClient.get<PaymentProgressResponseRaw>(`/api/v1/customer/payments/progress?${params.toString()}`)

  return {
    paymentId: data.payment_id,
    status: data.status,
    midtransStatus: data.midtrans_status,
    paidAt: data.paid_at,
    midtransOrderId: data.midtrans_order_id,
    midtransRedirect: data.midtrans_redirect,
  }
}
