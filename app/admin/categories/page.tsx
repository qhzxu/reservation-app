"use client"

import { useEffect, useState } from "react"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"

type Category = { id: number; name: string }

export default function CategoriesPage() {
  const [list, setList] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [editing, setEditing] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIxLCJlbWFpbCI6InN0b3JlMDJAZXhhbXBsZS5jb20iLCJuYW1lIjoi7YWM7Iqk7Yq4IiwiaWF0IjoxNzYxNTgwODQzLCJleHAiOjE4NDc5ODA4NDN9.6Ekd2LZJv_TLXFgHSjnFZYFDTH65rhGTki6BLfqDtKs'

  const fetchList = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/store/categorie`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      const data = await res.json()
      setList(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchList() }, [])

  const handleAdd = async () => {
    if (!name) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/store/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error("추가 실패")
      setName("")
      fetchList()
    } catch (e) { console.error(e) }
  }

  const handleUpdate = async (id: number) => {
    const newName = name || ""
    if (!newName) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/store/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ name: newName }),
      })
      if (!res.ok) throw new Error("수정 실패")
      setName("")
      setEditing(null)
      fetchList()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return
    try {
      // API 경로 수정: /admin/categories -> /store/categories (추정)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/store/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      fetchList()
    } catch (e) { console.error(e) }
  }

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-50">
        <AdminHeader title="카테고리 관리" />
        <div className="max-w-md mx-auto mt-8 space-y-6">
          
          {/* 카테고리 추가/수정 폼 */}
          <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{editing ? "카테고리 수정" : "새 카테고리 추가"}</h2>
            <input 
              value={name} 
              onChange={(e)=>setName(e.target.value)} 
              placeholder="카테고리 이름" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4" 
            />
            <div className="flex gap-3">
              <button 
                onClick={handleAdd} 
                className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-md"
                disabled={editing !== null}
              >
                추가
              </button>
              {editing && (
                <>
                  <button 
                    onClick={() => handleUpdate(editing)} 
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    저장
                  </button>
                  <button 
                    onClick={() => { setEditing(null); setName("") }} 
                    className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    취소
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 카테고리 목록 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-800">카테고리 목록</h2>
            {loading ? <div className="text-center p-4">로딩 중...</div> : (
              list.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center border-2 border-dashed">
                  등록된 카테고리가 없습니다.
                </div>
              ) : (
                list.map(cat => (
                  <div key={cat.id} className="bg-white p-4 rounded-xl shadow flex items-center justify-between border-l-4 border-gray-400">
                    <div className={`text-lg font-medium ${editing === cat.id ? 'text-blue-600' : 'text-gray-800'}`}>{cat.name}</div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditing(cat.id); setName(cat.name) }} 
                        className="px-3 py-1 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        disabled={editing === cat.id}
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}