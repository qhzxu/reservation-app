import { getAdminApiClient } from "./admin-api-client"

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminAuthResponse {
  accessToken: string
  userId: number
  userName: string
  email: string
  role: "STORE"
}

export const adminAuthApi = {
  async login(data: AdminLoginRequest): Promise<AdminAuthResponse> {
    const client = getAdminApiClient()
    const res = await client.post("/auth/store/login", data)
    return res.data
  },

  async me(): Promise<AdminAuthResponse> {
    const client = getAdminApiClient()
    const res = await client.get("/store/me")
    return res.data
  },
}
