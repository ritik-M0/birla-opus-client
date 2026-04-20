export type Screen =
  | "login"
  | "home"
  | "job-entry"
  | "room-selection"
  | "wall-selection"
  | "camera-capture"
  | "measurement-result"
  | "summary"
  | "history"
  | "measurement-details"
  | "submission-success"

export type MeasurementStatus = "not-started" | "completed"
export type SurfaceType = "wall" | "ceiling"
export type JobType = "interior" | "exterior" | "both"

export interface Surface {
  id: number
  name: string
  type: SurfaceType
  status: MeasurementStatus
  measurements?: SurfaceMeasurement
}

export interface Wall extends Surface {
  type: "wall"
}

export interface Ceiling extends Surface {
  type: "ceiling"
}

export interface BlockedObject {
  id: string
  name: string
  area: number
  addedToPaintable: boolean
}

export interface SurfaceMeasurement {
  totalArea: number
  paintableArea: number
  nonPaintableArea: number
  blockedArea: number
  blockedObjects?: BlockedObject[]
}

export type WallMeasurement = SurfaceMeasurement

export interface Room {
  id: string
  name: string
  walls: Wall[]
  ceiling?: Ceiling
}

export interface Job {
  id: string
  leadId: string
  date: string
  paintableArea: number
  totalArea?: number
  rooms?: Room[]
}
