"use client"

import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/stores/auth-store"

import { useEffect } from "react"
import { authApi } from "@/lib/api/auth-api"

function ProfileContent() {
  const { user, setUser } = useAuthStore()

  useEffect(() => {
    if (!user) {
      authApi.me()
        .then((data) => {
          setUser({
            userId: String(data.userId),
            email: data.email,
            userName: data.name,
            phoneNumber: data.phoneNumber,
            role: data.role,
          })
        })
        .catch(() => {})
    }
  }, [user, setUser])

  if (!user) {
    return <div className="text-center py-12">사용자 정보를 로드할 수 없습니다</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">이름</p>
            <p className="text-lg font-semibold">{user.userName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">이메일</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">전화번호</p>
            <p className="text-lg font-semibold">{user.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">역할</p>
            <p className="text-lg font-semibold">{user.role === "USER" ? "사용자" : ""}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">프로필</h1>
        <ProfileContent />
      </main>
    </ProtectedRoute>
  )
}
