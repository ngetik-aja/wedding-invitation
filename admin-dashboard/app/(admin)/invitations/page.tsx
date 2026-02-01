"use client"

import Link from "next/link"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useInvitations } from "@/hooks/queries/use-invitations"

export default function InvitationsPage() {
  const [query, setQuery] = useState("")
  const { data, isLoading } = useInvitations({ q: query })

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Invitations</h1>
          <p className="text-muted-foreground">
            Kelola undangan customer dan status publishing.
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
              placeholder="Cari pasangan atau ID..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Memuat data undangan...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items?.length ? (
                  data.items.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.id}</TableCell>
                      <TableCell>{inv.slug}</TableCell>
                      <TableCell>{inv.customerId}</TableCell>
                      <TableCell>{inv.eventDate ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant={inv.isPublished ? "default" : "secondary"}>
                          {inv.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/invitations/${inv.id}`}>Edit</Link>
                        </Button>
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
