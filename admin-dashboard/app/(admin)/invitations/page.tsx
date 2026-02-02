"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useInvitations } from "@/hooks/queries/use-invitations"
import { useCustomers } from "@/hooks/queries/use-customers"
import { useDeleteInvitation } from "@/hooks/mutations/use-delete-invitation"

const formatEventDate = (value?: string | null) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const parts = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).formatToParts(date)

  const byType = parts.reduce<Record<string, string>>((acc, part) => {
    acc[part.type] = part.value
    return acc
  }, {})

  if (!byType.weekday || !byType.day || !byType.month || !byType.year) return value

  return `${byType.weekday}, ${byType.day} ${byType.month} ${byType.year}`
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Pelanggan</TableHead>
          <TableHead>Nama Pasangan</TableHead>
          <TableHead>Tanggal Acara</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-36" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-44" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function UndanganPage() {
  const [query, setQuery] = useState("")
  const { data, isLoading } = useInvitations({ q: query })
  const { data: customersData } = useCustomers(500)
  const { mutate: deleteInvitation } = useDeleteInvitation()

  const customerMap = useMemo(() => {
    const map = new Map<string, { name: string; domain: string }>()
    customersData?.items?.forEach((item) => {
      map.set(item.id, { name: item.full_name, domain: item.domain })
    })
    return map
  }, [customersData])

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Undangan</h1>
          <p className="text-muted-foreground">
            Kelola undangan pelanggan dan status publikasi.
          </p>
        </div>
        <Button asChild>
          <Link href="/invitations/new">Buat Undangan</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Daftar Undangan</CardTitle>
            <CardDescription>Terakhir diperbarui hari ini.</CardDescription>
          </div>
          <div className="flex flex-1 items-center gap-2 md:max-w-sm">
            <Input
              placeholder="Cari nama pasangan atau pelanggan..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pelanggan</TableHead>
                  <TableHead>Nama Pasangan</TableHead>
                  <TableHead>Tanggal Acara</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items?.length ? (
                  data.items.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">
                        {customerMap.get(inv.customerId)?.name ?? "-"}
                      </TableCell>
                      <TableCell>{inv.title || inv.searchName || "-"}</TableCell>
                      <TableCell>{formatEventDate(inv.eventDate)}</TableCell>
                      <TableCell>
                        <Badge variant={inv.isPublished ? "default" : "secondary"}>
                          {inv.isPublished ? "Terpublikasi" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{customerMap.get(inv.customerId)?.domain ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/invitations/${inv.id}`}>Ubah</Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (!confirm("Yakin hapus undangan ini?")) return
                              deleteInvitation(inv.id)
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      Belum ada data undangan.
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
