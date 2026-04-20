"use client"

import { useState, useEffect } from "react"
import { MobileFrame } from "@/components/mobile-frame"
import { LoadingScreen } from "@/components/screens/loading-screen"
import { LoginScreen } from "@/components/screens/login-screen"
import { HomeScreen } from "@/components/screens/home-screen"
import { JobEntryScreen } from "@/components/screens/job-entry-screen"
import { RoomSelectionScreen } from "@/components/screens/room-selection-screen"
import { WallSelectionScreen } from "@/components/screens/wall-selection-screen"
import { CameraCaptureScreen } from "@/components/screens/camera-capture-screen"
import { MeasurementResultScreen } from "@/components/screens/measurement-result-screen"
import { SummaryScreen } from "@/components/screens/summary-screen"
import { SubmissionSuccessScreen } from "@/components/screens/submission-success-screen"
import { HistoryScreen } from "@/components/screens/history-screen"
import { MeasurementDetailsScreen } from "@/components/screens/measurement-details-screen"
import type { Screen, Room, Surface, SurfaceMeasurement, Job } from "@/lib/types"

type AppScreen = Screen | "loading"

const makeDefaultWalls = () => [
  { id: 1, name: "Wall 1", type: "wall" as const, status: "not-started" as const },
  { id: 2, name: "Wall 2", type: "wall" as const, status: "not-started" as const },
  { id: 3, name: "Wall 3", type: "wall" as const, status: "not-started" as const },
  { id: 4, name: "Wall 4", type: "wall" as const, status: "not-started" as const },
]

const initialRooms: Room[] = [
  {
    id: "hall",
    name: "Hall",
    walls: makeDefaultWalls(),
    ceiling: { id: 5, name: "Ceiling", type: "ceiling", status: "not-started" },
  },
  {
    id: "bedroom",
    name: "Bedroom",
    walls: makeDefaultWalls(),
    ceiling: { id: 5, name: "Ceiling", type: "ceiling", status: "not-started" },
  },
  {
    id: "kitchen",
    name: "Kitchen",
    walls: makeDefaultWalls(),
    ceiling: { id: 5, name: "Ceiling", type: "ceiling", status: "not-started" },
  },
]

const sampleHistory: Job[] = [
  {
    id: "JOB-001",
    leadId: "LEAD-2024-042",
    date: "Apr 10, 2026",
    paintableArea: 1245,
    totalArea: 1400,
    rooms: [],
  },
  {
    id: "JOB-002",
    leadId: "LEAD-2024-041",
    date: "Apr 8, 2026",
    paintableArea: 892,
    totalArea: 950,
    rooms: [],
  },
  {
    id: "JOB-003",
    leadId: "LEAD-2024-039",
    date: "Apr 5, 2026",
    paintableArea: 1567,
    totalArea: 1750,
    rooms: [],
  },
]

export default function BirlaOpusApp() {
  const [screen, setScreen] = useState<AppScreen>("loading")

  useEffect(() => {
    const t = setTimeout(() => setScreen("login"), 2200)
    return () => clearTimeout(t)
  }, [])

  const [leadId, setLeadId] = useState("")
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedSurface, setSelectedSurface] = useState<Surface | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const handleLogin = () => setScreen("home")

  const handleMeasureNew = () => setScreen("job-entry")

  const handleHistory = () => setScreen("history")

  const handleStartJob = (id: string) => {
    setLeadId(id)
    setRooms(initialRooms)
    setScreen("room-selection")
  }

  const handleSelectRoom = (room: Room) => {
    // Always use the latest version of the room from state
    const latest = rooms.find((r) => r.id === room.id) || room
    setSelectedRoom(latest)
    setScreen("wall-selection")
  }

  const handleRoomChange = (updatedRoom: Room) => {
    setRooms((prev) => prev.map((r) => r.id === updatedRoom.id ? updatedRoom : r))
    setSelectedRoom(updatedRoom)
  }

  const handleRenameRoom = (roomId: string, newName: string) => {
    setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, name: newName } : r))
  }

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId))
  }

  const handleSelectWall = (surface: Surface) => {
    setSelectedSurface(surface)
    setScreen("camera-capture")
  }

  const handleCapture = () => setScreen("measurement-result")

  const handleSaveSurface = (measurements: SurfaceMeasurement) => {
    if (selectedRoom && selectedSurface) {
      if (selectedSurface.type === "wall") {
        setRooms((prev) =>
          prev.map((room) =>
            room.id === selectedRoom.id
              ? {
                  ...room,
                  walls: room.walls.map((wall) =>
                    wall.id === selectedSurface.id
                      ? { ...wall, status: "completed" as const, measurements }
                      : wall
                  ),
                }
              : room
          )
        )
        setSelectedRoom((prev) =>
          prev
            ? {
                ...prev,
                walls: prev.walls.map((wall) =>
                  wall.id === selectedSurface.id
                    ? { ...wall, status: "completed" as const, measurements }
                    : wall
                ),
              }
            : null
        )
      } else if (selectedSurface.type === "ceiling") {
        setRooms((prev) =>
          prev.map((room) =>
            room.id === selectedRoom.id && room.ceiling
              ? { ...room, ceiling: { ...room.ceiling, status: "completed" as const, measurements } }
              : room
          )
        )
        setSelectedRoom((prev) =>
          prev && prev.ceiling
            ? { ...prev, ceiling: { ...prev.ceiling, status: "completed" as const, measurements } }
            : prev
        )
      }
      setScreen("wall-selection")
    }
  }

  const handleAddRoom = (type: "interior" | "exterior") => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: type === "exterior" ? "Exterior" : `Room ${rooms.length + 1}`,
      walls: makeDefaultWalls(),
      ceiling: { id: 5, name: "Ceiling", type: "ceiling", status: "not-started" },
    }
    setRooms((prev) => [...prev, newRoom])
  }

  const handleViewSummary = () => setScreen("summary")

  const handleSelectJobFromHistory = (job: Job) => {
    setSelectedJob(job)
    setScreen("measurement-details")
  }

  const handleSubmit = () => setScreen("submission-success")

  const handleGoHomeAfterSubmit = () => {
    setRooms(initialRooms)
    setLeadId("")
    setScreen("home")
  }

  const renderScreen = () => {
    switch (screen) {
      case "loading":
        return <LoadingScreen />

      case "login":
        return <LoginScreen onLogin={handleLogin} />

      case "home":
        return <HomeScreen onMeasureNew={handleMeasureNew} onHistory={handleHistory} />

      case "job-entry":
        return (
          <JobEntryScreen
            onBack={() => setScreen("home")}
            onNext={handleStartJob}
          />
        )

      case "room-selection":
        return (
          <RoomSelectionScreen
            onBack={() => setScreen("job-entry")}
            onSelectRoom={handleSelectRoom}
            onAddRoom={handleAddRoom}
            onRenameRoom={handleRenameRoom}
            onDeleteRoom={handleDeleteRoom}
            rooms={rooms}
            onViewSummary={handleViewSummary}
          />
        )

      case "wall-selection":
        return selectedRoom ? (
          <WallSelectionScreen
            room={selectedRoom}
            onBack={() => setScreen("room-selection")}
            onSelectSurface={handleSelectWall}
            onRoomChange={handleRoomChange}
            onProceed={() => setScreen("room-selection")}
          />
        ) : null

      case "camera-capture":
        return selectedSurface ? (
          <CameraCaptureScreen
            surface={selectedSurface}
            onBack={() => setScreen("wall-selection")}
            onCapture={handleCapture}
          />
        ) : null

      case "measurement-result":
        return selectedSurface ? (
          <MeasurementResultScreen
            surface={selectedSurface}
            onBack={() => setScreen("camera-capture")}
            onSave={handleSaveSurface}
          />
        ) : null

      case "summary":
        return (
          <SummaryScreen
            leadId={leadId}
            rooms={rooms}
            onBack={() => setScreen("room-selection")}
            onEdit={() => setScreen("room-selection")}
            onSubmit={handleSubmit}
          />
        )

      case "submission-success":
        return (
          <SubmissionSuccessScreen
            leadId={leadId}
            onGoHome={handleGoHomeAfterSubmit}
            onViewMeasurement={() => setScreen("summary")}
          />
        )

      case "history":
        return (
          <HistoryScreen
            onBack={() => setScreen("home")}
            jobs={sampleHistory}
            onSelectJob={handleSelectJobFromHistory}
          />
        )

      case "measurement-details":
        return selectedJob ? (
          <MeasurementDetailsScreen job={selectedJob} onBack={() => setScreen("history")} />
        ) : null

      default:
        return null
    }
  }

  return <MobileFrame>{renderScreen()}</MobileFrame>
}
