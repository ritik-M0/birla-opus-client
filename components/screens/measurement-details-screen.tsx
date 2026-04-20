"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import type { Job } from "@/lib/types"

interface MeasurementDetailsScreenProps {
  job: Job
  onBack: () => void
}

export function MeasurementDetailsScreen({ job, onBack }: MeasurementDetailsScreenProps) {
  const [expandedRooms, setExpandedRooms] = useState<string[]>([])

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    )
  }

  // Calculate totals
  const totals = job.rooms.reduce(
    (acc, room) => {
      let roomWallTotal = 0
      let roomCeilingTotal = 0

      room.walls.forEach((wall) => {
        if (wall.measurements) {
          acc.totalWallArea += wall.measurements.totalArea
          acc.paintableArea += wall.measurements.paintableArea
          acc.nonPaintableArea += wall.measurements.nonPaintableArea
          acc.blockedArea += wall.measurements.blockedArea
          roomWallTotal += wall.measurements.paintableArea
        }
      })

      if (room.ceiling?.measurements) {
        acc.totalCeilingArea += room.ceiling.measurements.totalArea
        acc.paintableArea += room.ceiling.measurements.paintableArea
        acc.nonPaintableArea += room.ceiling.measurements.nonPaintableArea
        acc.blockedArea += room.ceiling.measurements.blockedArea
        roomCeilingTotal += room.ceiling.measurements.paintableArea
      }

      return acc
    },
    { totalWallArea: 0, totalCeilingArea: 0, paintableArea: 0, nonPaintableArea: 0, blockedArea: 0 }
  )

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader showBack onBack={onBack} title="Measurement Details" />

      <div className="flex-1 px-5 py-5 overflow-y-auto">
        {/* Section 1: Lead Info */}
        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-3">
            Lead Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-xs text-muted-foreground">Lead ID</span>
              <span className="text-sm font-semibold text-foreground">{job.leadId}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-xs text-muted-foreground">Date</span>
              <span className="text-sm font-semibold text-foreground">{job.date}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-xs text-muted-foreground">Rooms</span>
              <span className="text-sm font-semibold text-foreground">{job.rooms?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Room-wise Breakdown */}
        {job.rooms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-3">
              Room Breakdown
            </h3>
            <div className="space-y-2">
              {job.rooms.map((room) => {
                const isExpanded = expandedRooms.includes(room.id)
                const roomWallTotal = room.walls.reduce(
                  (sum, wall) => sum + (wall.measurements?.paintableArea || 0),
                  0
                )
                const roomCeilingTotal = room.ceiling?.measurements?.paintableArea || 0
                const roomTotal = roomWallTotal + roomCeilingTotal

                return (
                  <div key={room.id} className="border border-border rounded-xl overflow-hidden">
                    {/* Room Header */}
                    <button
                      onClick={() => toggleRoom(room.id)}
                      className="w-full flex items-center justify-between p-3 bg-card hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-foreground">{room.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{roomTotal} sq.ft paintable</p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Room Details */}
                    {isExpanded && (
                      <div className="px-3 py-3 bg-background/50 border-t border-border space-y-1.5">
                        {room.walls.map((wall, idx) => (
                          <div key={wall.id} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{wall.name}</span>
                            <span className="font-medium text-foreground">
                              {wall.measurements?.paintableArea || 0} sq.ft
                            </span>
                          </div>
                        ))}
                        {room.ceiling && (
                          <div className="flex items-center justify-between text-xs border-t border-border/50 pt-1.5 mt-1.5">
                            <span className="text-muted-foreground">Ceiling</span>
                            <span className="font-medium text-foreground">
                              {room.ceiling.measurements?.paintableArea || 0} sq.ft
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section 3: Summary */}
        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-3">
            Summary
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-navy/5 rounded-xl border border-navy/10">
              <span className="text-xs text-navy/80">Total Wall Area</span>
              <span className="text-sm font-bold text-navy">{totals.totalWallArea} sq.ft</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-navy/5 rounded-xl border border-navy/10">
              <span className="text-xs text-navy/80">Total Ceiling Area</span>
              <span className="text-sm font-bold text-navy">{totals.totalCeilingArea} sq.ft</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/5 rounded-xl border border-success/20">
              <span className="text-xs text-success/80">Total Paintable Area</span>
              <span className="text-sm font-bold text-success">{totals.paintableArea} sq.ft</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-xs text-muted-foreground">Non-Paintable Area</span>
              <span className="text-sm font-semibold text-foreground">{totals.nonPaintableArea} sq.ft</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <span className="text-xs text-muted-foreground">Blocked Area</span>
              <span className="text-sm font-semibold text-foreground">{totals.blockedArea} sq.ft</span>
            </div>
          </div>
        </div>

        {/* Optional Actions */}
        <div className="mb-6 flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full h-12 text-sm font-semibold rounded-xl border-border hover:border-navy/30"
          >
            View Images
          </Button>
        </div>
      </div>
    </div>
  )
}
