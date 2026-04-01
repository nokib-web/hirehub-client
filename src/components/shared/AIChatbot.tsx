'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react'
import axios from '@/lib/axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  'Help me write a cover letter',
  'Tips for React developer resume',
  'How to prepare for interviews',
  'How to negotiate salary',
]

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: m.content
      }))

      const response = await axios.post('/api/ai/chat', {
        message: text.trim(),
        history
      })

      const aiMessage: Message = {
        role: 'assistant',
        content: response.data.data.reply,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I am having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* CHAT PANEL */}
      {isOpen && (
        <div className="fixed z-[9999] top-24 right-4 
                        w-[calc(100vw-32px)] sm:w-[380px] 
                        h-[500px] max-h-[calc(100vh-140px)]
                        flex flex-col
                        bg-white dark:bg-gray-900 
                        rounded-2xl 
                        shadow-[0_25px_50px_rgba(0,0,0,0.25)]
                        border border-gray-200 dark:border-gray-700
                        overflow-hidden chat-panel-safe">

          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between 
                          px-4 py-3 bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full 
                              flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="font-semibold text-sm">HireHub AI</p>
                <p className="text-xs text-blue-200">Powered by Grok</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages area — ONLY this scrolls */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            
            {/* Welcome state */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Hi! I am your AI career assistant. How can I help?
                </p>
                <div className="space-y-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="w-full text-left text-xs px-3 py-2 
                                 rounded-lg border border-gray-200 
                                 dark:border-gray-700
                                 hover:bg-blue-50 dark:hover:bg-blue-900/20
                                 hover:border-blue-300 
                                 text-gray-600 dark:text-gray-300
                                 transition-colors">
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                  }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 
                    ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"/>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"/>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"/>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area — never scrolls */}
          <div className="flex-shrink-0 p-3 border-t 
                          border-gray-200 dark:border-gray-700 
                          bg-white dark:bg-gray-900">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about jobs, resume, interviews..."
                rows={1}
                className="flex-1 resize-none text-sm px-3 py-2 
                           rounded-xl border border-gray-200 
                           dark:border-gray-600
                           bg-gray-50 dark:bg-gray-800
                           text-gray-900 dark:text-gray-100
                           placeholder-gray-400
                           focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent
                           max-h-24 overflow-y-auto"/>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-9 h-9 bg-blue-600 
                           hover:bg-blue-700 disabled:bg-gray-300 
                           disabled:cursor-not-allowed
                           text-white rounded-xl 
                           flex items-center justify-center
                           transition-colors">
                {isLoading 
                  ? <Loader2 size={16} className="animate-spin"/> 
                  : <Send size={16}/>}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Powered by Grok 3 Mini · Press Enter to send
            </p>
          </div>
        </div>
      )}

      {/* TOGGLE BUTTON — hidden when panel is open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-[9999] bottom-6 right-6
                     w-14 h-14 bg-blue-600 hover:bg-blue-700 
                     text-white rounded-full shadow-lg
                     flex items-center justify-center
                     transition-all hover:scale-110 active:scale-95">
          <Sparkles size={22}/>
        </button>
      )}
    </>
  )
}
