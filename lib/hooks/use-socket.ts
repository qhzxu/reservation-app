"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { Client, type IMessage } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { useAuthStore } from "@/lib/stores/auth-store"

export function useSocket() {
  const clientRef = useRef<Client | null>(null)
  const { accessToken } = useAuthStore()
  const [connected, setConnected] = useState(false)

  const connect = useCallback(() => {
    if (clientRef.current?.connected) return

    const WS_URL = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8383").replace("http", "ws") + "/ws"

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        setConnected(true)
        console.log("WebSocket 연결됨")
      },
      onStompError: (frame) => {
        setConnected(false)
        console.error("STOMP 에러:", frame)
      },
      reconnectDelay: 5000,
    })

    client.activate()
    clientRef.current = client
  }, [accessToken])

  const subscribe = useCallback(
    (destination: string, callback: (message: IMessage) => void) => {
      if (!clientRef.current?.connected) return
      return clientRef.current?.subscribe(destination, callback)
    },
    [],
  )

  const publish = useCallback(
    (destination: string, body: any) => {
      if (!clientRef.current?.connected) return
      clientRef.current?.publish({
        destination,
        body: JSON.stringify(body),
      })
    },
    [],
  )

  const disconnect = useCallback(() => {
    if (clientRef.current?.connected) {
      clientRef.current.deactivate()
      setConnected(false)
    }
  }, [])

  useEffect(() => {
    if (accessToken) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [accessToken, connect, disconnect])

  return { subscribe, publish, disconnect, connected }
}
