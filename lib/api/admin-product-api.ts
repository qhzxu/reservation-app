import { getApiClient } from "@/lib/api/api-client"

export interface Category {
  id: number
  name: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price?: number
  category?: Category | null
}

export interface ProductForm {
  name: string
  description?: string
  price?: number
  categoryId?: number | null
}

const client = getApiClient()

export const adminProductApi = {
  // 전체 상품 조회
  async getAll(): Promise<Product[]> {
    const res = await client.get("/admin/products")
    return res.data
  },

  // ID로 상품 단건 조회
  async getProductById(id: number): Promise<Product | null> {
    if (!id) return null
    const res = await client.get(`/admin/products/${id}`)
    return res.data ?? null
  },

  // 상품 생성
  async createProduct(form: ProductForm): Promise<Product> {
    const res = await client.post("/admin/products", form)
    return res.data
  },

  // 상품 수정
  async updateProduct(data: { productId: number } & ProductForm): Promise<void> {
   await client.patch("/store/products", data)
  },

  // 상품 삭제
  async deleteProduct(id: number): Promise<void> {
    await client.delete(`/admin/products/${id}`)
  },
}
