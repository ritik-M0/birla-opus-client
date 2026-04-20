"use client"

interface MobileFrameProps {
  children: React.ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
      <div className="w-full max-w-[390px] h-[844px] bg-background rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-hidden relative border-[10px] border-[#1a1f36]/8">
        {/* Status bar */}
        <div className="h-12 bg-background flex items-center justify-between px-8 pt-2">
          <span className="text-xs font-semibold text-foreground tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal */}
            <svg className="w-4 h-3 text-foreground" fill="currentColor" viewBox="0 0 17 12">
              <rect x="0" y="6" width="3" height="6" rx="0.5" opacity="0.4"/>
              <rect x="4.5" y="4" width="3" height="8" rx="0.5" opacity="0.6"/>
              <rect x="9" y="2" width="3" height="10" rx="0.5" opacity="0.8"/>
              <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
            </svg>
            {/* WiFi */}
            <svg className="w-4 h-3 text-foreground" fill="currentColor" viewBox="0 0 16 12">
              <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
              <path d="M8 6C6.1 6 4.38 6.76 3.1 8l1.42 1.42C5.4 8.53 6.64 8 8 8s2.6.53 3.48 1.42L12.9 8C11.62 6.76 9.9 6 8 6z" opacity="0.7"/>
              <path d="M8 2C5.16 2 2.61 3.13.72 5l1.42 1.42C3.73 4.78 5.75 4 8 4s4.27.78 5.86 2.42L15.28 5C13.39 3.13 10.84 2 8 2z" opacity="0.4"/>
            </svg>
            {/* Battery */}
            <svg className="w-6 h-3 text-foreground" fill="currentColor" viewBox="0 0 25 12">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none"/>
              <rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor"/>
              <path d="M23 4v4a2 2 0 000-4z"/>
            </svg>
          </div>
        </div>
        {/* Content */}
        <div className="h-[calc(100%-48px-34px)] overflow-y-auto">
          {children}
        </div>
        {/* Home indicator */}
        <div className="h-[34px] flex items-center justify-center">
          <div className="w-32 h-1 bg-foreground/15 rounded-full" />
        </div>
      </div>
    </div>
  )
}
