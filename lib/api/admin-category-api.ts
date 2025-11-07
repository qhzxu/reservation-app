// /lib/api/admin-category-api.ts
import { getAdminApiClient } from "./admin-api-client"

export interface Category {
  id: number
  name: string
  storeId?: number
  isActive?: boolean
}

export const adminCategoryApi = {
  // 모든 카테고리 조회
  async getAll(): Promise<Category[]> {
    const client = getAdminApiClient()
    const res = await client.get("/store/categories")
    return res.data.map((c: any) => ({
      id: c.categoryId,
      name: c.categoryName,
      storeId: c.storeId,
      isActive: c.isActive,
    }))
  },

  // 카테고리 추가
  async create(name: string): Promise<Category> {
    const client = getAdminApiClient()
    const res = await client.post("/store/categories", { categoryName : name })
    return {
      id: res.data.categoryId,
      name: res.data.categoryName,
      storeId: res.data.storeId,
      isActive: res.data.isActive,
    }
  },

  // 카테고리 수정
  async update(id: number, name: string): Promise<Category> {
  const client = getAdminApiClient()
  const res = await client.patch(`/store/categories`, { 
    categoryId: id,
    categoryName: name 
  })
  return {
    id: res.data.categoryId,
    name: res.data.categoryName,
    storeId: res.data.storeId,
    isActive: res.data.isActive,
  }
},

  // 카테고리 삭제 (soft delete)
  async delete(id: number): Promise<void> {
    const client = getAdminApiClient()
    await client.patch(`/store/categories/${id}/delete`)
  },
}
