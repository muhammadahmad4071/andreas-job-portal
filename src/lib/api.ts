// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type ApiError = {
  status?: number
  body?: any
  message?: string
}

// Helper to read the `token` from cookies (client-side only)
// Helper to read the token from cookies (client-side only)
function getTokenFromCookies(): string | null {
  if (typeof document === "undefined") return null

  // ✅ Prefer admin_token if present
  const adminMatch = document.cookie.match(/(?:^|; )admin_token=([^;]*)/)
  if (adminMatch) {
    return decodeURIComponent(adminMatch[1])
  }

  // ✅ Fallback to employer_token
  const employerMatch = document.cookie.match(/(?:^|; )employer_token=([^;]*)/)
  if (employerMatch) {
    return decodeURIComponent(employerMatch[1])
  }

  // Optional: legacy token fallback (if you still ever set it)
  const legacyMatch = document.cookie.match(/(?:^|; )token=([^;]*)/)
  if (legacyMatch) {
    return decodeURIComponent(legacyMatch[1])
  }

  return null
}


// Helper to clear all auth on the client
function clearAuthClientSide() {
  if (typeof window === "undefined") return

  try {
    document.cookie = "admin_token=; Max-Age=0; Path=/"
    document.cookie = "employer_token=; Max-Age=0; Path=/"
    document.cookie = "token=; Max-Age=0; Path=/" // legacy
  } catch {
    // ignore
  }

  try {
    window.localStorage.removeItem("token")
  } catch {
    // ignore
  }
}


export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${path}`

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  // Attach token if present (browser only)
  if (typeof window !== "undefined") {
    const cookieToken = getTokenFromCookies()
    const lsToken =
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null

    const token = cookieToken || lsToken

    if (token) {
      ;(headers as any).Authorization = `Bearer ${token}`
    }
  }

  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
  })

  // No content
  if (res.status === 204) {
    if (!res.ok) {
      const error: ApiError = {
        status: res.status,
        message: "Request failed with status 204",
      }
      throw error
    }
    return null
  }

  let data: any = null
  try {
    data = await res.json()
  } catch {
    // ignore JSON parse errors
  }

  // 🔐 Global 401 handling – token invalid/expired/etc.
  if (res.status === 401) {
    // Clear auth on client
    clearAuthClientSide()

    // Hard redirect to login on client
    if (typeof window !== "undefined") {
      // Use location.href so middleware runs fresh on next request
      window.location.href = "/employer/login"
    }

    const error: ApiError = {
      status: res.status,
      body: data,
      message:
        (data && typeof data.message === "string" && data.message) ||
        "You have been logged out. Please log in again.",
    }
    throw error
  }

  if (!res.ok) {
    const error: ApiError = {
      status: res.status,
      body: data,
      message:
        (data && typeof data.message === "string" && data.message) ||
        `Request failed with status ${res.status}`,
    }
    throw error
  }

  return data
}
