"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setCustomerSession } from "@/lib/session";
import { getLoginErrorMessage, useLoginCustomer } from "@/lib/hooks/use-login-customer";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginCustomer();

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Masuk ke Akun</CardTitle>
          <CardDescription>
            Kelola undangan Anda, lihat RSVP, dan atur detail acara.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) =>
              loginMutation.mutate(
                {
                  email: values.email,
                  password: values.password,
                },
                {
                  onSuccess: (data) => {
                    setCustomerSession({
                      customerId: data.customer_id,
                      invitationId: data.invitation_id,
                      slug: data.slug,
                      domain: data.domain,
                    });
                    router.push("/customize");
                  },
                }
              )
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder="nama@email.com" autoComplete="email" />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} placeholder="••••••••" autoComplete="current-password" />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            {loginMutation.isError && (
              <p className="text-sm text-destructive">
                {getLoginErrorMessage(loginMutation.error)}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Kembali ke beranda
              </Link>
              <Link href="/" className="text-primary hover:underline">
                Lupa password?
              </Link>
            </div>

            <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Masuk..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Belum punya akun?</span>
          <Link href="/register" className="text-primary hover:underline">
            Daftar
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
