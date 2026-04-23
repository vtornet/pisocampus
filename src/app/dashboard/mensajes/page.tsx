'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { ConversationItem } from '@/components/chat/conversation-item'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

export default function MensajesPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const activeConversationId = params?.id as string | undefined

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConversations()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter((conv) => {
        const userName = conv.otherUser?.name?.toLowerCase() || ''
        const lastMessage = conv.messages?.[0]?.content.toLowerCase() || ''
        const listingTitle = conv.listing?.title.toLowerCase() || ''

        return (
          userName.includes(searchQuery.toLowerCase()) ||
          lastMessage.includes(searchQuery.toLowerCase()) ||
          listingTitle.includes(searchQuery.toLowerCase())
        )
      })
      setFilteredConversations(filtered)
    } else {
      setFilteredConversations(conversations)
    }
  }, [searchQuery, conversations])

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/conversations')

      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
        setFilteredConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Mensajes</h1>
              <p className="text-gray-600">
                {filteredConversations.length} conversación{filteredConversations.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No se encontraron conversaciones' : 'Aún no tienes mensajes'}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Prueba con otros términos de búsqueda'
                  : 'Cuando contactes con un anunciante, las conversaciones aparecerán aquí.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversationId === conversation.id}
                currentUserId={user?.id || ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
