"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import type { SurfaceMeasurement } from "@/lib/types"

export interface CeilingFixture {
  id: string
  type: "light" | "vent" | "beam"
  label: string
  x: number
  y: number
  w: number
  h: number
}

interface CeilingDiagramProps {
  measurements: SurfaceMeasurement
  surfaceName: string
}

const FIXTURE_COLORS: Record<CeilingFixture["type"], { bg: string; border: string; text: string }> = {
  light:  { bg: "rgba(245, 166, 35, 0.28)", border: "#d4881a", text: "#8a5200" },
  vent:   { bg: "rgba(180, 180, 180, 0.32)", border: "#999",   text: "#555"    },
  beam:   { bg: "rgba(180, 120, 80, 0.22)", border: "#b47840", text: "#7a4010" },
}

const PRESET_FIXTURES: Omit<CeilingFixture, "id">[] = [
  { type: "light", label: "Light", x: 0.20, y: 0.22, w: 0.14, h: 0.22 },
  { type: "vent",  label: "Vent",  x: 0.64, y: 0.55, w: 0.18, h: 0.18 },
]

function generateId() {
  return Math.random().toString(36).slice(2, 8)
}

export function CeilingDiagram({ measurements, surfaceName }: CeilingDiagramProps) {
  const [fixtures, setFixtures] = useState<CeilingFixture[]>(
    PRESET_FIXTURES.map((f) => ({ ...f, id: generateId() }))
  )

  const paintablePct = measurements.totalArea > 0
    ? Math.round((measurements.paintableArea / measurements.totalArea) * 100)
    : 0
  const nonPaintablePct = 100 - paintablePct

  const removeFixture = (id: string) => {
    setFixtures((prev) => prev.filter((f) => f.id !== id))
  }

  const addFixture = (type: CeilingFixture["type"]) => {
    const labels: Record<CeilingFixture["type"], string> = {
      light: "Light",
      vent: "Vent",
      beam: "Beam",
    }
    setFixtures((prev) => [
      ...prev,
      {
        id: generateId(),
        type,
        label: labels[type],
        x: 0.1 + Math.random() * 0.6,
        y: 0.1 + Math.random() * 0.6,
        w: type === "beam" ? 0.65 : 0.15,
        h: type === "beam" ? 0.14 : 0.18,
      },
    ])
  }

  const VW = 320
  const VH = 200
  const PAD = 16
  const ceilX = PAD
  const ceilY = PAD
  const ceilW = VW - PAD * 2
  const ceilH = VH - PAD * 2

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">{surfaceName}</p>
          <p className="text-sm font-bold text-foreground mt-0.5">Top-View Breakdown</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#c8ecd4]" />
            <span className="text-[11px] text-muted-foreground font-medium">Paintable {paintablePct}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#f5d5a8]" />
            <span className="text-[11px] text-muted-foreground font-medium">Fixtures {nonPaintablePct}%</span>
          </div>
        </div>
      </div>

      {/* SVG Top-View Diagram */}
      <div className="px-4">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full"
          style={{ maxHeight: 200 }}
        >
          {/* Ceiling background — soft green for paintable area */}
          <rect
            x={ceilX} y={ceilY} width={ceilW} height={ceilH}
            rx={8} ry={8}
            fill="#d6f0df"
            stroke="#a8d8b8"
            strokeWidth={1.5}
          />

          {/* Hatching pattern around perimeter for wall border */}
          <rect
            x={ceilX + 6} y={ceilY + 6}
            width={ceilW - 12} height={ceilH - 12}
            rx={4} ry={4}
            fill="none"
            stroke="#a8d8b8"
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.6}
          />

          {/* Dimension label */}
          <text
            x={ceilX + ceilW / 2} y={VH - 2}
            textAnchor="middle" fontSize={9}
            fill="#888" fontFamily="Inter, sans-serif"
          >
            {measurements.totalArea} sq.ft total (top view)
          </text>

          {/* Fixtures */}
          {fixtures.map((f) => {
            const fx = ceilX + f.x * ceilW
            const fy = ceilY + f.y * ceilH
            const fw = f.w * ceilW
            const fh = f.h * ceilH
            const colors = FIXTURE_COLORS[f.type]

            return (
              <g key={f.id}>
                <rect
                  x={fx} y={fy} width={fw} height={fh}
                  rx={f.type === "light" ? fw / 2 : 4}
                  ry={f.type === "light" ? fh / 2 : 4}
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth={1.5}
                  strokeDasharray={f.type === "vent" ? "3 2" : "none"}
                />
                <text
                  x={fx + fw / 2} y={fy + fh / 2 + 4}
                  textAnchor="middle"
                  fontSize={9} fill={colors.text}
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {f.label}
                </text>
                {/* Remove button */}
                <g style={{ cursor: "pointer" }} onClick={() => removeFixture(f.id)}>
                  <circle cx={fx + fw - 5} cy={fy + 5} r={7} fill="white" stroke={colors.border} strokeWidth={1} />
                  <text
                    x={fx + fw - 5} y={fy + 9}
                    textAnchor="middle" fontSize={10}
                    fill={colors.border} fontWeight="700"
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

      {/* Add fixture buttons */}
      <div className="flex items-center gap-2 px-4 pb-4 pt-2">
        <span className="text-[11px] text-muted-foreground font-medium">Add:</span>
        {(["light", "vent", "beam"] as CeilingFixture["type"][]).map((type) => (
          <button
            key={type}
            onClick={() => addFixture(type)}
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
