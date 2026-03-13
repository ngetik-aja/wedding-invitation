"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePayments } from "@/hooks/queries/use-payments"

const formatDateTime = (value?: string | null) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const formatCurrency = (amount: number, currency = "IDR") => {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString("id-ID")}`
  }
}

function toStatusLabel(status: string) {
  return status
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-teal-600 text-white"
    case "failed":
      return "bg-red-600 text-white"
    case "pending":
      return "bg-amber-500 text-amber-950"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function PaymentTableSkeleton() {
  return (
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
        {Array.from({ length: 6 }).map((_, idx) => (
          <TableRow key={idx}>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-36" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-32" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function PaymentsPage() {
  const paymentsQuery = usePayments({ limit: 100 })
  const payments = paymentsQuery.data?.items || []
  const summary = paymentsQuery.data?.summary

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-muted-foreground">Pantau transaksi dan status pembayaran.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Pembayaran sukses</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatCurrency(summary?.total_revenue || 0, "IDR")}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Paid</CardTitle>
            <CardDescription>Transaksi lunas</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary?.paid_count || 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
            <CardDescription>Menunggu pembayaran</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary?.pending_count || 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
            <CardDescription>Perlu follow up</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{summary?.failed_count || 0}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
          <CardDescription>Diambil dari data payment backend.</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentsQuery.isLoading ? (
            <PaymentTableSkeleton />
          ) : (
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
                {payments.length ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.customer_name}</TableCell>
                      <TableCell>{payment.plan_name}</TableCell>
                      <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(payment.status)}>
                          {toStatusLabel(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatDateTime(payment.created_at)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      Belum ada data pembayaran.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
