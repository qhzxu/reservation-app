"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { type Reservation, reservationApi } from "@/lib/api/reservation-api"

function AdminReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationApi.getAdminReservations()
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

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">예약 ID</th>
            <th className="px-4 py-2 text-left">사용자</th>
            <th className="px-4 py-2 text-left">시작 시간</th>
            <th className="px-4 py-2 text-left">상태</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{reservation.id.slice(0, 8)}</td>
              <td className="px-4 py-2">{reservation.userId}</td>
              {/* <td className="px-4 py-2">{new Date(reservation.startTime).toLocaleString("ko-KR")}</td> */}
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    reservation.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : reservation.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {reservation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminReservationsPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">모든 예약 (관리자)</h1>
        <AdminReservationsList />
      </main>
    </ProtectedRoute>
  )
}
