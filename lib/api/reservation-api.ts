import { getApiClient } from "@/lib/api-client"

export interface Reservation {
  id: string
  serviceId: string
  userId: string
  startTime: string
  endTime: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  createdAt: string
}

export const reservationApi = {
  async getReservations(): Promise<Reservation[]> {
    const client = getApiClient()
    const response = await client.get("/reservations")
    return response.data
  },

  async createReservation(data: {
    serviceId: string
    startTime: string
    endTime: string
  }): Promise<Reservation> {
    const client = getApiClient()
    const response = await client.post("/reservations", data)
    return response.data
  },

  async cancelReservation(id: string): Promise<void> {
    const client = getApiClient()
    await client.post(`/reservations/${id}/cancel`)
  },

  async getAdminReservations(): Promise<Reservation[]> {
    const client = getApiClient()
    const response = await client.get("/reservations/admin")
    return response.data
  },
}
