"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { ensureAuth } from "@/lib/api"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    ensureAuth()
      .then((ok) => {
        if (!mounted) return
        if (!ok) {
          router.replace("/login")
          return
        }
        setReady(true)
      })
      .catch(() => {
        if (!mounted) return
        router.replace("/login")
      })

    return () => {
      mounted = false
    }
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Loading dashboard...
      </div>
    )
  }

  return <>{children}</>
}
