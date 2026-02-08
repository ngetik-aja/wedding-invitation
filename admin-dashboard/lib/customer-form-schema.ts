import { z } from "zod"

export const customerFormSchema = z.object({
  selectedCustomerId: z
    .string()
    .min(1, "Pilih pelanggan terlebih dahulu."),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
