// components/ChatRoom.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  from: string;
  content: string;
}

interface ChatRoomProps {
  userId: number;
  toId: number;
  token: string;
}

export default function ChatRoom({ userId, toId, token }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 하단으로 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/chat`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket 연결 성공");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { from: data.from, content: data.content }]);
    };

    ws.onclose = () => console.log("WebSocket 연결 종료");
    ws.onerror = (err) => console.error("WebSocket 에러", err);

    // JWT 인증 메시지
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "AUTH", token }));
    });

    return () => {
      ws.close();
    };
  }, [token]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;
    const message = { to: String(toId), content: input };
    wsRef.current.send(JSON.stringify(message));
    setMessages((prev) => [...prev, { from: String(userId), content: input }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-[500px] w-[400px] border rounded shadow-lg overflow-hidden">
      {/* 메시지 영역 */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => {
          const isMe = msg.from === String(userId);
          return (
            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  isMe ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="flex p-2 border-t bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          전송
        </button>
      </div>
    </div>
  );
}
