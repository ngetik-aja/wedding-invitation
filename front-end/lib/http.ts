import axios from "axios"

const rawBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim()
export const apiBaseUrl = rawBaseUrl.replace(/\/$/, "")

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

export function getErrorMessage(error: unknown, fallback = "Request failed") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined
    return data?.error || data?.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
