"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export default function ReservationCompletePage() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="text-center shadow-lg border">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-green-700">
              예약이 완료되었습니다 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              예약이 성공적으로 접수되었습니다.<br />
              예약 내역은 마이페이지 또는 예약 내역 페이지에서 확인할 수 있습니다.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => router.push("/reservations")}
              >
                예약 내역 보기
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/home")}
              >
                홈으로 가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
  )
}
