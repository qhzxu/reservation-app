// lib/api/service-api.ts
import { getApiClient } from "@/lib/api-client"

export interface Service {
  id: string           // productId
  name: string
  description: string
  price: number
  available: boolean   // status가 ACTIVE면 true
}

export const serviceApi = {
  async getServices(): Promise<Service[]> {
    const client = getApiClient()
    const response = await client.get("/product")

    // 서버 Product 엔티티를 Service 타입으로 변환
    return response.data.map((p: any) => ({
      id: String(p.productId),
      name: p.name,
      description: p.description,
      price: p.price,
      available: p.status === "ACTIVE",
    }))
  },

  async getService(id: string): Promise<Service | null> {
    const client = getApiClient()
    const response = await client.get(`/product/${id}`)
    const p = response.data
    if (!p) return null

    return {
      id: String(p.productId),
      name: p.name,
      description: p.description,
      price: p.price,
      available: p.status === "ACTIVE",
    }
  },
}
