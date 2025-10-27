"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/AdminHeader"

export default function AdminLogin() {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    setError("")

    // 임시 테스트용 로그인
    if (username === "admin" && password === "1234") {
      localStorage.setItem("adminToken", "test-token") // 임시 토큰
      router.push("/admin/dashboard")
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  return (
    <main className="min-h-screen pt-16 p-6 bg-gray-50">
      <AdminHeader title="관리자 로그인" />
      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-md shadow-md">
        <label className="text-xs font-medium">아이디</label>
        <input
          className="w-full border rounded p-2 mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="text-xs font-medium">비밀번호</label>
        <input
          type="password"
          className="w-full border rounded p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          로그인
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </main>
  )
}
