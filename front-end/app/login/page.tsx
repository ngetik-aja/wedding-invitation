import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Masuk ke Akun</CardTitle>
          <CardDescription>
            Kelola undangan Anda, lihat RSVP, dan atur detail acara.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nama@email.com" autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Kembali ke beranda
            </Link>
            <Link href="/" className="text-primary hover:underline">
              Lupa password?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full">Masuk</Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/register">Daftar</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
