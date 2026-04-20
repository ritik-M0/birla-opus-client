"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import type { SurfaceMeasurement } from "@/lib/types"

export interface Opening {
  id: string
  type: "window" | "door" | "fixture"
  label: string
  // position as % of wall width/height (0–1)
  x: number
  y: number
  // size as % of wall width/height (0–1)
  w: number
  h: number
}

interface WallDiagramProps {
  measurements: SurfaceMeasurement
  surfaceName: string
}

const OPENING_COLORS: Record<Opening["type"], { bg: string; border: string; text: string }> = {
  window: { bg: "rgba(148, 211, 255, 0.5)", border: "#60b4e8", text: "#1a6fa0" },
  door: { bg: "rgba(245, 166, 35, 0.25)", border: "#d4881a", text: "#8a5200" },
  fixture: { bg: "rgba(180, 180, 180, 0.3)", border: "#999", text: "#555" },
}

const PRESET_OPENINGS: Omit<Opening, "id">[] = [
  { type: "window", label: "Window", x: 0.12, y: 0.22, w: 0.22, h: 0.32 },
  { type: "door",   label: "Door",   x: 0.68, y: 0.38, w: 0.20, h: 0.62 },
]

function generateId() {
  return Math.random().toString(36).slice(2, 8)
}

export function WallDiagram({ measurements, surfaceName }: WallDiagramProps) {
  const [openings, setOpenings] = useState<Opening[]>(
    PRESET_OPENINGS.map((o) => ({ ...o, id: generateId() }))
  )

  const paintablePct = measurements.totalArea > 0
    ? Math.round((measurements.paintableArea / measurements.totalArea) * 100)
    : 0
  const nonPaintablePct = 100 - paintablePct

  const removeOpening = (id: string) => {
    setOpenings((prev) => prev.filter((o) => o.id !== id))
  }

  const addOpening = (type: Opening["type"]) => {
    const labels: Record<Opening["type"], string> = {
      window: "Window",
      door: "Door",
      fixture: "Fixture",
    }
    setOpenings((prev) => [
      ...prev,
      {
        id: generateId(),
        type,
        label: labels[type],
        x: 0.1 + Math.random() * 0.5,
        y: type === "door" ? 0.38 : 0.15 + Math.random() * 0.25,
        w: type === "door" ? 0.18 : 0.2,
        h: type === "door" ? 0.62 : 0.28,
      },
    ])
  }

  // Diagram dimensions (SVG viewport)
  const VW = 320
  const VH = 200

  // Wall outline inset
  const PAD = 16

  const wallX = PAD
  const wallY = PAD
  const wallW = VW - PAD * 2
  const wallH = VH - PAD * 2

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">{surfaceName}</p>
          <p className="text-sm font-bold text-foreground mt-0.5">Visual Breakdown</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#c8ecd4]" />
            <span className="text-[11px] text-muted-foreground font-medium">Paintable {paintablePct}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#f5d5a8]" />
            <span className="text-[11px] text-muted-foreground font-medium">Non-paintable {nonPaintablePct}%</span>
          </div>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="px-4">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full"
          style={{ maxHeight: 200 }}
        >
          {/* Wall background - paintable area (soft green) */}
          <rect
            x={wallX} y={wallY} width={wallW} height={wallH}
            rx={8} ry={8}
            fill="#d6f0df"
            stroke="#a8d8b8"
            strokeWidth={1.5}
          />

          {/* Floor line */}
          <line
            x1={wallX} y1={wallY + wallH}
            x2={wallX + wallW} y2={wallY + wallH}
            stroke="#a8d8b8" strokeWidth={3} strokeLinecap="round"
          />

          {/* Dimension label: width */}
          <text
            x={wallX + wallW / 2} y={VH - 2}
            textAnchor="middle" fontSize={9}
            fill="#888" fontFamily="Inter, sans-serif"
          >
            {measurements.totalArea} sq.ft total
          </text>

          {/* Openings */}
          {openings.map((o) => {
            const ox = wallX + o.x * wallW
            const oy = wallY + o.y * wallH
            const ow = o.w * wallW
            const oh = o.h * wallH
            const colors = OPENING_COLORS[o.type]

            return (
              <g key={o.id}>
                {/* Opening fill */}
                <rect
                  x={ox} y={oy} width={ow} height={oh}
                  rx={4} ry={4}
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth={1.5}
                  strokeDasharray={o.type === "window" ? "4 2" : "none"}
                />
                {/* Label */}
                <text
                  x={ox + ow / 2}
                  y={oy + oh / 2 - 5}
                  textAnchor="middle"
                  fontSize={9}
                  fill={colors.text}
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {o.label}
                </text>
                {/* Remove button */}
                <g
                  style={{ cursor: "pointer" }}
                  onClick={() => removeOpening(o.id)}
                >
                  <circle cx={ox + ow - 6} cy={oy + 6} r={7} fill="white" stroke={colors.border} strokeWidth={1} />
                  <text
                    x={ox + ow - 6} y={oy + 10}
                    textAnchor="middle" fontSize={10}
                    fill={colors.border}
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                  >
                    ×
                  </text>
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Add opening buttons */}
      <div className="flex items-center gap-2 px-4 pb-4 pt-2">
        <span className="text-[11px] text-muted-foreground font-medium">Add:</span>
        {(["window", "door", "fixture"] as Opening["type"][]).map((type) => (
          <button
            key={type}
            onClick={() => addOpening(type)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-muted hover:bg-secondary text-[11px] font-medium text-foreground capitalize transition-colors"
          >
            <Plus className="w-3 h-3" />
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}
