"use client"

import Image from "next/image"
import { ChevronLeft } from "lucide-react"

interface AppHeaderProps {
  showBack?: boolean
  onBack?: () => void
  title?: string
}

export function AppHeader({ showBack, onBack, title }: AppHeaderProps) {
  return (
    <header className="h-16 px-5 flex items-center gap-3 bg-background border-b border-border">
      {showBack && (
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors shrink-0"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" strokeWidth={2.5} />
        </button>
      )}
      {title ? (
        <h1 className="text-base font-semibold text-foreground tracking-tight">{title}</h1>
      ) : (
        <div className="flex-1 flex items-center gap-2.5">
          <Image
            src="/birla-opus-logo.jpg"
            alt="Birla Opus Paints"
            width={90}
            height={40}
            className="object-contain h-9 w-auto"
          />
          <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-medium border-l border-border pl-2.5">
            Field Measurement
          </span>
        </div>
      )}
    </header>
  )
}
