import { z } from "zod"

export const customerFormSchema = z
  .object({
    mode: z.enum(["new", "existing"]),
    fullName: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    selectedCustomerId: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.mode === "new") {
      if (!values.fullName) {
        ctx.addIssue({
          path: ["fullName"],
          code: z.ZodIssueCode.custom,
          message: "Nama lengkap wajib diisi.",
        })
      }
      if (!values.email) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Email wajib diisi.",
        })
      } else if (!z.string().email().safeParse(values.email).success) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "Email tidak valid.",
        })
      }
      if (!values.password) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password wajib diisi.",
        })
      }
    }

    if (values.mode === "existing" && !values.selectedCustomerId) {
      ctx.addIssue({
        path: ["selectedCustomerId"],
        code: z.ZodIssueCode.custom,
        message: "Pilih pelanggan terlebih dahulu.",
      })
    }
  })

export type CustomerFormValues = z.infer<typeof customerFormSchema>
