import { getApiClient } from "@/lib/api/api-client"
import {useAuthStore} from "@/lib/stores/auth-store"

interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest {
  email: string
  password: string
  name: string
  phoneNumber: string
}

interface AuthResponse {
  accessToken: string
  userId: number
  userName: string
  email: string
  role: "USER" | "STORE"
}

export const authApi = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const client = getApiClient()
    const response = await client.post("/auth/user/login", data)
    return response.data
  },

  async signup(data: SignupRequest): Promise<String> {
    const client = getApiClient()
    const response = await client.post("/auth/user/signup", data)
    return response.data
  },

  async me() {
    const client = getApiClient()
    const response = await client.get("/user/me")
    return response.data
  },
  
  getToken(): string | null {
    return useAuthStore.getState().accessToken
  },

 getUserId(): number | null {
  const id = useAuthStore.getState().user?.userId;
  return id ? Number(id) : null;
}


  

}
