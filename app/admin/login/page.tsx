"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminAuthApi } from "@/lib/api/admin-auth-api"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const data = await adminAuthApi.login({ email, password })
      localStorage.setItem("adminToken", data.accessToken)
      router.push("/admin")  // 로그인 성공 후 관리자 홈으로 이동
    } catch (e) {
      console.error("로그인 실패", e)
      alert("로그인 실패")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6">관리자 로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          로그인
        </button>
      </div>
    </div>
  )
}
