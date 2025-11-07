"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { adminCategoryApi, Category } from "@/lib/api/admin-category-api"

export default function CategoriesPage() {
  const [list, setList] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [editing, setEditing] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchList = async () => {
    setLoading(true)
    try {
      const data = await adminCategoryApi.getAll()
      setList(data || [])
    } catch (e) {
      console.error("카테고리 조회 실패", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleAdd = async () => {
    if (!name) return
    try {
      await adminCategoryApi.create(name)
      setName("")
      fetchList()
    } catch (e) {
      console.error("카테고리 추가 실패", e)
    }
  }

  const handleUpdate = async (id: number) => {
    if (!name) return
    try {
      await adminCategoryApi.update(id, name)
      setEditing(null)
      setName("")
      fetchList()
    } catch (e) {
      console.error("카테고리 수정 실패", e)
    }
  }
const handleDelete = async (id: number) => {
  if (!confirm("정말 삭제하시겠습니까?")) return
  try {
    await adminCategoryApi.delete(id)
    fetchList()
  } catch (e: any) {
    // 서버에서 내려준 메시지가 있으면 alert
    if (e.response?.status === 400 && e.response.data) {
      alert(e.response.data) // "카테고리에 상품이 존재하여 삭제할 수 없습니다."
    } else {
      console.error("카테고리 삭제 실패", e)
      alert("카테고리 삭제 중 오류가 발생했습니다.")
    }
  }
}


  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gradient-to-b from-gray-50 to-gray-100">
        <AdminHeader title="카테고리 관리" />

        <div className="max-w-3xl mx-auto mt-8 space-y-8">

          {/* 추가/수정 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">{editing ? "카테고리 수정" : "새 카테고리 추가"}</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                value={name} 
                onChange={(e)=>setName(e.target.value)} 
                placeholder="카테고리 이름" 
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {editing ? (
                <>
                  <button 
                    onClick={() => handleUpdate(editing)} 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    저장
                  </button>
                  <button 
                    onClick={() => { setEditing(null); setName("") }} 
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleAdd} 
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  추가
                </button>
              )}
            </div>
          </div>

          {/* 카테고리 목록 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">카테고리 목록</h2>

            {loading ? (
              <div className="text-center p-6 text-gray-500">로딩 중...</div>
            ) : (
              <AnimatePresence>
                {list.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white p-6 rounded-2xl shadow text-gray-400 text-center border-2 border-dashed"
                  >
                    등록된 카테고리가 없습니다.
                  </motion.div>
                ) : (
                  list.map(cat => (
                    <motion.div
                      key={cat.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white p-4 rounded-2xl shadow flex items-center justify-between border-l-4 border-gray-300 hover:shadow-xl transition-shadow"
                    >
                      <span className={`text-lg font-medium ${editing === cat.id ? 'text-blue-600' : 'text-gray-800'}`}>
                        {cat.name}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditing(cat.id); setName(cat.name) }} 
                          className="px-3 py-1 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 text-sm"
                          disabled={editing === cat.id}
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)} 
                          className="px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
