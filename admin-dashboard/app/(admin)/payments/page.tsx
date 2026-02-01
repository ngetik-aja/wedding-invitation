import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const payments = [
  {
    id: "PAY-9081",
    customer: "Daniel Pratama",
    plan: "Premium",
    amount: "Rp 350.000",
    status: "Paid",
    date: "2025-01-20",
  },
  {
    id: "PAY-9080",
    customer: "Raka Nugraha",
    plan: "Basic",
    amount: "Rp 150.000",
    status: "Pending",
    date: "2025-01-19",
  },
  {
    id: "PAY-9079",
    customer: "Gita Larasati",
    plan: "Exclusive",
    amount: "Rp 750.000",
    status: "Failed",
    date: "2025-01-18",
  },
]

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-muted-foreground">Pantau transaksi dan status pembayaran.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Januari 2025</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">Rp 24.500.000</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
            <CardDescription>Menunggu konfirmasi</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">12 transaksi</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
            <CardDescription>Perlu follow up</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">3 transaksi</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
          <CardDescription>Update terakhir 24 jam</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.plan}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "Paid"
                          ? "default"
                          : payment.status === "Pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
