import { useState, useCallback, useRef } from "react"
import { tokenStorage } from "@/lib/tokens"

export interface Message {
  role: "user" | "assistant"
  content: string
}

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const loadingRef = useRef(false)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loadingRef.current) return

    loadingRef.current = true
    setIsLoading(true)

    setMessages((prev) => [...prev, { role: "user", content }])

    try {
      const token = tokenStorage.get()
      const url = `${process.env.NEXT_PUBLIC_API_URL}/chat`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let buffer = ""
      let accumulated = ""

      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const events = buffer.split("\n\n")
        buffer = events.pop() ?? ""

        for (const event of events) {
          const line = event.trim()
          if (!line.startsWith("data: ")) continue

          const dataStr = line.slice(6)
          if (dataStr === "[DONE]") {
            reader.cancel()
            return
          }

          try {
            const { text } = JSON.parse(dataStr) as { text: string }
            accumulated += text
            setMessages((prev) => {
              const msgs = [...prev]
              msgs[msgs.length - 1] = { role: "assistant", content: accumulated }
              return msgs
            })
          } catch {
            // ignore malformed chunk
          }
        }
      }
    } catch (err) {
      console.error("[Chat] stream error:", err)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro ao conectar com o assistente. Tente novamente.",
        },
      ])
    } finally {
      loadingRef.current = false
      setIsLoading(false)
    }
  }, [])

  return { messages, sendMessage, isLoading }
}
