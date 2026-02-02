"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStatus } from "@/hooks/queries/use-auth-status"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: isAuthed, isLoading, isError } = useAuthStatus()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthed || isError) {
      router.replace("/login")
    }
  }, [isAuthed, isError, isLoading, router])

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 lg:px-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-[320px] w-full" />
      </div>
    )
  }

  if (!isAuthed || isError) {
    return null
  }

  return <>{children}</>
}
