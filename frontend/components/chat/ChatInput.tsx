"use client"

import { useRef, useState } from "react"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSubmit() {
    const trimmed = input.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setInput("")
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    // Auto-grow
    const el = e.target
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="px-4 py-3 border-t border-secondary/40 bg-background shrink-0">
      <div className="max-w-3xl mx-auto flex items-end gap-2 bg-muted/50 rounded-xl px-3 py-2 border border-secondary/40 focus-within:border-primary/60 transition-colors">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre candidatos, vagas ou processos seletivos..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:outline-none resize-none py-1.5 text-sm text-foreground placeholder:text-muted-foreground min-h-[36px] max-h-[160px] leading-relaxed"
        />
        <Button
          type="button"
          size="icon"
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="size-9 shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
      <p className="text-center text-[10px] text-muted-foreground mt-1.5">
        Enter para enviar · Shift+Enter para nova linha
      </p>
    </div>
  )
}
