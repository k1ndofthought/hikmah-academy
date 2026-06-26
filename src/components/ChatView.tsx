/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, Send, BookOpen, Bot, User, HelpCircle, Loader2, RefreshCw } from 'lucide-react';
import { Message, MessageReference } from '../types';

interface ChatViewProps {
  onReciteRefVerse: (surahNumber: number, verseNumber: number) => void;
}

export default function ChatView({ onReciteRefVerse }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Welcome to the Academy. I can provide comparative analysis between classical Islamic texts and modern scholarly perspectives. What would you like to explore?',
      timestamp: '10:41 AM'
    },
    {
      id: 'init-user-1',
      sender: 'user',
      text: 'Can you explain the concept of Tawhid as discussed in the recently added article "Unity in Diversity"?',
      timestamp: '10:42 AM'
    },
    {
      id: 'init-bot-2',
      sender: 'bot',
      text: 'In the article "Unity in Diversity", Tawhid is presented not just as the oneness of God, but as the foundational principle that creates cosmic harmony. The author references Surah Al-Ikhlas:',
      timestamp: '10:42 AM',
      reference: {
        surahName: "Surah Al-Ikhlas",
        surahNumber: 112,
        verseNumber: 1,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translation: "Say, He is Allah, [who is] One."
      }
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionChips = [
    "Ask about Surah Al-Baqarah",
    "Tell me about Monotheism",
    "Explain 'Fitra'"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const formatTime = () => {
    const d = new Date();
    let hrs = d.getHours();
    const mins = d.getMinutes();
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12; // the hour '0' should be '12'
    const minutesStr = mins < 10 ? '0' + mins : mins;
    return `${hrs}:${minutesStr} ${ampm}`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Create user message object
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: formatTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      // Map message history to required role-text structure for API
      // Exclude greeting banner and format correctly
      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'bot',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error('Communication error with the server');
      }

      const data = await res.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.text,
        timestamp: formatTime(),
        reference: data.reference
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      
      // Fallback fallback response to keep UX polished
      const errorMsg: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "I apologize, my connection to our libraries was briefly interrupted. Please ensure the GEMINI_API_KEY is configured in your Secrets panel, or try asking about 'Tawhid' or 'Fitra' which are supported offline.",
        timestamp: formatTime()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate speaking dictation after 2.5 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInputText("Could you explain the spiritual significance of the word Al-Fatiha?");
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto relative overflow-hidden">
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto pt-4 pb-4 space-y-6 px-1 no-scrollbar scroll-smooth">
        
        {/* System Context Welcome Banner */}
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex gap-3 items-start shadow-xs">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <p className="text-xs font-semibold leading-relaxed text-primary">
            Assalamu Alaikum. I am your scholarly assistant, grounded in Hikmah Academy's curated articles and the Holy Quran. How can I help your studies today?
          </p>
        </div>

        {/* Message Thread */}
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          const hasRef = !!msg.reference;

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1.5 max-w-[85%] ${
                isBot ? 'items-start' : 'items-end ml-auto'
              }`}
            >
              
              {/* Message Header Sender Label */}
              {isBot && (
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wide text-primary">
                    Hikmah Scholar
                  </span>
                </div>
              )}

              {/* Message content bubble */}
              <div
                className={`p-4 rounded-2xl leading-relaxed text-sm ${
                  !isBot
                    ? 'bg-primary/10 border border-primary/10 text-primary rounded-tr-none font-medium'
                    : hasRef
                    ? 'bg-white border-l-4 border-[#fe932c] text-gray-800 shadow-xs space-y-4 rounded-tl-none border-t border-r border-b border-gray-200/50'
                    : 'bg-primary text-white rounded-tl-none font-medium shadow-md'
                }`}
              >
                {/* Paragraph Parser */}
                <div className="space-y-3">
                  {msg.text.split('\n\n').map((para, pIdx) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;

                    // Bullet points parsing
                    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.includes('\n* ') || trimmed.includes('\n- ')) {
                      return (
                        <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-xs">
                          {trimmed.split('\n').map((li, lIdx) => (
                            <li key={lIdx}>{li.replace(/^[-*]\s*/, '')}</li>
                          ))}
                        </ul>
                      );
                    }

                    // Bold formatting replacement
                    return (
                      <p key={pIdx}>
                        {trimmed.split('**').map((part, partIdx) => {
                          return partIdx % 2 === 1 ? (
                            <strong key={partIdx} className={isBot && !hasRef ? 'text-secondary-fixed' : 'text-primary font-bold'}>
                              {part}
                            </strong>
                          ) : (
                            part
                          );
                        })}
                      </p>
                    );
                  })}
                </div>

                {/* Structured Verse Reference Card if exists inside AI Scholar reply */}
                {isBot && msg.reference && (
                  <div className="bg-gray-50 border border-gray-200/60 p-4 rounded-xl text-right mt-3 relative overflow-hidden group">
                    {/* Arabic Verse */}
                    <p className="font-serif text-xl md:text-2xl text-primary font-semibold tracking-wide leading-loose mb-2" style={{ direction: 'rtl' }}>
                      {msg.reference.text}
                    </p>
                    
                    {/* Verse Translation and metadata header */}
                    <div className="flex justify-between items-center gap-4 border-t border-gray-200/50 pt-2.5">
                      
                      {/* Recite Ref FAB */}
                      <button 
                        onClick={() => msg.reference && onReciteRefVerse(msg.reference.surahNumber, msg.reference.verseNumber)}
                        className="bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1.5 transition-all shadow-xs"
                        title="Recite this Verse"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>Surah {msg.reference.surahNumber}:{msg.reference.verseNumber}</span>
                      </button>

                      <span className="text-[10px] italic text-gray-500 max-w-[180px] truncate">
                        "{msg.reference.translation}"
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Timestamp */}
              <span className={`text-[9px] font-semibold text-gray-400 px-1 ${!isBot ? 'mr-1' : 'ml-9'}`}>
                {msg.timestamp}
              </span>

            </div>
          );
        })}

        {/* Thinking Pulse Loader */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-1 items-start max-w-[85%]"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-[11px] font-bold text-gray-400">
                  Consulting texts...
                </span>
              </div>
              <div className="bg-gray-100 border border-gray-200/60 p-3 rounded-2xl rounded-tl-none flex items-center justify-center gap-1.5">
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="h-2 w-2 bg-primary rounded-full" />
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="h-2 w-2 bg-primary rounded-full" />
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="h-2 w-2 bg-primary rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Anchor point */}
        <div ref={chatEndRef} />

      </div>

      {/* Suggestions Chips & Input Deck */}
      <div className="bg-gray-50/95 backdrop-blur-md pt-2 pb-3 border-t border-gray-100 space-y-3 relative z-10">
        
        {/* Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all duration-200 shadow-xs cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 p-1.5 pr-3 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all">
          <input
            type="text"
            placeholder={isRecording ? "Listening to your voice..." : "Explore sacred knowledge..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            disabled={isThinking || isRecording}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-3 py-3 text-sm text-gray-800 placeholder:text-gray-400"
          />
          
          <div className="flex gap-1 items-center">
            
            {/* Simulated Voice Mic */}
            <button
              onClick={handleMicClick}
              className={`p-2.5 rounded-xl transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'text-gray-400 hover:text-primary hover:bg-gray-100'
              }`}
              title="Voice Input"
            >
              <Mic className="h-4.5 w-4.5" />
            </button>

            {/* Submit Button */}
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={isThinking || isRecording || !inputText.trim()}
              className="bg-primary hover:bg-[#002117] text-white p-2.5 rounded-xl flex items-center justify-center hover:shadow-md active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 cursor-pointer"
              title="Send Message"
            >
              <Sparkles className="h-4.5 w-4.5" />
            </button>

          </div>
        </div>

        <p className="text-[10px] text-center text-gray-400 font-medium">
          Hikmah Scholar AI insights are synthesized for education and should be verified with canonical texts.
        </p>

      </div>

    </div>
  );
}
