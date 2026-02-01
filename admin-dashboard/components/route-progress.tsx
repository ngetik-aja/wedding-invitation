"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { resetProgress, startProgress, stopProgress } from "@/lib/progress"

export function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    startProgress()
    const timer = setTimeout(() => {
      stopProgress()
    }, 150)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  useEffect(() => {
    return () => resetProgress()
  }, [])

  return null
}
