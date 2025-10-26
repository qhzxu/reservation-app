"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { serviceApi, type Service } from "@/lib/api/service-api"
import { reservationApi } from "@/lib/api/reservation-api"

function ServiceDetail() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [reserving, setReserving] = useState(false)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await serviceApi.getService(params.id as string)
        setService(data)
      } catch (err: any) {
        setError("서비스 로드 실패")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [params.id])

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return

    setReserving(true)
    try {
      await reservationApi.createReservation({
        serviceId: service.id,
        startTime,
        endTime,
      })
      // router.push("/reservations")
    } catch (err: any) {
      setError(err.response?.data?.message || "예약 실패")
    } finally {
      setReserving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  if (error || !service) {
    return <div className="text-center py-12 text-red-600">{error || "서비스를 찾을 수 없습니다"}</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{service.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">{service.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">가격</p>
              <p className="text-2xl font-bold text-blue-600">₩{service.price.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">소요 시간</p>
              {/* <p className="text-2xl font-bold">{service.duration}분</p> */}
            </div>
          </div>

          <form onSubmit={handleReserve} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
              <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
              <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>

            <Button type="submit" disabled={reserving} className="w-full bg-green-600 hover:bg-green-700">
              {reserving ? "예약 중..." : "예약하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ServiceDetailPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ServiceDetail />
      </main>
    </ProtectedRoute>
  )
}
