'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, ChevronDown } from 'lucide-react';
import api from '@/lib/axios';

type Message = {
  role: 'user' | 'model';
  parts: string;
  timestamp: Date;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('hirehub_ai_chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to session storage
  useEffect(() => {
    if (history.length > 0) {
      sessionStorage.setItem('hirehub_ai_chat', JSON.stringify(history));
    }
  }, [history]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping, isOpen]);

  const suggestedPrompts = [
    "Help me write a cover letter",
    "What jobs match my React skills?",
    "How do I prepare for interviews?",
    "Tips for salary negotiation",
    "How to improve my resume?",
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', parts: text, timestamp: new Date() };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput('');
    setIsTyping(true);

    try {
      const formattedHistory = history.map(h => ({
        role: h.role,
        parts: h.parts
      }));

      const res = await api.post('/ai/chat', { 
        message: text,
        history: formattedHistory
      });

      if (res.data.success && res.data.data.reply) {
        const aiMsg: Message = { role: 'model', parts: res.data.data.reply, timestamp: new Date() };
        setHistory(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = { 
        role: 'model', 
        parts: "Sorry, I'm having trouble connecting to the AI service right now. Please check if the Grok API Key is set correctly.", 
        timestamp: new Date() 
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 group hover:bg-primary/90 transition-colors"
        title="Career Assistant"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full border-2 border-background">
          AI
        </span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-card border border-border shadow-2xl rounded-3xl z-50 flex flex-col overflow-hidden max-w-[calc(100vw-3rem)]"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-primary rounded-full shadow-sm" title="Online" />
                </div>
                <div>
                  <h3 className="font-black text-sm leading-tight">HireHub AI</h3>
                  <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Career Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 scroll-smooth">
              {history.length === 0 ? (
                <div className="h-full flex flex-col justify-end space-y-4 pt-8">
                  <div className="text-center space-y-2 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-black text-foreground">How can I help you today?</h4>
                    <p className="text-xs text-muted-foreground font-medium px-4">
                      I'm your personal AI career agent powered by Grok 3 Mini. Ask me anything.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left px-4 py-2.5 bg-card hover:bg-muted border border-border text-sm font-medium text-foreground rounded-xl transition-colors shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-center text-muted-foreground/60 font-bold uppercase tracking-widest my-4">
                    Chat Started
                  </div>
                  {history.map((msg, i) => (
                    <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.role === 'model' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`p-3 rounded-2xl text-sm shadow-sm ${
                              msg.role === 'user'
                                ? 'bg-primary text-white rounded-tr-sm'
                                : 'bg-card border border-border text-foreground rounded-tl-sm'
                            }`}
                          >
                            <p className="whitespace-pre-wrap font-medium leading-relaxed">{msg.parts}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-bold mt-1.5 px-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex w-full justify-start">
                      <div className="flex gap-2 max-w-[85%] flex-row">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div className="p-4 bg-card border border-border rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-sm h-10 w-16">
                          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-card border-t border-border flex flex-col gap-2 shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex items-center gap-2 relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-muted/50 border border-input rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center disabled:opacity-50 transition-all hover:bg-primary/90"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
              <p className="text-[9px] text-center text-muted-foreground font-black uppercase tracking-widest mt-1">
                Powered by Grok 3 Mini ✦
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
