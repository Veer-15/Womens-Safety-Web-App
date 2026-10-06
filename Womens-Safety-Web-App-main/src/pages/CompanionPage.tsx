import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  PhoneCall,
  Navigation,
  CheckCircle2,
  RefreshCw,
  AlertOctagon,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { GeolocationState } from '../hooks/useGeolocation.ts';
import { aiService } from '../services/api.ts';
import { Amenity, AIQueryResponse } from '../types.ts';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  intent?: 'AMENITY_SEARCH' | 'SAFETY_ADVICE' | 'GENERAL';
  groundedPlaces?: Amenity[];
  timestamp: string;
}

interface CompanionPageProps {
  geoState: GeolocationState;
}

export const CompanionPage: React.FC<CompanionPageProps> = ({ geoState }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: 'Namaste! I am your Sakhi AI Safety Companion. I am retrieval-grounded to provide verified local amenities, emergency helplines, and immediate reassuring safety advice. How can I help you right now?',
      intent: 'GENERAL',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'Find 24/7 pharmacies near me',
    'Where is the nearest police station?',
    'I feel unsafe, what should I do?',
    'Nearest metro with women coach',
    'Emergency helpline for harassment',
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || loading) return;

    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response: AIQueryResponse = await aiService.query(messageContent, {
        latitude: geoState.latitude,
        longitude: geoState.longitude,
      });

      const assistantMsg: Message = {
        id: `msg_asst_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        intent: response.intent,
        groundedPlaces: response.groundedPlaces,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI Companion query failed:', err);
      const errorMsg: Message = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        text: 'I am here with you. If you are facing an active emergency, please dial 112 (National Emergency) or 1090 (Women Power Line) immediately, or tap the Emergency SOS button on your dashboard.',
        intent: 'SAFETY_ADVICE',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                Sakhi AI Safety Companion
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Grounded In Real Places
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Answers strictly using verified local amenities around your GPS coordinates
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Verified Engine Active</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 overflow-y-auto space-y-4 shadow-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2.5">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 text-right ${
                    msg.sender === 'user' ? 'text-rose-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Grounded Places Cards embedded in Assistant Chat Bubbles */}
              {msg.groundedPlaces && msg.groundedPlaces.length > 0 && (
                <div className="space-y-2 mt-2">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Verified Safe Locations Near You:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {msg.groundedPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs hover:border-rose-400 transition-all flex flex-col justify-between text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">{place.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-rose-50 text-rose-700 rounded-md font-semibold uppercase">
                                {place.type}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-0.5">{place.address}</p>
                          </div>
                          <span className="text-[11px] font-bold text-rose-600 shrink-0 bg-rose-50 px-2 py-0.5 rounded-full">
                            {place.distanceKm} km
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {place.isOpen ? '● 24/7 Open' : 'Contact for timings'}
                          </span>
                          <div className="flex gap-2">
                            <a
                              href={`tel:${place.phone}`}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1"
                            >
                              <PhoneCall className="w-3 h-3 text-rose-600" />
                              <span>{place.phone}</span>
                            </a>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Route</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-rose-600" />
              <span>Scanning verified nearby amenities and crafting advice...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none shrink-0">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="text-xs px-3 py-1.5 bg-white border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 rounded-full font-medium whitespace-nowrap shadow-xs transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-2xl shadow-xs shrink-0"
      >
        <input
          type="text"
          placeholder="Ask Sakhi (e.g., 'Find nearest police desk' or 'I feel unsafe')..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent border-0 focus:outline-hidden text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-xs shrink-0"
          aria-label="Send query to Sakhi AI"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
