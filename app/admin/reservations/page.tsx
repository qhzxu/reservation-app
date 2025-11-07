"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { adminReservationApi, Reservation } from "@/lib/api/admin-reservation-api"
import { format } from "date-fns"

// 상태 색상
const statusColorMap: { [key: string]: string } = {
  PENDING: "bg-yellow-400",
  CONFIRMED: "bg-green-400",
  COMPLETED: "bg-blue-400",
  CANCELLED: "bg-red-400",
}

// 상태 텍스트
const statusTextMap: { [key: string]: string } = {
  PENDING: "대기중",
  CONFIRMED: "확정",
  COMPLETED: "완료",
  CANCELLED: "취소",
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [viewAll, setViewAll] = useState<boolean>(true)

  const router = useRouter()

  const fetchReservations = async () => {
    const data = await adminReservationApi.getReservations()
    setReservations(data.sort((a, b) => b.reservationId - a.reservationId))
  }

  const changeStatus = async (id: number, status: string) => {
    const confirmChange = window.confirm("예약 상태를 변경하시겠습니까?")
    if (!confirmChange) return

    try {
      await adminReservationApi.changeStatus(id, status)
      fetchReservations()
    } catch (e) {
      console.error("예약 상태 변경 실패:", e)
      alert("예약 상태 변경에 실패했습니다.")
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const filtered = reservations.filter(r => r.date === selectedDate)

  const displayed = viewAll ? reservations : filtered

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-50">
        <AdminHeader title="예약 관리" />

        {/* 뷰 선택 버튼 */}
        <div className="max-w-7xl mx-auto flex gap-4 mb-5">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${viewAll ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow-md"}`}
            onClick={() => setViewAll(true)}
          >
            전체 예약
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${!viewAll ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow-md"}`}
            onClick={() => setViewAll(false)}
          >
            날짜별 예약
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          {!viewAll && (
            <div className="lg:w-1/4 bg-white p-4 rounded-xl shadow-lg">
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}

          <div className={`${viewAll ? "w-full" : "lg:w-3/4"} flex flex-col gap-4`}>
            {displayed.length === 0 && (
              <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center border-2 border-dashed">
                예약이 없습니다.
              </div>
            )}

            {displayed.map(r => (
              <div
                key={r.reservationId}
                className="bg-white p-5 rounded-xl shadow-lg flex justify-between items-center border-l-4 border-blue-500 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/reservations/${r.reservationId}`)}
              >
                <div>
                  <div className="text-lg font-semibold text-gray-800">{r.userName}님</div>
                  <div className="text-sm text-gray-600 mt-1">{r.productName}</div>
                  <div className="text-sm text-gray-500 mt-1">{r.date} {r.time}</div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 상태 색상 원 */}
                  <span className={`w-3 h-3 rounded-full ${statusColorMap[r.status]}`}></span>

                  {/* 상태 변경 select */}
                  <select
                    value={r.status}
                    onClick={(e) => e.stopPropagation()} // 링크 이동 막기
                    onChange={(e) => changeStatus(r.reservationId, e.target.value)}
                    className="px-2 py-1 border rounded-lg text-sm font-medium"
                    disabled={r.status === "COMPLETED" || r.status === "CANCELLED"}
                  >
                    <option value="PENDING">{statusTextMap["PENDING"]}</option>
                    <option value="CONFIRMED">{statusTextMap["CONFIRMED"]}</option>
                    <option value="COMPLETED">{statusTextMap["COMPLETED"]}</option>
                    <option value="CANCELLED">{statusTextMap["CANCELLED"]}</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
