"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const baseYear = new Date().getFullYear()
const yearOptions = [baseYear - 1, baseYear, baseYear + 1]
const monthLabels = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

const chartConfig = {
  created: {
    label: "Undangan dibuat",
    color: "var(--primary)",
  },
  published: {
    label: "Undangan terpublikasi",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

const formatMonthTick = (value: string) => value.slice(0, 3)

export function ChartAreaInteractive() {
  const [selectedYear, setSelectedYear] = React.useState(String(baseYear))

  const chartData = React.useMemo(
    () =>
      monthLabels.map((month) => ({
        month,
        created: 0,
        published: 0,
      })),
    [selectedYear]
  )

  const formatTooltipLabel = React.useCallback(
    (label: string) => `${label} ${selectedYear}`,
    [selectedYear]
  )

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Undangan dibuat vs terpublikasi</CardTitle>
          <CardDescription>Ringkasan Januari - Desember {selectedYear}.</CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[140px]" aria-label="Pilih tahun">
            <SelectValue placeholder="Pilih tahun" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-created)" stopOpacity={0.9} />
                <stop offset="95%" stopColor="var(--color-created)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPublished" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-published)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-published)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={formatMonthTick}
              padding={{ left: 24, right: 24 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={formatTooltipLabel} indicator="dot" />}
            />
            <Area
              dataKey="created"
              type="monotone"
              fill="url(#fillCreated)"
              stroke="var(--color-created)"
              stackId="a"
            />
            <Area
              dataKey="published"
              type="monotone"
              fill="url(#fillPublished)"
              stroke="var(--color-published)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
