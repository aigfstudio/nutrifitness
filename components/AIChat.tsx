'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Message = {
  role: 'user' | 'assistant'
  content: string
  products?: { name: string; slug: string; price: number }[]
}

type Step = 'name' | 'email' | 'city' | 'signup' | 'chat'

const PRODUCT_SUGGESTIONS: Record<string, { name: string; slug: string; price: number }[]> = {
  protein: [
    { name: 'Ultimate Whey Bigman 2KG', slug: 'ultimate-whey-bigman-2kg', price: 49.9 },
    { name: 'Protéine Vegan RIZ BRUN BIO 500G', slug: 'proteine-vegan-riz-brun-bio-500g', price: 34.9 },
  ],
  creatine: [
    { name: 'PW Creapure Premium 250G', slug: 'pw-creapure-premium-250g', price: 29.9 },
    { name: 'Creatine Monohydrate 300G', slug: 'creatine-monohydrate-300g', price: 19.9 },
  ],
  energy: [
    { name: 'ABE Drink Blue Lagoon', slug: 'abe-drink-blue-lagoon', price: 3.5 },
    { name: 'Ghost Pre-Workout 645G', slug: 'ghost-pre-workout-645g-blue-raspberry', price: 59.9 },
  ],
  weight: [
    { name: 'ZMA 90 Caps – Marvelous', slug: 'zma-90-caps', price: 24.9 },
    { name: 'Calcium 120 Tabs', slug: 'calcium-120-tabs', price: 14.9 },
  ],
}

function getProductSuggestions(text: string) {
  const t = text.toLowerCase()
  if (t.includes('protein') || t.includes('whey') || t.includes('muscle')) return PRODUCT_SUGGESTIONS.protein
  if (t.includes('creatine') || t.includes('strength') || t.includes('power')) return PRODUCT_SUGGESTIONS.creatine
  if (t.includes('energy') || t.includes('pre') || t.includes('workout') || t.includes('tired')) return PRODUCT_SUGGESTIONS.energy
  if (t.includes('weight') || t.includes('loss') || t.includes('fat') || t.includes('slim')) return PRODUCT_SUGGESTIONS.weight
  return null
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>('name')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userCity, setUserCity] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Welcome to NutriFitness! I\'m your personal supplement advisor.\n\nTo get started, what\'s your name?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const addMessage = (msg: Message) => setMessages(prev => [...prev, msg])

  const handleOnboarding = (value: string) => {
    addMessage({ role: 'user', content: value })

    if (step === 'name') {
      setUserName(value)
      setStep('email')
      setTimeout(() => addMessage({
        role: 'assistant',
        content: `Nice to meet you, ${value}! 💪\n\nWhat's your email address? (So we can send you exclusive deals)`
      }), 300)
    } else if (step === 'email') {
      setUserEmail(value)
      setStep('city')
      setTimeout(() => addMessage({
        role: 'assistant',
        content: `Perfect! And which city are you based in?`
      }), 300)
    } else if (step === 'city') {
      setUserCity(value)
      setStep('signup')
      setTimeout(() => addMessage({
        role: 'assistant',
        content: `Great, ${userName} from ${value}! 🎉\n\nCreate a free account to save your profile, track orders and get personalized recommendations!`
      }), 300)
    }
  }

  const handleChat = async (value: string) => {
    addMessage({ role: 'user', content: value })
    setIsLoading(true)

    await new Promise(r => setTimeout(r, 700))

    const suggestions = getProductSuggestions(value)
    const t = value.toLowerCase()
    let reply = ''

    if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
      reply = `Hey ${userName}! 👋 How can I help you today? I can recommend proteins, pre-workouts, creatine, vitamins and more from our store!`
    } else if (suggestions) {
      reply = `Based on your goal, here are my top picks from our store for you, ${userName}:`
    } else if (t.includes('price') || t.includes('cheap') || t.includes('budget')) {
      reply = `We have great value products starting from CHF 3.50! Check our full range at the shop. Would you like protein, creatine, or energy products?`
    } else if (t.includes('deliver') || t.includes('ship')) {
      reply = `We offer FREE shipping on orders over CHF 79! Orders ship within 24h from Switzerland. 🚚`
    } else if (t.includes('return') || t.includes('refund')) {
      reply = `We have a 30-day hassle-free return policy. Just contact us and we'll sort it out! 😊`
    } else {
      reply = `I'm here to help you find the perfect supplement! Tell me your goal — muscle gain, weight loss, energy, recovery — and I'll recommend the best products from our store for you, ${userName}! 💪`
    }

    addMessage({ role: 'assistant', content: reply, products: suggestions ?? undefined })
    setIsLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const val = input.trim()
    setInput('')
    if (step !== 'chat') {
      handleOnboarding(val)
    } else {
      handleChat(val)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#c8102e] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#a50d28] transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '520px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="p-4 bg-[#111] text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div>
              <div className="font-bold text-sm">NutriFitness AI Advisor</div>
              <div className="text-[10px] text-gray-400">Online · Replies instantly</div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#c8102e] text-white rounded-br-sm px-4 py-2.5'
                  : 'bg-white text-dark border border-gray-200 rounded-bl-sm shadow-sm px-4 py-3'
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br/>}</span>
                ))}
                {/* Product cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.products.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/products/${p.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:border-[#c8102e] hover:bg-red-50 transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-dark group-hover:text-[#c8102e] leading-tight">{p.name.slice(0, 30)}</div>
                          <div className="text-[11px] text-gray-500">CHF {p.price.toFixed(2)}</div>
                        </div>
                        <span className="text-[#c8102e] text-lg">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* Signup CTA */}
          {step === 'signup' && (
            <div className="bg-[#c8102e] rounded-xl p-4 text-white text-center space-y-2">
              <div className="text-sm font-bold">Create Your Free Account</div>
              <div className="text-xs opacity-80">Get exclusive deals & personalized tips</div>
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block bg-white text-[#c8102e] font-black text-xs px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                SIGN UP FREE →
              </Link>
              <button
                onClick={() => {
                  setStep('chat')
                  addMessage({ role: 'assistant', content: `Great ${userName}! Now tell me your fitness goal and I'll recommend the perfect supplements from our store! 💪\n\nTry asking about: Protein, Pre-Workout, Creatine, Weight Loss, Energy...` })
                }}
                className="text-[10px] underline opacity-70 hover:opacity-100"
              >
                Skip for now
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {step !== 'signup' && (
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white rounded-b-2xl flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                step === 'name' ? 'Your name...' :
                step === 'email' ? 'Your email...' :
                step === 'city' ? 'Your city...' :
                'Ask about supplements...'
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#c8102e] focus:ring-1 focus:ring-[#c8102e]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-[#c8102e] text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-[#a50d28] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </form>
        )}
      </div>
    </>
  )
}
