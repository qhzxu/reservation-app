"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export default function HomePage() {
  const { user } = useAuthStore()
  // 샘플 카테고리/서비스 목록
  const categories = [
    { name: "미용", icon: "💇", href: "/services?cat=beauty" },
    { name: "헬스", icon: "🏋️", href: "/services?cat=health" },
    { name: "교육", icon: "📚", href: "/services?cat=edu" },
    { name: "기타", icon: "✨", href: "/services" },
  ]
  const services = [
    { name: "헤어샵 예약", desc: "전문 미용실 예약 서비스", href: "/services/1" },
    { name: "PT 예약", desc: "헬스 트레이너와 1:1 예약", href: "/services/2" },
    { name: "영어 과외", desc: "원어민 영어 과외 신청", href: "/services/3" },
    { name: "피부관리", desc: "피부 전문가와 예약", href: "/services/4" },
    { name: "요가 클래스", desc: "요가 강사와 그룹 수업", href: "/services/5" },
    { name: "수학 과외", desc: "수학 전문 과외 신청", href: "/services/6" },
  ]

  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-gray-50 flex flex-col items-center p-0">
        {/* 배너 */}
        <section className="w-full h-48 bg-gradient-to-r from-blue-500 to-green-400 flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {user ? `${user.userName}님, 환영합니다!` : "환영합니다!"}
          </h1>
        </section>

        {/* 카테고리 */}
        <section className="w-full max-w-4xl mx-auto px-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="bg-white rounded-lg shadow flex flex-col items-center justify-center py-6 hover:bg-blue-50 transition">
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-lg font-semibold text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 서비스 목록 (캐러셀) */}
        <section className="w-full max-w-4xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">추천 서비스</h2>
            <Link href="/services">
              <Button variant="outline" className="text-blue-600 border-blue-300">더보기</Button>
            </Link>
          </div>
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {services.map((svc) => (
                <CarouselItem key={svc.name} className="md:basis-1/3 basis-full">
                  <Link href={svc.href} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between hover:bg-green-50 transition h-full">
                    <span className="text-xl font-bold text-blue-600 mb-2">{svc.name}</span>
                    <span className="text-gray-700 mb-4">{svc.desc}</span>
                    <Button className="bg-blue-500 hover:bg-blue-600 w-full">예약하기</Button>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* 바로가기 */}
        <section className="w-full max-w-4xl mx-auto px-4 mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">빠른 이동</h2>
          <div className="flex gap-4">
            <Link href="/reservations">
              <Button className="bg-green-600 hover:bg-green-700">예약 내역 보기</Button>
            </Link>
            <Link href="/profile">
              <Button className="bg-gray-600 hover:bg-gray-700">내 정보</Button>
            </Link>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  )
}
