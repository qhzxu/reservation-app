"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { serviceApi, type Service } from "@/lib/api/service-api"

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

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">₩{service.price.toLocaleString()}</span>
              {/* <span className="text-sm text-gray-600">{service.duration}분</span> */}
            </div>
            <div className="flex gap-2">
              <Link href={`/services/${service.id}`} className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">예약하기</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">서비스</h1>
        <ServicesList />
      </main>
    </>
  )
}
