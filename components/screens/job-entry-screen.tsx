"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppHeader } from "@/components/app-header"

interface JobEntryScreenProps {
  onBack: () => void
  onNext: (jobId: string) => void
}

export function JobEntryScreen({ onBack, onNext }: JobEntryScreenProps) {
  const [jobId, setJobId] = useState("")

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader showBack onBack={onBack} title="New Measurement" />

      <div className="flex-1 flex flex-col px-7 pt-10">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-foreground tracking-tight leading-tight">
            Enter Lead ID
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Enter the lead ID assigned to this measurement site before you begin.
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <label htmlFor="jobId" className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
            Lead ID
          </label>
          <Input
            id="jobId"
            type="text"
            placeholder="e.g. LEAD-2026-001"
            value={jobId}
            onChange={(e) => setJobId(e.target.value.toUpperCase())}
            className="h-14 px-4 text-base bg-muted border-0 rounded-xl uppercase tracking-wide focus-visible:ring-1 focus-visible:ring-navy"
          />
        </div>

        {/* Mustard yellow CTA */}
        <Button
          onClick={() => onNext(jobId || "JOB-2026-001")}
          className="h-14 text-base font-semibold rounded-xl bg-mustard hover:bg-mustard/90 text-mustard-foreground tracking-wide"
        >
          Start Measurement
        </Button>
      </div>
    </div>
  )
}
