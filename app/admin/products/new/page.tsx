"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { adminProductApi } from "@/lib/api/admin-api"
import { adminCategoryApi, Category } from "@/lib/api/admin-category-api"

interface ProductForm {
  name: string
  description?: string
  price?: number
  categoryId?: number | null
}

export default function AdminProductNewPage() {
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    categoryId: null,
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await adminCategoryApi.getAll()
        setCategories(cats)
      } catch (e) {
        console.error(e)
        alert("카테고리 로드 실패")
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (field: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.name) {
      alert("상품명을 입력해주세요.")
      return
    }
    setSaving(true)
    try {
      await adminProductApi.createProduct(form)
      alert("상품이 등록되었습니다.")
      router.push("/admin/products")
    } catch (e) {
      console.error(e)
      alert("상품 등록 실패")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center">로딩중...</div>

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-50">
        <AdminHeader title="새 상품 등록" />

        <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-xl shadow space-y-6">
          {/* 상품명 */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">상품명</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">설명</label>
            <textarea
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 가격 */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">가격</label>
            <input
              type="number"
              value={form.price}
              onChange={e => handleChange("price", Number(e.target.value))}
              className="p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 카테고리 */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">카테고리</label>
            <select
              value={form.categoryId ?? ""}
              onChange={e =>
                handleChange(
                  "categoryId",
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="">카테고리 선택</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {saving ? "저장중..." : "등록"}
            </button>
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
