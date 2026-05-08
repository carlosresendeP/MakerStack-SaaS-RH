"use client"

import { useChatStream } from "@/hooks/useChatStream"
import { MessageList } from "@/components/chat/MessageList"
import { ChatInput } from "@/components/chat/ChatInput"
import { Sparkles, BarChart2, Mail, ArrowLeftRight } from "lucide-react"

const SUGGESTIONS = [
  { icon: BarChart2,        text: "Resumir os pontos fortes dos candidatos desta semana." },
  { icon: Mail,             text: "Rascunhar e-mail de feedback para candidato reprovado." },
  { icon: ArrowLeftRight,   text: "Comparar os requisitos da vaga com os candidatos aprovados." },
]

export default function ChatPage() {
  const { messages, sendMessage, isLoading } = useChatStream()

  return (
    <div className="flex flex-col h-full -m-6 bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-secondary/40 flex items-center gap-3 shrink-0">
        <div className="size-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <Sparkles className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-base text-foreground">Chat IA</h1>
          <p className="text-xs text-muted-foreground">Assistente de recrutamento</p>
        </div>
      </header>

      {/* Messages or empty state */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Como posso ajudar hoje?</h2>
            <p className="text-sm text-muted-foreground">Selecione uma sugestão ou comece a digitar.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
            {SUGGESTIONS.map(({ icon: Icon, text }) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                disabled={isLoading}
                className="text-left p-4 rounded-xl bg-card border border-secondary/40 hover:border-primary/40 hover:bg-muted/40 transition-all group flex flex-col gap-3"
              >
                <Icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-foreground leading-snug">{text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <MessageList messages={messages} isLoading={isLoading} />
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
