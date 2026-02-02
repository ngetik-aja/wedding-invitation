import axios from "axios"

import { getAccessToken, setAccessToken } from "@/lib/auth"
import { startProgress, stopProgress } from "@/lib/progress"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

const isAuthEndpoint = (url?: string) => {
  if (!url) return false
  return url.includes("/api/v1/admin/auth/login") ||
    url.includes("/api/v1/admin/auth/refresh") ||
    url.includes("/api/v1/admin/auth/logout")
}

async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = api
    .post("/api/v1/admin/auth/refresh")
    .then((res) => {
      const token = res.data?.accessToken
      if (token) {
        setAccessToken(token)
        return token as string
      }
      setAccessToken(null)
      return null
    })
    .catch(() => {
      setAccessToken(null)
      return null
    })
    .finally(() => {
      isRefreshing = false
    })

  return refreshPromise
}

api.interceptors.request.use((config) => {
  startProgress()
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    stopProgress()
    return response
  },
  async (error) => {
    stopProgress()
    const original = error.config
    if (!original || original._retry) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      if (isAuthEndpoint(original.url)) {
        return Promise.reject(error)
      }

      original._retry = true
      const token = await refreshAccessToken()
      if (token) {
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      }
    }

    return Promise.reject(error)
  }
)

export async function loginAdmin(email: string, password: string) {
  const res = await api.post("/api/v1/admin/auth/login", { email, password })
  const token = res.data?.accessToken
  if (token) {
    setAccessToken(token)
  }
  return token
}

export async function logoutAdmin() {
  await api.post("/api/v1/admin/auth/logout")
  setAccessToken(null)
}

export async function ensureAuth() {
  if (getAccessToken()) {
    return true
  }
  const token = await refreshAccessToken()
  return Boolean(token)
}
