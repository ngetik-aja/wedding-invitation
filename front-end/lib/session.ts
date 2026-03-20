export type CustomerSession = {
  token: string
  refreshToken: string
  customerId: string
  invitationId: string
  slug: string
  domain: string
}

const SESSION_KEY = "wedding-invitation-session"

export function setCustomerSession(session: CustomerSession) {
  if (typeof window === "undefined") return
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getCustomerSession(): CustomerSession | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CustomerSession
  } catch {
    return null
  }
}

export function clearCustomerSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
}

export function updateCustomerSessionToken(token: string) {
  const session = getCustomerSession()
  if (!session) return
  setCustomerSession({ ...session, token })
}
