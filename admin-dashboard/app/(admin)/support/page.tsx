import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Support</h1>
        <p className="text-muted-foreground">Kontak tim support dan dokumentasi.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Butuh bantuan?</CardTitle>
          <CardDescription>Hubungi tim untuk bantuan teknis.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Email: support@wedding-invitation.id
        </CardContent>
      </Card>
    </div>
  )
}
