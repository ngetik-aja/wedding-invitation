import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan aktivitas undangan yang paling relevan.
        </p>
      </div>
      <ChartAreaInteractive />
    </div>
  )
}
