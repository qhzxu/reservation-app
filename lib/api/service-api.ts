import { getApiClient } from "@/lib/api-client"

export interface Service {
  id: string           // productId
  storeId: number       // 가게 ID
  storeName?: string    // 가게 이름
  name: string
  description: string
  category?: string
  price: number
  status: string
  available: boolean    // status가 ACTIVE면 true
  createdAt?: string
  updatedAt?: string
}

export const serviceApi = {
  // 전체 서비스 목록 조회
  async getServices(): Promise<Service[]> {
    const client = getApiClient()
    const response = await client.get("/product")

    return response.data.map((p: any) => ({
      id: String(p.productId),
      storeId: p.storeId,
      storeName: p.storeName,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      status: p.status,
      available: p.status === "ACTIVE",
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))
  },

  // 단일 서비스 조회
  async getService(id: string): Promise<Service | null> {
    const client = getApiClient()
    const response = await client.get(`/product/${id}`)
    const p = response.data
    if (!p) return null

    return {
      id: String(p.productId),
      storeId: p.storeId,
      storeName: p.storeName,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      status: p.status,
      available: p.status === "ACTIVE",
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }
  },
}
