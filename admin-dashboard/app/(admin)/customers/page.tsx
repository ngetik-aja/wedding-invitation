"use client"

import { useMemo } from "react"

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
import { useCustomers } from "@/hooks/queries/use-customers"
import { usePayments } from "@/hooks/queries/use-payments"

function formatCurrency(amount: number, currency = "IDR") {
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

function CustomerTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Paket</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead className="text-right">Nominal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <TableRow key={idx}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-44" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-24" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function CustomersPage() {
  const customersQuery = useCustomers(500)
  const paymentsQuery = usePayments({ limit: 500 })

  const latestPaymentByCustomer = useMemo(() => {
    const map = new Map<string, { planName: string; amount: number; currency: string; status: string }>()
    for (const item of paymentsQuery.data?.items || []) {
      if (!map.has(item.customer_id)) {
        map.set(item.customer_id, {
          planName: item.plan_name,
          amount: item.amount,
          currency: item.currency,
          status: item.status,
        })
      }
    }
    return map
  }, [paymentsQuery.data?.items])

  const isLoading = customersQuery.isLoading || paymentsQuery.isLoading
  const customers = customersQuery.data?.items || []

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-muted-foreground">Data pelanggan, paket, dan status pembayaran terbaru.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Aktif</CardTitle>
          <CardDescription>Total pelanggan {customers.length}.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CustomerTableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length ? customers.map((customer) => {
                  const payment = latestPaymentByCustomer.get(customer.id)
                  const customerStatus = customer.status.toLowerCase()
                  const paymentStatus = (payment?.status || "").toLowerCase()

                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.full_name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{payment?.planName || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(customerStatus)}>
                          {toStatusLabel(customerStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {paymentStatus ? (
                          <Badge className={getStatusBadgeClass(paymentStatus)}>
                            {toStatusLabel(paymentStatus)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">-</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment ? formatCurrency(payment.amount, payment.currency) : "-"}
                      </TableCell>
                    </TableRow>
                  )
                }) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      Belum ada data customer.
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
