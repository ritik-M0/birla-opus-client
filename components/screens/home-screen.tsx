"use client"

import { Ruler, Clock } from "lucide-react"
import { AppHeader } from "@/components/app-header"

interface HomeScreenProps {
  onMeasureNew: () => void
  onHistory: () => void
}

const greetingCardStyle = `
  .greeting-card {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.85) 0%,
      rgba(29, 164, 98, 0.12) 40%,
      rgba(232, 84, 26, 0.1) 70%,
      rgba(123, 94, 167, 0.12) 100%
    );
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(29, 164, 98, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.4);
  }
`

export function HomeScreen({ onMeasureNew, onHistory }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader />
      <style>{greetingCardStyle}</style>

      {/* Personalized greeting with Birla Opus brand colors - frosted glass effect */}
      <div 
        className="greeting-card mx-5 mt-6 mb-5 px-6 py-7 rounded-3xl relative overflow-hidden"
      >
        {/* Flowing gradient blob background - top right (green) */}
        <div 
          className="absolute top-0 right-0 pointer-events-none" 
          style={{ 
            width: '280px', 
            height: '280px',
            background: 'radial-gradient(circle, rgba(29, 164, 98, 0.2) 0%, rgba(29, 164, 98, 0) 70%)',
            filter: 'blur(40px)',
            transform: 'translate(80px, -80px)'
          }} 
        />
        {/* Flowing gradient blob - bottom left (yellow/orange) */}
        <div 
          className="absolute bottom-0 left-0 pointer-events-none" 
          style={{ 
            width: '240px', 
            height: '240px',
            background: 'radial-gradient(circle, rgba(232, 84, 26, 0.16) 0%, rgba(232, 84, 26, 0) 70%)',
            filter: 'blur(36px)',
            transform: 'translate(-60px, 60px)'
          }} 
        />
        {/* Accent blob - top left (orange) */}
        <div 
          className="absolute top-0 left-0 pointer-events-none" 
          style={{ 
            width: '160px', 
            height: '160px',
            background: 'radial-gradient(circle, rgba(232, 84, 26, 0.14) 0%, rgba(232, 84, 26, 0) 70%)',
            filter: 'blur(32px)',
            transform: 'translate(-40px, -40px)'
          }} 
        />
        {/* Accent blob - bottom right (purple) */}
        <div 
          className="absolute bottom-0 right-0 pointer-events-none" 
          style={{ 
            width: '200px', 
            height: '200px',
            background: 'radial-gradient(circle, rgba(123, 94, 167, 0.18) 0%, rgba(123, 94, 167, 0) 70%)',
            filter: 'blur(34px)',
            transform: 'translate(50px, 50px)'
          }} 
        />

        {/* Text content - positioned above blobs */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '32px', letterSpacing: '-0.5px' }}>Hi Tushar! 👋</h1>
          <p className="text-foreground/70 mt-2.5 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px', letterSpacing: '0.25px' }}>Ready to start a new measurement?</p>
        </div>
      </div>

      {/* Main action cards */}
      <div className="flex-1 flex flex-col px-5 pt-5 gap-4">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase font-semibold mb-3">Actions</p>

          <button
            onClick={onMeasureNew}
            className="w-full flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-navy/20 hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-navy/8 flex items-center justify-center shrink-0">
              <Ruler className="w-6 h-6 text-navy" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-base font-semibold text-foreground leading-tight">Measure New Site</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Start a new measurement job</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-mustard flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        <button
          onClick={onHistory}
          className="w-full flex items-center gap-4 p-5 bg-card rounded-2xl border border-border hover:border-navy/20 hover:shadow-sm transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-base font-semibold text-foreground leading-tight">Measurement History</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Review past site records</p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="pb-5">
        <p className="text-center text-[11px] text-muted-foreground/40 tracking-wide">
          Made with love by 1000xdevs
        </p>
      </div>
    </div>
  )
}
