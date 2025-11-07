"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { getAdminApiClient } from "@/lib/api/admin-api-client"
import { format } from "date-fns"

const statusMap: { [key: string]: { text: string; color: string } } = {
  PENDING: { text: "대기중", color: "bg-yellow-500" },
  CONFIRMED: { text: "확정", color: "bg-green-500" },
  COMPLETED: { text: "완료", color: "bg-blue-500" },
  CANCELLED: { text: "취소", color: "bg-red-500" },
}

interface Reservation {
  reservationId: number
  date: string
  time: string
  status: string
  isActive: boolean
  userId: number
  userName: string
  productId: number
  productName: string
  storeId: number
  createdAt?: string
  updatedAt?: string
}

export default function ReservationDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchReservation = async () => {
    const reservationId = Number(id)
    if (!reservationId || isNaN(reservationId)) {
      alert("잘못된 예약 ID입니다.")
      router.back()
      return
    }

    try {
      const client = getAdminApiClient()
      const res = await client.get<Reservation>(`/store/reservations/${reservationId}`)
      setReservation(res.data)
    } catch (e) {
      console.error("예약 상세 조회 실패:", e)
      alert("예약 정보를 불러오지 못했습니다.")
      router.back()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservation()
  }, [id])

  if (loading) return <div className="p-6 text-center text-gray-500">로딩 중...</div>
  if (!reservation) return null

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-100">
        <AdminHeader title="예약 상세" />

        <div className="max-w-4xl mx-auto space-y-6">
            {/* 뒤로가기 버튼 */}
<button
  onClick={() => router.back()}
  className="mb-4 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
>
  ← 뒤로가기
</button>

          {/* 상태 카드 */}
          <div className={`flex items-center gap-3 p-4 rounded-xl shadow-md border-l-8 ${statusMap[reservation.status]?.color} bg-white`}>
            <span className={`w-4 h-4 rounded-full ${statusMap[reservation.status]?.color}`}></span>
            <h3 className="text-lg font-semibold text-gray-700">{statusMap[reservation.status]?.text}</h3>
            <span className="ml-auto text-sm text-gray-500">예약 ID: {reservation.reservationId}</span>
          </div>

          {/* 예약자 & 상품 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h4 className="font-semibold text-gray-800 mb-2">예약자 정보</h4>
              <p className="text-gray-700">{reservation.userName}</p>
              <p className="text-gray-500 text-sm mt-1">ID: {reservation.userId}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h4 className="font-semibold text-gray-800 mb-2">상품 정보</h4>
              <p className="text-gray-700">{reservation.productName}</p>
              <p className="text-gray-500 text-sm mt-1">ID: {reservation.productId}</p>
            </div>
          </div>

          {/* 예약 정보 카드 */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-gray-800 mb-2">예약 정보</h4>
            <div className="flex flex-col gap-1 text-gray-700">
              <p><span className="font-medium">날짜:</span> {reservation.date}</p>
              <p><span className="font-medium">시간:</span> {reservation.time}</p>
              <p><span className="font-medium">활성 여부:</span> {reservation.isActive ? "활성" : "비활성"}</p>
            </div>
          </div>

          {/* 메타 정보 카드 */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-gray-800 mb-2">생성 / 수정 정보</h4>
            <div className="flex flex-col gap-1 text-gray-600 text-sm">
              <p><span className="font-medium">생성일:</span> {reservation.createdAt ? format(new Date(reservation.createdAt), "yyyy-MM-dd HH:mm") : "-"}</p>
              <p><span className="font-medium">수정일:</span> {reservation.updatedAt ? format(new Date(reservation.updatedAt), "yyyy-MM-dd HH:mm") : "-"}</p>
            </div>
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
