"use client"

import { Pencil, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import type { Room } from "@/lib/types"

interface SummaryScreenProps {
  leadId: string
  rooms: Room[]
  onBack: () => void
  onEdit: () => void
  onSubmit: () => void
}

export function SummaryScreen({ leadId, rooms, onBack, onEdit, onSubmit }: SummaryScreenProps) {
  const totals = rooms.reduce(
    (acc, room) => {
      room.walls.forEach((wall) => {
        if (wall.measurements) {
          acc.totalWallArea += wall.measurements.totalArea
          acc.paintableArea += wall.measurements.paintableArea
          acc.nonPaintableArea += wall.measurements.nonPaintableArea
          acc.blockedArea += wall.measurements.blockedArea
        }
      })
      if (room.ceiling?.measurements) {
        acc.totalCeilingArea += room.ceiling.measurements.totalArea
        acc.paintableArea += room.ceiling.measurements.paintableArea
        acc.nonPaintableArea += room.ceiling.measurements.nonPaintableArea
        acc.blockedArea += room.ceiling.measurements.blockedArea
      }
      return acc
    },
    { totalWallArea: 0, totalCeilingArea: 0, paintableArea: 0, nonPaintableArea: 0, blockedArea: 0 }
  )

  const summaryRows = [
    { label: "Total Wall Area", value: totals.totalWallArea, dot: "bg-navy" },
    ...(totals.totalCeilingArea > 0
      ? [{ label: "Total Ceiling Area", value: totals.totalCeilingArea, dot: "bg-navy/40" }]
      : []),
    { label: "Paintable Area", value: totals.paintableArea, dot: "bg-success" },
    { label: "Non-Paintable Area", value: totals.nonPaintableArea, dot: "bg-mustard" },
    { label: "Blocked Area", value: totals.blockedArea, dot: "bg-muted-foreground" },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader showBack onBack={onBack} title="Summary" />

      <div className="flex-1 px-5 pt-5 overflow-y-auto">
        {/* Lead ID banner */}
        <div className="mb-5 px-4 py-4 bg-navy rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-navy-foreground/50 text-[10px] tracking-widest uppercase">Lead ID</p>
            <p className="text-navy-foreground text-base font-bold tracking-tight mt-0.5">{leadId}</p>
          </div>
          <div className="text-right">
            <p className="text-navy-foreground/50 text-[10px] tracking-widest uppercase">Total Rooms</p>
            <p className="text-mustard text-base font-bold mt-0.5">{rooms.length}</p>
          </div>
        </div>

        {/* Summary rows */}
        <div className="space-y-2.5 mb-6">
          {summaryRows.map(({ label, value, dot }) => (
            <div key={label} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {value} <span className="text-xs font-normal text-muted-foreground">sq.ft</span>
              </span>
            </div>
          ))}
        </div>

        {/* Room breakdown */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-3">Room Breakdown</p>
          <div className="space-y-2">
            {rooms.map((room) => {
              const wallTotal = room.walls.reduce((a, w) => a + (w.measurements?.paintableArea || 0), 0)
              const ceilTotal = room.ceiling?.measurements?.paintableArea || 0
              const total = wallTotal + ceilTotal

              return (
                <div key={room.id} className="flex items-center justify-between px-4 py-3 bg-muted rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-foreground">{room.name}</p>
                    {ceilTotal > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Walls: {wallTotal} sq.ft &middot; Ceiling: {ceilTotal} sq.ft
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-foreground">{total} sq.ft</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 pt-3 flex gap-3">
        <Button
          onClick={onEdit}
          variant="outline"
          className="flex-1 h-14 rounded-xl border-border text-foreground text-sm font-semibold"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-[2] h-14 rounded-xl bg-mustard hover:bg-mustard/90 text-mustard-foreground text-base font-semibold tracking-wide"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit
        </Button>
      </div>
    </div>
  )
}
