import { getAdminApiClient } from "./admin-api-client"

// Product 타입 정의
export interface Product {
  productId?: number
  name: string
  description?: string | null
  price?: number | null
  status?: string | null
  storeId?: number | null
  category?: { id: number; name: string } | null
}

export interface ProductForm {
  name: string
  description?: string | null
  price?: number | null
  categoryId?: number | null
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

  async createProduct(form: ProductForm): Promise<Product> {
    try {
      const client = getAdminApiClient()
      const response = await client.post("/store/products", form)
      return response.data
    } catch (e) {
      console.error("상품 생성 실패:", e)
      throw e
    }
  },

  async updateProduct(productId: number, form: ProductForm): Promise<Product> {
    try {
      const client = getAdminApiClient()
      const response = await client.patch("/store/products", {
        productId,
        ...form, // form에 담긴 name, description, price, categoryId 그대로 사용
      })
      return response.data
    } catch (e) {
      console.error("상품 수정 실패:", e)
      throw e
    }
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      const client = getAdminApiClient()
      await client.delete(`/store/products/${id}`)
    } catch (e) {
      console.error("상품 삭제 실패:", e)
      throw e
    }
  },
}
