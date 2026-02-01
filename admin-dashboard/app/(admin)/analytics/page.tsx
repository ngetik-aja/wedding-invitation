import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground">Insight performa undangan dan traffic.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>Grafik dan metrik akan tampil di sini.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Hubungkan data tracking untuk melihat performa kunjungan dan konversi.
        </CardContent>
      </Card>
    </div>
  )
}
