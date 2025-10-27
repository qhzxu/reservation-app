"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { reservationApi, Reservation } from "@/lib/api/reservation-api"

function ReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationApi.getReservations()
        setReservations(data)
      } catch (err: any) {
        console.error(err)
        setError("예약 로드 실패")
      } finally {
        setLoading(false)
      }
    }
    fetchReservations()
  }, [])

  if (loading) return <div className="text-center py-12">로딩 중...</div>
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>
  if (reservations.length === 0) return <div className="text-center py-12 text-gray-500">예약이 없습니다</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      {reservations.map((reservation) => {
        const startDate = new Date(`${reservation.date}T${reservation.time}`)
        const formattedDate = startDate.toLocaleDateString("ko-KR", { weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" })
        const formattedTime = startDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })

        const statusColor =
          reservation.status === "CONFIRMED" ? "bg-green-100 text-green-800" :
          reservation.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"

        return (
          <Card key={reservation.id} className="border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-white px-6 py-4 border-b">
              <CardTitle className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 text-lg">{reservation.productName}</span>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColor}`}>
                  {reservation.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">예약일</span>
                  <span className="font-medium text-gray-800">{formattedDate}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">예약시간</span>
                  <span className="font-medium text-gray-800">{formattedTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default function ReservationsPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">내 예약</h1>
        <ReservationsList />
      </main>
    </ProtectedRoute>
  )
}
