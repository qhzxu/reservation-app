// lib/api/api-client.ts
import axios, { type AxiosInstance, type AxiosError } from "axios"
import { useAuthStore } from "@/lib/stores/auth-store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8383"

let apiClient: AxiosInstance | null = null

export function getApiClient(): AxiosInstance {
  if (apiClient) return apiClient

  apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  })

  // 요청 인터셉터: 사용자 토큰
  apiClient.interceptors.request.use(config => {
    const token = useAuthStore.getState().accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  // 응답 인터셉터: 401 → /login
  apiClient.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const originalRequest = error.config as any

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
          const { accessToken } = response.data
          useAuthStore.getState().setAccessToken(accessToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient!(originalRequest)
        } catch {
          useAuthStore.getState().clearAuth()
          window.location.href = "/login"
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    }
  )

  return apiClient
}
