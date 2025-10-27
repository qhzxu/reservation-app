"use client"

import { useEffect, useState } from "react"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import Link from "next/link"
import { adminProductApi, Product } from "@/lib/api/admin-api"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  const fetchData = async () => {
    try {
      const prods = await adminProductApi.getProducts()
      setProducts(prods)
    } catch (e) {
      console.error("데이터 로드 실패:", e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-50">
        <AdminHeader title="상품 관리" />

        <div className="max-w-7xl mx-auto mt-8">
          {products.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center border-2 border-dashed">
              등록된 상품이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p.productId} className="bg-white rounded-xl shadow hover:shadow-xl transition-shadow flex flex-col">
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-medium">
                    이미지 없음
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-lg font-semibold text-gray-800 truncate">{p.name}</div>
                    <div className="text-sm text-gray-500 mt-1 truncate">{p.category?.name || "미지정"}</div>
                    
                    <div className="mt-2 text-md font-bold text-gray-900">₩{p.price?.toLocaleString() ?? "-"}</div>
                    {/* {p.status && (
                      <span className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        p.status === "CONFIRMED" ? "bg-green-100 text-green-800" :
                        p.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {p.status}
                      </span>
                    )} */}
                    <div className="mt-auto pt-4 flex justify-end">
                      <Link
                        href={`/admin/products/${p.productId}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-md"
                      >
                        수정/상세
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
