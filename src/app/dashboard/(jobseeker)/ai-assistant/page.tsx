'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  BrainCircuit, 
  Zap,
  Target,
  FileText
} from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your HireHub Career Assistant. How can I help you optimize your job search today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { 
        message: userMessage,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });
      
      const assistantMessage = response.data.data.reply;
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (err) {
      toast.error('AI is resting right now. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Hello! I'm your HireHub Career Assistant. How can I help you optimize your job search today?" }]);
  };

  return (
    <ProtectedRoute allowedRoles={['jobseeker']}>
      <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] min-h-[600px] flex flex-col gap-6">
        {/* Header Section - Compact */}
        <div className="flex items-center justify-between gap-4 px-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-wider border border-primary/20">
              <Sparkles className="w-2.5 h-2.5" /> Intelligence Core
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight italic uppercase">Career Assistant</h1>
          </div>
          
          <Button 
            variant="outline" 
            onClick={clearChat}
            className="h-10 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest px-4 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20"
          >
            Clear History
          </Button>
        </div>

        {/* Chat Dialog Container */}
        <div className="flex-1 bg-card/50 backdrop-blur-xl border border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden flex flex-col relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar z-10">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border-2 shadow-lg ${
                    msg.role === 'assistant' 
                      ? 'bg-primary border-primary/20 text-white' 
                      : 'bg-muted border-border text-foreground font-black'
                  }`}>
                    {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : 'ME'}
                  </div>
                  <div className={`max-w-[75%] rounded-[1.5rem] p-6 text-sm font-medium leading-relaxed shadow-xl border ${
                    msg.role === 'assistant' 
                      ? 'bg-card border-border/60 text-foreground' 
                      : 'bg-primary text-white border-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 text-primary">
                 <div className="flex gap-1 p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Synthesizing...</span>
              </motion.div>
            )}
          </div>

          {/* Footer area - Input & Action Chips */}
          <div className="p-6 md:p-8 bg-card/80 border-t border-border/40 z-10">
            {/* Quick Actions - More compact */}
            {messages.length === 1 && (
              <div className="mb-6 flex flex-wrap gap-3">
                 {[
                   { label: 'Optimize Cover Letter', icon: FileText, cmd: 'Help me improve my cover letter for a Developer role.' },
                   { label: 'Career Roadmap', icon: Target, cmd: 'What career paths fits a React/Node developer?' },
                   { label: 'Interview Prep', icon: BrainCircuit, cmd: 'Ask me some tough interview questions.' },
                 ].map(item => (
                   <button 
                    key={item.label}
                    onClick={() => { setInput(item.cmd); handleSend(); }}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-card/50 border border-border rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all text-left text-[10px] font-black uppercase tracking-wider"
                   >
                     <item.icon className="w-3.5 h-3.5 text-primary" /> {item.label}
                   </button>
                 ))}
              </div>
            )}

            <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="w-full h-16 pl-6 pr-20 rounded-2xl bg-muted/30 border-2 border-border/60 font-bold text-base outline-none focus:ring-4 focus:ring-primary/5 focus:bg-background focus:border-primary transition-all shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2.5 top-2.5 bottom-2.5 px-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> <span className="hidden sm:inline">Send</span>
                </button>
             </div>
             <p className="text-center mt-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                Hi-Tech Intelligence Powered by Grok Mini
             </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
