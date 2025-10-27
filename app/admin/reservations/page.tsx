"use client"

import { useEffect, useState } from "react"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { adminReservationApi, Reservation } from "@/lib/api/admin-reservation-api"
import { format } from "date-fns"

const statusMap: { [key: string]: { text: string; color: string } } = {
  CONFIRMED: { text: "승인 완료", color: "text-green-600 bg-green-100" },
  PENDING: { text: "대기 중", color: "text-yellow-600 bg-yellow-100" },
  CANCELLED: { text: "취소됨", color: "text-red-600 bg-red-100" },
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [viewAll, setViewAll] = useState<boolean>(true)

  const fetchReservations = async () => {
    const data = await adminReservationApi.getReservations()
    setReservations(data.sort((a,b)=>b.reservationId - a.reservationId)) // 최신순
  }

  const changeStatus = async (id: number, status: string) => {
    await adminReservationApi.changeStatus(id, status)
    fetchReservations()
  }

  useEffect(() => { fetchReservations() }, [])

  const filtered = reservations.filter(r => r.date === selectedDate)

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
          {/* 달력 (날짜별 뷰일 때만) */}
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

          {/* 예약 리스트 */}
          <div className={`${viewAll ? "w-full" : "lg:w-3/4"} flex flex-col gap-4`}>
            {(viewAll ? reservations : filtered).length === 0 && (
              <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center border-2 border-dashed">
                예약이 없습니다.
              </div>
            )}
            {(viewAll ? reservations : filtered).map(r => (
              <div key={r.reservationId} className="bg-white p-5 rounded-xl shadow-lg flex justify-between items-start border-l-4 border-blue-500">
                <div>
                  <div className="text-lg font-semibold text-gray-800">{r.userName}님</div>
                  <div className="text-sm text-gray-600 mt-1">{r.productName}</div>
                  <div className="text-sm text-gray-500 mt-1">{r.date} {r.time}</div>
                  <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${statusMap[r.status]?.color || 'text-gray-600 bg-gray-100'}`}>
                    {statusMap[r.status]?.text || r.status}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 mt-1">
                  <button 
                    onClick={() => changeStatus(r.reservationId, 'CONFIRMED')} 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
                    disabled={r.status === 'CONFIRMED'}
                  >
                    승인
                  </button>
                  <button 
                    onClick={() => changeStatus(r.reservationId, 'CANCELLED')} 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-md disabled:opacity-50"
                    disabled={r.status === 'CANCELLED'}
                  >
                    취소
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
