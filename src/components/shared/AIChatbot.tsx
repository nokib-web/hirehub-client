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

      const response = await axios.post('/ai/chat', {
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
      {isOpen && (
        <div className="fixed z-[9999] bottom-24 right-6 
                        w-[calc(100vw-48px)] sm:w-[420px] 
                        h-[600px] max-h-[calc(100vh-160px)]
                        flex flex-col
                        bg-card/95 backdrop-blur-2xl
                        rounded-[2.5rem] 
                        shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]
                        border border-primary/20
                        overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">

          {/* Header - More Premium */}
          <div className="flex-shrink-0 flex items-center justify-between 
                          px-8 py-5 bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl 
                              flex items-center justify-center border border-white/30 shadow-lg">
                <Sparkles size={20} className="text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <p className="font-black text-xs uppercase tracking-[0.2em] opacity-80">System</p>
                <p className="font-black text-lg tracking-tight italic uppercase">HireHub AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-white/10 hover:bg-white/30 rounded-xl p-2 transition-all hover:rotate-90 active:scale-90 border border-white/20">
              <X size={20} />
            </button>
          </div>

          {/* Messages area — ONLY this scrolls */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            
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
              <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border-2 ${
                  msg.role === 'assistant' 
                    ? 'bg-primary border-primary/20 text-white' 
                    : 'bg-muted border-border text-foreground text-[10px] font-black uppercase'
                }`}>
                  {msg.role === 'assistant' ? <Sparkles size={14} /> : 'ME'}
                </div>
                <div className={`max-w-[80%] rounded-[1.5rem] px-5 py-4 text-sm font-medium leading-relaxed shadow-lg border
                  ${msg.role === 'user' 
                    ? 'bg-primary text-white border-transparent' 
                    : 'bg-muted/40 text-foreground border-border/60'
                  }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-60
                    ${msg.role === 'user' ? 'text-white' : 'text-muted-foreground'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start items-center gap-3">
                 <div className="p-3 bg-muted/40 rounded-2xl border border-border/60">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]"/>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]"/>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]"/>
                    </div>
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-primary animate-pulse">Computing...</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 p-8 border-t border-border/40 bg-card/80 backdrop-blur-md">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Talk to HireHub Assistant..."
                rows={1}
                className="flex-1 resize-none text-sm px-5 py-3.5 
                           rounded-2xl border-2 border-border/60
                           bg-muted/30
                           text-foreground
                           placeholder-muted-foreground/50
                           focus:outline-none focus:ring-4 
                           focus:ring-primary/5 focus:border-primary
                           max-h-32 overflow-y-auto transition-all"/>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-12 h-12 bg-primary 
                           hover:bg-primary/90 disabled:bg-muted 
                           disabled:cursor-not-allowed
                           text-white rounded-2xl 
                           flex items-center justify-center
                           transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                {isLoading 
                  ? <Loader2 size={20} className="animate-spin"/> 
                  : <Send size={20}/>}
              </button>
            </div>
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
