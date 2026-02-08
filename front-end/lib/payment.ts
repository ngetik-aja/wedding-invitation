export type PaymentPayload = {
  customerId: string
  planCode: string
  amount: number
  currency: string
  proofNote?: string
  proofFileName?: string
}

export async function submitPayment(payload: PaymentPayload) {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    status: "pending",
    ...payload,
  }
}
