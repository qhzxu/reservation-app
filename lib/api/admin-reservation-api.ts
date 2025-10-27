// lib/api/admin-reservation-api.ts
import { getAdminApiClient } from "./admin-api-client"

export interface Reservation {
  reservationId: number
  date: string
  time: string
  status: string
  isActive: boolean
  userId: number
  productId: number
  storeId: number
  userName: string
  productName: string
  createdAt?: string
  updatedAt?: string
}

export const adminReservationApi = {
  async getReservations(): Promise<Reservation[]> {
    try {
      const client = getAdminApiClient()
      const response = await client.get("/store/reservations")
      return response.data || []
    } catch (e) {
      console.error("예약 리스트 로드 실패:", e)
      return []
    }
  },

  async changeStatus(reservationId: number, status: string): Promise<void> {
    try {
      const client = getAdminApiClient()
      await client.put(`/store/reservations/${reservationId}/status`, { status })
    } catch (e) {
      console.error("예약 상태 변경 실패:", e)
    }
  },
}
