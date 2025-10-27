// lib/api/admin-api-client.ts
import axios, { type AxiosInstance } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8383"

// 여기에 고정 JWT
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIxLCJlbWFpbCI6InN0b3JlMDJAZXhhbXBsZS5jb20iLCJuYW1lIjoi7YWM7Iqk7Yq4Iiwicm9sZSI6IlNUT1JFIiwiaWF0IjoxNzYxNTg1Mzk0LCJleHAiOjE4NDc5ODUzOTR9.Gh5av_LtKNoEvVycm6olxYKjBKlLHCx8epzmtkTPnKU"

let adminApiClient: AxiosInstance | null = null

export function getAdminApiClient(): AxiosInstance {
  if (adminApiClient) return adminApiClient

  adminApiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ADMIN_TOKEN}`,
    },
  })

  return adminApiClient
}
