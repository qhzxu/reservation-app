"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { serviceApi, type Service } from "@/lib/api/service-api"
import { format } from "date-fns"

function ServicesList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceApi.getServices()
        setServices(data)
      } catch (err: any) {
        setError("서비스 로드 실패")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) return <div className="text-center py-12">로딩 중...</div>
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card
          key={service.id}
          className={`transition-shadow hover:shadow-xl border rounded-lg overflow-hidden ${
            service.available ? "border-green-300" : "border-gray-300"
          }`}
        >
          {/* 이미지 영역 */}
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              // src={service.imageUrl || "/placeholder.png"}
              alt={service.name}
              className="object-cover w-full h-full transition-transform hover:scale-105"
            />
          </div>

          {/* 카드 내용 */}
           <Link href={`/services/${service.id}`} className="flex-1 ml-3">
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
              {/* <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  service.available
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {service.available ? "예약 가능" : "예약 불가"}
              </span> */}
            </div>

            <p className="text-gray-700 text-sm line-clamp-2 hover:line-clamp-none transition-all">
              {service.description || "설명이 없습니다."}
            </p>

            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-xl font-bold text-blue-600">
                ₩{service.price.toLocaleString()}
              </span>
             
                {/* <Button className={"bg-blue-600 hover:bg-blue-700"}>
                  예약하기
                </Button> */}
              
            </div>

            {service.createdAt && (
              <div className="text-xs text-gray-400 mt-1">
                등록일: {format(new Date(service.createdAt), "yyyy-MM-dd")}
              </div>
            )}
          </CardContent>
          </Link>

        </Card>
        
      ))}
    </div>
  )
}

export default function ServicesPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">가게 상품 목록</h1>
        <ServicesList />
      </main>
    </ProtectedRoute>
  )
}
