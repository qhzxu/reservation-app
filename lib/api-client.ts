import axios, { type AxiosInstance, type AxiosError } from "axios"
import { useAuthStore } from "@/lib/stores/auth-store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8383"

let apiClient: AxiosInstance | null = null

export function getApiClient(): AxiosInstance {
  if (apiClient) return apiClient

  apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // 요청 인터셉터: Authorization 헤더 추가
  apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // 응답 인터셉터: 401 처리 및 토큰 갱신
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // 토큰 갱신 시도
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })

          const { accessToken } = response.data
          useAuthStore.getState().setAccessToken(accessToken)

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient!(originalRequest)
        } catch (refreshError) {
          // 갱신 실패 시 로그아웃
          useAuthStore.getState().clearAuth()
          window.location.href = "/login"
          return Promise.reject(refreshError)
        }
      }

      if (error.response?.status === 403) {
        console.error("권한 없음")
      }

      if (error.response?.status === 409) {
        console.error("충돌 발생")
      }

      return Promise.reject(error)
    },
  )

  return apiClient
}
