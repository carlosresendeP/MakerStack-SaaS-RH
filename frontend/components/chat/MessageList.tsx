"use client"

import { useEffect, useRef } from "react"
import { User, Bot, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "@/hooks/useChatStream"

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user"
        const isLastAssistant = !isUser && i === messages.length - 1

        return (
          <div
            key={i}
            className={cn(
              "flex gap-3 w-full max-w-3xl mx-auto",
              isUser ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/20 text-foreground"
              )}
            >
              {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
            </div>

            {/* Bubble */}
            <div
              className={cn(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[75%]",
                isUser
                  ? "bg-primary/15 text-foreground rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none"
              )}
            >
              {msg.content || (
                isLastAssistant && isLoading ? (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : null
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
