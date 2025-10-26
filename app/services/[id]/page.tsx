"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { serviceApi, type Service } from "@/lib/api/service-api"
import { reservationApi } from "@/lib/api/reservation-api"
import { format } from "date-fns"

function ServiceDetail() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("14:00")
  const [reserving, setReserving] = useState(false)

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)

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
    if (!service || !selectedDate) return

    const formattedDate = format(selectedDate, "yyyy-MM-dd")
    const formattedTime = `${selectedTime}:00`

    const confirmReserve = window.confirm(
      `예약 가능 날짜입니다. ${formattedDate} ${formattedTime}에 예약하시겠습니까?`
    )
    if (!confirmReserve) return

    setReserving(true)
    try {
      const response = await reservationApi.createReservation({
        storeId: service.storeId,
        productId: service.id,
        date: formattedDate,
        time: formattedTime,
      })

      if (response.success) {
        router.push("/reservations/complete")
      } else {
        alert(response.message || "예약 처리 중 오류가 발생했습니다.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "예약 실패")
    } finally {
      setReserving(false)
    }
  }

  if (loading) return <div className="text-center py-12">로딩 중...</div>
  if (error || !service) return <div className="text-center py-12 text-red-600">{error || "서비스를 찾을 수 없습니다"}</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 이미지 배너 */}
      <div className="w-full h-64 md:h-96 bg-gray-100 overflow-hidden rounded-lg shadow-md">
        <img
          // src={service.imageUrl || "/placeholder.png"}
          alt={service.name}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 상품 정보 */}
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl font-bold">{service.name}</CardTitle>
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
          <p className="text-gray-600">{service.storeName || "가게 정보 없음"} • {service.category || "카테고리 없음"}</p>
          <span className="text-2xl font-bold text-blue-600">₩{service.price.toLocaleString()}</span>
        </CardHeader>

        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">상품 설명</h3>
          <p className="text-gray-700">{service.description || "설명이 없습니다."}</p>
          {service.createdAt && (
            <p className="text-xs text-gray-400">등록일: {format(new Date(service.createdAt), "yyyy-MM-dd")}</p>
          )}
        </CardContent>
      </Card>

      {/* 예약 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">예약하기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleReserve} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예약 날짜</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                className="w-full border rounded px-3 py-2"
                placeholderText="날짜 선택"
                minDate={new Date()}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예약 시간</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <Button type="submit"  className="w-full bg-green-600 hover:bg-green-700">
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
