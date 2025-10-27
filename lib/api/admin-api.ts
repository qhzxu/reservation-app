import { getAdminApiClient } from "./admin-api-client"

// Product 타입 정의 (category는 id/name 구조, 없을 수도 있음)
export interface Product {
  productId: number
  name: string
  description?: string | null
  price?: number | null
  createdAt?: string | null
  updatedAt?: string | null
  status?: string | null
  storeId?: number | null
  store?: any | null
  reservationHdr?: any | null
  category?: { id: number; name: string } | null
}

export const adminProductApi = {
  async getProducts(): Promise<Product[]> {
    try {
      const client = getAdminApiClient()
      const response = await client.get("/store/products")
      return response.data || []
    } catch (e) {
      console.error("상품 로드 실패:", e)
      return []
    }
  },

  async getProductById(id: number): Promise<Product | null> {
    try {
      const client = getAdminApiClient()
      const response = await client.get(`/store/products/${id}`)
      return response.data || null
    } catch (e) {
      console.error("상품 상세 로드 실패:", e)
      return null
    }
  },
}
