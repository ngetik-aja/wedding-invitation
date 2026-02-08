"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setCustomerSession } from "@/lib/session";
import { getRegisterErrorMessage, useRegisterCustomer } from "@/lib/hooks/use-register-customer";

const registerSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = useMemo(() => searchParams.get("plan"), [searchParams]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useRegisterCustomer();

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Daftar Akun</CardTitle>
          <CardDescription>
            Buat akun terlebih dahulu sebelum melanjutkan ke onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) =>
              registerMutation.mutate(
                {
                  fullName: values.fullName,
                  email: values.email,
                  password: values.password,
                  themeKey: "elegant",
                  content: {},
                },
                {
                  onSuccess: (data) => {
                    setCustomerSession({
                      customerId: data.customer_id,
                      invitationId: data.invitation_id,
                      slug: data.slug,
                      domain: data.domain,
                    });
                    router.push(planParam ? `/onboarding?plan=${planParam}` : "/onboarding");
                  },
                }
              )
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama lengkap</Label>
              <Input id="fullName" {...form.register("fullName")} placeholder="Nama calon pengantin" />
              {form.formState.errors.fullName && (
                <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder="nama@email.com" />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} placeholder="••••••••" />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            {registerMutation.isError && (
              <p className="text-sm text-destructive">
                {getRegisterErrorMessage(registerMutation.error)}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Mendaftarkan..." : "Daftar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Kembali ke beranda
          </Link>
          <Link href="/login" className="text-primary hover:underline">
            Sudah punya akun?
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={(
        <main className="min-h-screen bg-background px-4 py-12">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="h-10 w-64 animate-pulse rounded bg-muted" />
            <div className="h-4 w-80 animate-pulse rounded bg-muted" />
          </div>
        </main>
      )}
    >
      <RegisterPageContent />
    </Suspense>
  );
}

