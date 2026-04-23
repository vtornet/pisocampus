'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { User, MapPin } from 'lucide-react'

interface Conversation {
  id: string
  updatedAt: Date
  unreadCount: number
  otherUser: {
    id: string
    name: string
    image?: string | null
  } | null
  listing?: {
    id: string
    title: string
    city: string
    type: string
    price: number
  } | null
  messages?: Array<{
    id: string
    content: string
    createdAt: Date
    senderId: string
  }>
}

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  currentUserId: string
}

export function ConversationItem({
  conversation,
  isActive,
  currentUserId,
}: ConversationItemProps) {
  const lastMessage = conversation.messages?.[0]
  const isOtherUserSender = lastMessage?.senderId !== currentUserId

  return (
    <Link href={`/dashboard/mensajes/${conversation.id}`}>
      <Card
        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
          isActive ? 'bg-blue-50 border-blue-300' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversation.otherUser?.image || undefined} />
            <AvatarFallback>
              {conversation.otherUser?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {conversation.otherUser?.name || 'Usuario'}
              </h3>
              {lastMessage && (
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatDistanceToNow(new Date(lastMessage.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              )}
            </div>

            {conversation.listing && (
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{conversation.listing.title}</span>
              </div>
            )}

            <p className="text-sm text-gray-600 truncate">
              {lastMessage ? (
                <>
                  {isOtherUserSender && <span className="font-medium">Ellos: </span>}
                  {lastMessage.content}
                </>
              ) : (
                <span className="text-gray-400">Sin mensajes aún</span>
              )}
            </p>
          </div>

          {conversation.unreadCount > 0 && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
