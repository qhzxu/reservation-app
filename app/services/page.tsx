"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { serviceApi, type Service } from "@/lib/api/service-api"
import { ArrowLeft } from "lucide-react"
import { describe } from "node:test"

interface Category {
  category_id: number
  category_name: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryId = searchParams.get("catId")

  // 카테고리 리스트 fetch
  useEffect(() => {
    fetch("http://localhost:8383/product/category")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("카테고리 로딩 실패:", err))
  }, [])

  // 서비스 목록 fetch
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        let data: Service[]
        if (categoryId) {
          data = await serviceApi.getServicesByCategory(Number(categoryId))
        } else {
          data = await serviceApi.getServices()
        }

        console.log(data)
        // 만약 name/description이 객체로 내려오면 문자열로 변환
        const mappedData = data.map(s => ({
          ...s,
          name: s.name,
          description: s.description
        }))

        setServices(mappedData)
      } catch (err) {
        setError("서비스 로드 실패")
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [categoryId])

  const category = categories.find(cat => String(cat.category_id) === categoryId)
  const categoryName = category?.category_name

  if (loading) return <div className="text-center py-12">로딩 중...</div>
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>

  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-400 text-white rounded-full p-2"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 py-10">
            {categoryName ? categoryName : "전체 보기"}
          </h1>
          <div style={{ width: "96px" }}></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`} className="flex-1">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {service.storeName || "가게 정보 없음"} • {service.category || "카테고리 없음"}
                      </CardDescription>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-2 hover:line-clamp-none transition-all">
                    {service.description || "설명이 없습니다."}
                  </p>

                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-xl font-bold text-blue-600">
                      ₩{service.price.toLocaleString()}
                    </span>
                  </div>

                  {service.createdAt && (
                    <div className="text-xs text-gray-400 mt-1">
                      등록일: {new Date(service.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </ProtectedRoute>
  )
}
