// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// export default function Home() {
//   const router = useRouter()
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken")
//     setIsLoggedIn(!!token)
//   }, [])

//   useEffect(() => {
//     if (isLoggedIn) {
//       router.replace("/services")
//     }
//   }, [isLoggedIn, router])

//   if (isLoggedIn === null) return null

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-teal-50 via-sky-50 to-blue-100 flex items-center justify-center p-4">
//       <div className="text-center max-w-2xl">
//         <h1 className="text-5xl md:text-6xl font-extrabold text-sky-600 mb-4 drop-shadow-md">
//           Clinic 예약 시스템
//         </h1>
//         <p className="text-xl md:text-2xl text-gray-700 mb-8">
//           전문 피부 시술을 간편하게 예약하고 관리하세요
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Link href="/login">
//             <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white shadow-lg">
//               로그인
//             </Button>
//           </Link>
//           <Link href="/signup">
//             <Button size="lg" variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50">
//               회원가입
//             </Button>
//           </Link>
//         </div>

//         {isLoggedIn && (
//           <div className="mt-8">
//             <Link href="/services">
//               <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg">
//                 서비스 바로가기
//               </Button>
//             </Link>
//           </div>
//         )}
//       </div>
//     </main>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { motion } from "framer-motion"

interface Category {
  categoryId: number
  categoryName: string
  is_active: boolean
}

export default function GlowClinicHomePage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch("http://localhost:8383/product/category")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("카테고리 로딩 실패:", err))
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex flex-col items-center p-0">

        {/* 배너 */}
      <section className="relative w-full h-[340px] overflow-hidden mb-16">
  <img
    src="/img_main_clinic01.png"
    alt="Glow Clinic 배너"
    className="absolute inset-0 w-full h-full object-cover object-center opacity-80 pointer-events-none"
  />
<div className="absolute inset-0 bg-black opacity-10" />

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white"
  >
    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-3">
      Clinic에 오신 것을 환영합니다
    </h1>
    <p className="text-lg md:text-xl text-gray-100 font-light max-w-xl">
      안전하고 전문적인 피부 시술, 지금 예약하세요.
    </p>
    <div className="mt-6">
      <Link href="/services">
        <Button className="bg-white text-sky-600 font-semibold px-6 py-5 text-lg rounded-xl hover:bg-gray-100 shadow">
          시술 예약 바로가기
        </Button>
      </Link>
    </div>
  </motion.div>
</section>


        {/* 시술 카테고리 */}
        <section className="w-full max-w-6xl mx-auto px-6 mb-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            시술 카테고리
          </h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          >
            {categories.map(cat => (
              <Link
                key={cat.categoryId}
                href={`/services?catId=${cat.categoryId}`}
                className="bg-white rounded-2xl shadow-md flex flex-col items-center justify-center py-8 hover:bg-sky-50 hover:shadow-lg transition"
              >
                <span className="text-lg font-semibold text-gray-700">
                  {cat.categoryName}
                </span>
              </Link>
            ))}
          </motion.div>
        </section>

        {/* 인기 시술 */}
        <section className="w-full max-w-6xl mx-auto px-6 mb-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            인기 시술
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "여드름 치료", desc: "피부 재생과 트러블 완화 프로그램" },
              { name: "보톡스 시술", desc: "탄력 있는 피부를 위한 주름 개선" },
              { name: "레이저 미백", desc: "맑고 깨끗한 피부 톤 개선" },
            ].map((svc, i) => (
              <motion.div
                key={svc.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg hover:bg-sky-50 transition flex flex-col items-start"
              >
                <h3 className="text-xl font-bold text-sky-600 mb-2">
                  {svc.name}
                </h3>
                <p className="text-gray-700 mb-4">{svc.desc}</p>
                <Link href="/services">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    예약하기
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 예약 안내 */}
        <section className="w-full bg-white border-t py-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            첫 예약이신가요?
          </h3>
          <p className="text-gray-600 mb-5">
            로그인 후 간단하게 원하는 시술과 날짜를 선택하면 예약이 완료됩니다.
          </p>
          <Link href="/login">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              지금 예약하러 가기
            </Button>
          </Link>
        </section>

        {/* 푸터 */}
        <footer className="w-full border-t py-8 text-center text-gray-500 text-sm">
          © 2025 Clinic 
        </footer>
      </main>
    </>
  )
}
