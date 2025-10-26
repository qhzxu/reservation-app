import { getApiClient } from "@/lib/api-client"

// 예약 객체 타입
export interface Reservation {
  id: string
  storeId: Number       // storeId 추가
  productId: string     // productId 추가
  userId: string
  date: string          // yyyy-MM-dd
  time: string          // HH:mm:ss
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  createdAt: string
}

export const reservationApi = {
  // 내 예약 목록 조회
  async getReservations(): Promise<Reservation[]> {
    const client = getApiClient()
    const response = await client.get("/user/reservations")
    return response.data
  },
  
// 예약 생성 (백엔드 요청 형식 맞춤)
async createReservation(data: {
  storeId: number
  productId: string
  date: string
  time: string
}): Promise<any> {
  const client = getApiClient()
  const response = await client.post(
    `/user/stores/${data.storeId}/products/${data.productId}/reservations`,
    {
      date: data.date,
      time: data.time,
    }
  )
  return response.data // success, message, reservation 모두 포함
},



  // 예약 취소
  async cancelReservation(id: string): Promise<void> {
    const client = getApiClient()
    await client.post(`/user/reservations/${id}/cancel`)
  },

  // 관리자 예약 목록
  async getAdminReservations(): Promise<Reservation[]> {
    const client = getApiClient()
    const response = await client.get("/reservations/admin")
    return response.data
  },
}
