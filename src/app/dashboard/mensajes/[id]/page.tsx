'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { MessageList } from '@/components/chat/message-list'
import { MessageInput } from '@/components/chat/message-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MoreVertical, MapPin, Home } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
    coverImage: string
  } | null
}

export default function ConversationPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const conversationId = params?.id as string

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user && conversationId) {
      fetchMessages()
      scrollToBottom()
    }
  }, [isAuthenticated, user, conversationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      setIsLoading(true)

      const [messagesRes, convRes] = await Promise.all([
        fetch(`/api/conversations/${conversationId}/messages`),
        fetch('/api/conversations'),
      ])

      if (messagesRes.ok) {
        const data = await messagesRes.json()
        setMessages(data.messages || [])
      }

      if (convRes.ok) {
        const data = await convRes.json()
        const currentConv = data.conversations?.find(
          (c: Conversation) => c.id === conversationId
        )
        setConversation(currentConv || null)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    try {
      setIsSending(true)

      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [...prev, data.message])
        setTimeout(scrollToBottom, 100)
      } else {
        throw new Error('Error sending message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error al enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setIsSending(false)
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Conversación no encontrada</p>
          <Link href="/dashboard/mensajes">
            <Button>Volver a mensajes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getListingTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      room: 'Habitación',
      apartment: 'Piso completo',
      studio: 'Estudio',
      shared: 'Compartir piso',
    }
    return types[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/mensajes">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>

              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.otherUser?.image || undefined} />
                <AvatarFallback>
                  {getInitials(conversation.otherUser?.name || '')}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="font-semibold text-gray-900">
                  {conversation.otherUser?.name || 'Usuario'}
                </h2>
                {conversation.listing && (
                  <Link
                    href={`/anuncio/${conversation.listing.id}`}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Home className="h-3 w-3" />
                    {conversation.listing.title}
                  </Link>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/anuncio/${conversation.listing?.id}`)}>
                  Ver anuncio
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Archivar conversación
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {conversation.listing && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {getListingTypeLabel(conversation.listing.type)}
                </span>
                <span className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {conversation.listing.city}
                </span>
                <span className="text-gray-900 font-semibold">
                  {conversation.listing.price}€/mes
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <MessageList
          messages={messages}
          currentUserId={user?.id || ''}
          otherUserName={conversation.otherUser?.name || ''}
        />
      )}

      <div ref={messagesEndRef} />

      {/* Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!conversation}
        isLoading={isSending}
      />
    </div>
  )
}
