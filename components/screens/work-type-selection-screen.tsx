"use client"

import { Building2, Trees, Layers } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import type { JobType } from "@/lib/types"

interface WorkTypeSelectionScreenProps {
  onBack: () => void
  onSelectType: (type: JobType) => void
}

export function WorkTypeSelectionScreen({ onBack, onSelectType }: WorkTypeSelectionScreenProps) {
  const types: { id: JobType; label: string; description: string; icon: React.ReactNode }[] = [
    {
      id: "interior",
      label: "Interior Only",
      description: "Walls & ceilings inside the building",
      icon: <Building2 className="w-8 h-8" />,
    },
    {
      id: "exterior",
      label: "Exterior Only",
      description: "Walls outside the building",
      icon: <Trees className="w-8 h-8" />,
    },
    {
      id: "both",
      label: "Interior & Exterior",
      description: "Both interior and exterior measurements",
      icon: <Layers className="w-8 h-8" />,
    },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader showBack onBack={onBack} title="Job Type" />

      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground tracking-tight">What type of job is this?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select the scope of measurements you&apos;ll be taking
          </p>
        </div>

        {/* Type selection cards */}
        <div className="flex-1 flex flex-col gap-3">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className="p-4 rounded-2xl border-2 border-border bg-card hover:border-navy/30 hover:bg-navy/2 transition-all active:scale-[0.98] text-left"
            >
              <div className="flex items-start gap-4">
                <div className="text-navy mt-1 shrink-0">{type.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{type.label}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
