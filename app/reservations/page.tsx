"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Reservation, reservationApi } from "@/lib/api/reservation-api"

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
        setError("예약 로드 실패")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const handleCancel = async (id: string) => {
    try {
      await reservationApi.cancelReservation(id)
      setReservations(reservations.filter((r) => r.id !== id))
    } catch (err: any) {
      setError("취소 실패")
    }
  }

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  if (reservations.length === 0) {
    return <div className="text-center py-12 text-gray-600">예약이 없습니다</div>
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>예약 #{reservation.id.slice(0, 8)}</span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  reservation.status === "CONFIRMED"
                    ? "bg-green-100 text-green-800"
                    : reservation.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {reservation.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-600">시작: {new Date(reservation.startTime).toLocaleString("ko-KR")}</p>
            <p className="text-gray-600">종료: {new Date(reservation.endTime).toLocaleString("ko-KR")}</p>
            {reservation.status !== "CANCELLED" && (
              <Button onClick={() => handleCancel(reservation.id)} variant="destructive" size="sm">
                취소
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import { useAuthStore } from "@/lib/stores/auth-store"

export default function ReservationsPage() {
  const { user, accessToken } = useAuthStore()
  console.log("[예약] user:", user)
  console.log("[예약] accessToken:", accessToken)
  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">내 예약</h1>
        <ReservationsList />
      </main>
    </ProtectedRoute>
  )
}
