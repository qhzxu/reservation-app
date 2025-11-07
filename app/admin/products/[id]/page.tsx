"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { adminProductApi, Product } from "@/lib/api/admin-api"
import { adminCategoryApi, Category } from "@/lib/api/admin-category-api"
import { log } from "console"

interface ProductForm {
  name: string
  description?: string
  price?: number
  categoryId?: number | null
}

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    categoryId: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const productId = Number(params.id)

  useEffect(() => {
    if (!productId || isNaN(productId)) return

    const fetchData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          adminProductApi.getProductById(productId),
          adminCategoryApi.getAll(),
        ])

        if (!productData) {
          alert("상품을 불러올 수 없습니다.")
          return
        }

        const categoryId: number | null = productData.category?.id ?? null

        setProduct(productData)
        setForm({
          name: productData.name,
          description: productData.description ?? "",
          price: productData.price ?? 0,
          categoryId: categoryId,
        })

        
        setCategories(categoryData)
      } catch (e) {
        console.error(e)
        alert("데이터 로드 실패")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  const handleChange = (field: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

const handleSave = async () => {
  if (!productId) return
  setSaving(true)
  try {
    console.log("저장할 데이터:", form)
    await adminProductApi.updateProduct(productId, form) // form 기반 전송
    alert("상품이 수정되었습니다.")
    const updated = await adminProductApi.getProductById(productId)
    setProduct(updated)
  } catch (e) {
    console.error("상품 수정 실패:", e)
    alert("상품 수정 실패")
  } finally {
    setSaving(false)
  }
}


  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    if (!productId) return
    setDeleting(true)
    try {
      await adminProductApi.deleteProduct(productId)
      alert("상품이 삭제되었습니다.")
      router.push("/admin/products")
    } catch (e) {
      console.error(e)
      alert("상품 삭제 실패")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="p-6 text-center">로딩중...</div>
  if (!product) return <div className="p-6 text-center text-red-500">상품을 찾을 수 없습니다.</div>

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-50">
        <AdminHeader title="상품 상세/수정" />

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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {saving ? "저장중..." : "저장"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              {deleting ? "삭제중..." : "삭제"}
            </button>
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
