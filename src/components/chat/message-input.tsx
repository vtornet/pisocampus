'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export function MessageInput({ onSendMessage, disabled, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          title="Adjuntar archivo (próximamente)"
          disabled
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
          disabled={disabled || isLoading}
          rows={1}
          className="min-h-[44px] max-h-32 resize-none"
          style={{
            height: 'auto',
            minHeight: '44px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = Math.min(target.scrollHeight, 128) + 'px'
          }}
        />

        <Button
          type="submit"
          disabled={!message.trim() || disabled || isLoading}
          size="icon"
          className="flex-shrink-0 h-11 w-11"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
