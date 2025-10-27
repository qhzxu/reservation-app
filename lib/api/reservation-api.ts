// lib/api/reservation-api.ts
import { getApiClient } from "@/lib/api-client"

// JSON 응답과 맞춘 타입
export interface Reservation {
  id: string
  storeId: number
  productId: number
  userId: number
  userName: string
  productName: string
  date: string
  time: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  createdAt: string
  updatedAt: string
}

export const reservationApi = {
  async getReservations(): Promise<Reservation[]> {
    const client = getApiClient()
    const response = await client.get("/user/reservation/my")
    return response.data.map((r: any) => ({
      id: r.reservationId.toString(),
      storeId: r.storeId,
      productId: r.productId,
      userId: r.userId,
      userName: r.userName,
      productName: r.productName,
      date: r.date,
      time: r.time,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))
  },

  async createReservation(data: {
    storeId: number
    productId: string
    date: string
    time: string
  }): Promise<any> {
    const client = getApiClient()
    const response = await client.post(
      `/user/stores/${data.storeId}/products/${data.productId}/reservations`,
      { date: data.date, time: data.time }
    )
    return response.data
  },

  async cancelReservation(id: string): Promise<void> {
    const client = getApiClient()
    await client.post(`/user/reservations/${id}/cancel`)
  },

  async getAdminReservations(): Promise<Reservation[]> {
    const client = getApiClient()
    const response = await client.get("/reservations/admin")
    return response.data
  },
}
