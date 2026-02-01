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

const customers = [
  {
    name: "Daniel Pratama",
    email: "daniel@example.com",
    plan: "Premium",
    status: "Active",
    invitations: 1,
  },
  {
    name: "Raka Nugraha",
    email: "raka@example.com",
    plan: "Basic",
    status: "Trial",
    invitations: 1,
  },
  {
    name: "Gita Larasati",
    email: "gita@example.com",
    plan: "Exclusive",
    status: "Active",
    invitations: 2,
  },
]

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-muted-foreground">Data pelanggan dan status paket.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Aktif</CardTitle>
          <CardDescription>Total pelanggan 312.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Undangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.email}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.plan}</TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{customer.invitations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
