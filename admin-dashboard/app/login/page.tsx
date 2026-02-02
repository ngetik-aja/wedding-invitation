"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginAdmin } from "@/hooks/mutations/use-login-admin"

const loginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
})

type LoginValues = z.infer<typeof loginSchema>

const resolveLoginError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.response?.data?.detail
    if (typeof message === "string" && message.trim()) {
      return message
    }
    if (err.response?.status === 401) {
      return "Email atau password salah."
    }
  }
  return "Login gagal. Coba lagi."
}

export default function LoginPage() {
  const router = useRouter()
  const loginMutation = useLoginAdmin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = (values: LoginValues) => {
    setErrorMessage(null)
    loginMutation.mutate(values, {
      onSuccess: (token) => {
        if (!token) {
          setErrorMessage("Email atau password salah.")
          return
        }
        router.replace("/dashboard")
      },
      onError: (err) => {
        setErrorMessage(resolveLoginError(err))
      },
    })
  }
  
  console.log(loginMutation.isPending)

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Masuk untuk mengelola undangan, pembayaran, dan data customer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@wedding-invitation.id"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              {errorMessage && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {errorMessage}
                </div>
              )}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox />
                  Remember me
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Lupa password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                Masuk
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Belum punya akun admin?{" "}
                <Link href="#" className="text-primary hover:underline">
                  Hubungi support
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
