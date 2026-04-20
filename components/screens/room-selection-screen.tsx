"use client"

import { useState } from "react"
import { Plus, Home, Bed, ChefHat, Trees, ChevronRight, CheckCircle2, X, Building2, Pencil, Check, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import type { Room } from "@/lib/types"

interface RoomSelectionScreenProps {
  onBack: () => void
  onSelectRoom: (room: Room) => void
  onAddRoom: (type: "interior" | "exterior") => void
  onRenameRoom: (roomId: string, newName: string) => void
  onDeleteRoom: (roomId: string) => void
  rooms: Room[]
  onViewSummary: () => void
}

const roomIcons: Record<string, React.ReactNode> = {
  Hall: <Home className="w-5 h-5" />,
  Bedroom: <Bed className="w-5 h-5" />,
  Kitchen: <ChefHat className="w-5 h-5" />,
  Exterior: <Trees className="w-5 h-5" />,
}

function isRoomComplete(room: Room): boolean {
  const wallsDone = room.walls.every((w) => w.status === "completed")
  const ceilingDone = !room.ceiling || room.ceiling.status === "completed"
  return wallsDone && ceilingDone
}

export function RoomSelectionScreen({
  onBack,
  onSelectRoom,
  onAddRoom,
  onRenameRoom,
  onDeleteRoom,
  rooms,
  onViewSummary,
}: RoomSelectionScreenProps) {
  const [showModal, setShowModal] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const completedWalls = rooms.reduce(
    (acc, room) => acc + room.walls.filter((w) => w.status === "completed").length,
    0
  )
  const totalWalls = rooms.reduce((acc, room) => acc + room.walls.length, 0)
  const progress = totalWalls > 0 ? Math.round((completedWalls / totalWalls) * 100) : 0

  // Find the first incomplete room for the "Next Room" CTA
  const firstIncompleteRoom = rooms.find((r) => !isRoomComplete(r))
  const allRoomsComplete = rooms.length > 0 && rooms.every(isRoomComplete)

  const handleAddRoomType = (type: "interior" | "exterior") => {
    onAddRoom(type)
    setShowModal(false)
  }

  const startRename = (id: string, name: string) => {
    setRenamingId(id)
    setRenameValue(name)
  }

  const commitRename = (id: string) => {
    const trimmed = renameValue.trim()
    if (trimmed) onRenameRoom(id, trimmed)
    setRenamingId(null)
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      <AppHeader showBack onBack={onBack} title="Select Room" />

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-4">
        {/* Progress bar */}
        <div className="mb-5 p-4 bg-navy rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-foreground/70 text-xs tracking-widest uppercase font-semibold">Progress</span>
            <span className="text-navy-foreground text-sm font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-mustard rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-navy-foreground/50 text-xs mt-2">{completedWalls} of {totalWalls} walls done</p>
        </div>

        {/* Room list */}
        <div className="space-y-2.5">
          {rooms.map((room) => {
            const completed = room.walls.filter((w) => w.status === "completed").length
            const total = room.walls.length
            const isComplete = isRoomComplete(room)
            const isRenaming = renamingId === room.id

            return (
              <div
                key={room.id}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-navy/20 hover:shadow-sm transition-all"
              >
                <button
                  onClick={() => onSelectRoom(room)}
                  className="flex items-center gap-4 flex-1 text-left active:scale-[0.98] transition-transform"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isComplete ? "bg-success/10 text-success" : "bg-navy/8 text-navy"
                    }`}
                  >
                    {roomIcons[room.name] || <Home className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isRenaming ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(room.id)
                            if (e.key === "Escape") setRenamingId(null)
                          }}
                          className="flex-1 text-sm font-semibold bg-muted rounded-md px-2 py-0.5 outline-none border border-navy/30 max-w-[120px]"
                        />
                        <button onClick={() => commitRename(room.id)}>
                          <Check className="w-3.5 h-3.5 text-success" />
                        </button>
                        <button onClick={() => setRenamingId(null)}>
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="font-semibold text-foreground text-sm truncate">{room.name}</h3>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {completed}/{total} walls
                      {room.ceiling ? (room.ceiling.status === "completed" ? " · Ceiling done" : " · Ceiling pending") : ""}
                    </p>
                  </div>
                </button>

                {/* Rename icon */}
                {!isRenaming && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => startRename(room.id, room.name)}
                      className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center shrink-0"
                      aria-label="Rename room"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setDeletingId(room.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0"
                      aria-label="Delete room"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                )}

                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        {/* Add room */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 p-4 mt-3 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-navy/30 hover:text-navy transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Room</span>
        </button>
      </div>

      {/* Bottom CTAs */}
      <div className="px-5 pb-5 space-y-3">
        {/* Proceed to Next Room — shown when there is still an incomplete room */}
        {firstIncompleteRoom && (
          <Button
            onClick={() => onSelectRoom(firstIncompleteRoom)}
            className="w-full h-13 text-sm font-semibold rounded-xl bg-navy hover:bg-navy/90 text-navy-foreground tracking-wide flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Proceed: {firstIncompleteRoom.name}
          </Button>
        )}

        {/* View Summary — only shown when ALL rooms are complete */}
        {allRoomsComplete && (
          <Button
            onClick={onViewSummary}
            className="w-full h-14 text-base font-semibold rounded-xl bg-mustard hover:bg-mustard/90 text-mustard-foreground tracking-wide"
          >
            View Summary
          </Button>
        )}
      </div>

      {/* Add Room Type Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/40 flex items-end z-50" onClick={() => setShowModal(false)}>
          <div
            className="w-full bg-background rounded-t-3xl px-5 pt-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-foreground tracking-tight">Select Room Type</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAddRoomType("interior")}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-navy/30 hover:shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-navy/8 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-navy" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">Interior</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Hall, Bedroom, Kitchen etc.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>

              <button
                onClick={() => handleAddRoomType("exterior")}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-navy/30 hover:shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-navy/8 flex items-center justify-center shrink-0">
                  <Trees className="w-5 h-5 text-navy" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">Exterior</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Outer walls and facades</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Confirmation Modal */}
      {deletingId && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 px-5">
          <div className="w-full max-w-sm bg-background rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground tracking-tight">Delete Room?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete &quot;{rooms.find((r) => r.id === deletingId)?.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 h-11 rounded-xl bg-muted hover:bg-secondary text-foreground font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteRoom(deletingId)
                  setDeletingId(null)
                }}
                className="flex-1 h-11 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
