import axios, { type AxiosInstance } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8383"

let adminApiClient: AxiosInstance | null = null

export function getAdminApiClient(): AxiosInstance {
  if (adminApiClient) return adminApiClient

  adminApiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // 요청 인터셉터: adminToken 자동 추가
  adminApiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return adminApiClient
}
