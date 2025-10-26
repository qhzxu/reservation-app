"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ReservationCompletePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-3xl font-bold mb-4">예약이 완료되었습니다!</h1>
      <p className="text-gray-600 mb-6">예약 내역은 마이 페이지에서 확인할 수 있습니다.</p>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/reservations")} className="bg-blue-600 hover:bg-blue-700">
          내 예약 보기
        </Button>
        <Button onClick={() => router.push("/")} className="bg-gray-500 hover:bg-gray-600">
          홈으로
        </Button>
      </div>
    </div>
  )
}
