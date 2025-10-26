"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function SignupCompletePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-6">회원가입이 완료되었습니다!</h1>
          <p className="text-gray-700 mb-8">이제 로그인하여 서비스를 이용하실 수 있습니다.</p>
          <Link href="/login">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">로그인하러 가기</Button>
          </Link>
        </div>
      </main>
    </>
  )
}
