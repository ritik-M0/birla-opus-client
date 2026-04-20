"use client"

import Image from "next/image"

export function LoadingScreen() {
  return (
    <div className="flex flex-col h-full bg-white items-center justify-center gap-12">
      {/* Official Birla Opus logo */}
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/birla-opus-logo.jpg"
          alt="Birla Opus Paints"
          width={220}
          height={220}
          className="object-contain"
          priority
        />
        <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
          Field Measurement App
        </p>
      </div>

      {/* Three pulsing dots using actual logo brand colors: teal, mustard, orange, purple */}
      <div className="flex items-center gap-3">
        <span
          className="w-3 h-3 rounded-full bg-[#1da462] animate-pulse"
          style={{ animationDelay: "0ms", animationDuration: "900ms" }}
        />
        <span
          className="w-3 h-3 rounded-full bg-[#f5a623] animate-pulse"
          style={{ animationDelay: "200ms", animationDuration: "900ms" }}
        />
        <span
          className="w-3 h-3 rounded-full bg-[#e8541a] animate-pulse"
          style={{ animationDelay: "400ms", animationDuration: "900ms" }}
        />
        <span
          className="w-3 h-3 rounded-full bg-[#7b5ea7] animate-pulse"
          style={{ animationDelay: "600ms", animationDuration: "900ms" }}
        />
      </div>
    </div>
  )
}
