import axios from "axios"
import { clearCustomerSession, getCustomerSession, updateCustomerSessionToken } from "@/lib/session"

const rawBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim()
export const apiBaseUrl = rawBaseUrl.replace(/\/$/, "")

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const session = getCustomerSession()
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean }
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true
    const session = getCustomerSession()

    if (!session?.refreshToken) {
      clearCustomerSession()
      if (typeof window !== "undefined") window.location.href = "/login"
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post<{ token: string }>(
        `${apiBaseUrl}/api/v1/customer/refresh`,
        { refresh_token: session.refreshToken },
        { headers: { "Content-Type": "application/json" } }
      )
      updateCustomerSessionToken(data.token)
      original.headers.Authorization = `Bearer ${data.token}`
      return apiClient(original)
    } catch {
      clearCustomerSession()
      if (typeof window !== "undefined") window.location.href = "/login"
      return Promise.reject(error)
    }
  }
)

export function getErrorMessage(error: unknown, fallback = "Request failed") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined
    return data?.error || data?.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
