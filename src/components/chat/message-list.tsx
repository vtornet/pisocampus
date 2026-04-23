'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Message {
  id: string
  content: string
  createdAt: Date
  read: boolean
  senderId: string
  sender: {
    id: string
    name: string
    image?: string | null
  }
}

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  otherUserName?: string
}

export function MessageList({ messages, currentUserId, otherUserName }: MessageListProps) {
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isSameSender = (currentMsg: Message, prevMsg: Message | undefined) => {
    if (!prevMsg) return false
    return currentMsg.senderId === prevMsg.senderId
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Inicia la conversación enviando un mensaje</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const isOwn = message.senderId === currentUserId
          const prevMessage = messages[index - 1]
          const showAvatar = !isSameSender(message, prevMessage) || (!isOwn && index === 0)

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {showAvatar && (
                  <Avatar className={`h-8 w-8 flex-shrink-0 ${isOwn ? 'ml-2' : 'mr-2'}`}>
                    <AvatarImage src={message.sender.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(message.sender.name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div>
                  {!isOwn && showAvatar && (
                    <p className="text-xs text-gray-600 mb-1 ml-1">
                      {message.sender.name}
                    </p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                    {isOwn && (
                      <span className="ml-1">
                        {message.read ? '· Leído' : '· Enviado'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
