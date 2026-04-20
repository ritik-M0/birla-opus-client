"use client"

import { Calendar, ChevronRight, ClipboardList } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import type { Job } from "@/lib/types"

interface HistoryScreenProps {
  onBack: () => void
  jobs: Job[]
  onSelectJob: (job: Job) => void
}

export function HistoryScreen({ onBack, jobs, onSelectJob }: HistoryScreenProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader showBack onBack={onBack} title="History" />

      <div className="flex-1 px-5 pt-5 overflow-y-auto">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full pb-10">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">No records yet</p>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Completed measurements will appear here
            </p>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-4">
              {jobs.length} record{jobs.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-2.5">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-navy/20 hover:shadow-sm transition-all active:scale-[0.98] text-left"
                >
                  {/* Color badge */}
                  <div className="w-10 h-10 rounded-xl bg-navy/8 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-navy" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate mb-0.5">{job.leadId}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">{job.date}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs font-medium text-foreground">{job.paintableArea} sq.ft</span>
                    </div>
                  </div>

                  {/* Area figure */}
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-navy">{job.totalPaintableArea}</p>
                    <p className="text-[10px] text-muted-foreground">sq.ft</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
