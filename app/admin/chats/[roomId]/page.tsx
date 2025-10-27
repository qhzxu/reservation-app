"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"

type Message = { sender: string; content: string; createdAt: string; isMine: boolean } // isMine 속성을 임시로 추가하여 디자인 변경에 활용

export default function ChatRoomPage() {
  const params = useParams()
  const roomId = params?.roomId || ""
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null

  useEffect(()=>{
    const fetchMessages = async ()=>{
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/admin/chats/${roomId}/messages`, { headers: { Authorization: token ? `Bearer ${token}` : "" } })
        const data = await res.json()
        // API 응답에 isMine 정보가 없으므로 임시로 sender가 'Admin'이 아닌 경우를 상대방 메시지로 가정하여 UI에 반영
        const formattedData = (data || []).map((m: any) => ({
          ...m,
          isMine: m.sender === "Admin", // 'Admin'이 관리자라고 가정
          createdAt: new Date(m.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) // 시간 포맷 변경 (임시)
        }))
        setMessages(formattedData)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    if (roomId) fetchMessages()
  }, [roomId])
  
  // 임시 메시지 전송 로직
  const handleSend = () => {
    if (!input.trim()) return
    const newMessage: Message = {
      sender: "Admin",
      content: input,
      createdAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    }
    setMessages(prev => [...prev, newMessage])
    setInput("")
    // 실제로는 여기에 POST API 호출 로직이 들어가야 함
    // 예: fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/chats/${roomId}/messages`, { method: "POST", ... })
  }


  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-4 bg-gray-50">
        <AdminHeader title={`채팅방: ${roomId}`} />
        <div className="max-w-md mx-auto mt-6 flex flex-col h-[calc(100vh-10rem)]">
          
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-xl shadow-lg">
            {loading ? <div className="text-center text-gray-500">로딩 중...</div> : (
              messages.length === 0 ? <div className="text-center text-gray-500">메시지가 없습니다.</div> : (
                messages.map((m,i)=>(
                  <div key={i} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl shadow-sm ${m.isMine ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-tl-none'}`}>
                      {!m.isMine && <div className="text-xs font-semibold mb-1">{m.sender}</div>}
                      <div className="text-sm break-words">{m.content}</div>
                      <div className={`mt-1 text-[10px] ${m.isMine ? 'text-blue-200 text-right' : 'text-gray-500 text-left'}`}>{m.createdAt}</div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
          
          {/* 입력 폼 */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="메시지 입력..."
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSend}
              className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!input.trim()}
            >
              전송
            </button>
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}