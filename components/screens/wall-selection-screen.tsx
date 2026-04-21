"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Camera,
  SquareDashedBottom,
  Lock,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import type { Room, Surface, Wall, Ceiling } from "@/lib/types";

interface WallSelectionScreenProps {
  room: Room;
  onBack: () => void;
  onSelectSurface: (surface: Surface) => void;
  onRoomChange: (updatedRoom: Room) => void;
  onProceed?: () => void;
}

export function WallSelectionScreen({
  room,
  onBack,
  onSelectSurface,
  onRoomChange,
  onProceed,
}: WallSelectionScreenProps) {
  const [localRoom, setLocalRoom] = useState<Room>(room);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const walls = localRoom.walls;
  const ceiling = localRoom.ceiling;

  const isWallUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    return walls.slice(0, index).every((w) => w.status === "completed");
  };

  const isCeilingUnlocked = (): boolean =>
    walls.every((w) => w.status === "completed");

  const allComplete =
    walls.every((w) => w.status === "completed") &&
    (!ceiling || ceiling.status === "completed");

  const update = (updated: Room) => {
    setLocalRoom(updated);
    onRoomChange(updated);
  };

  // Add wall
  const handleAddWall = () => {
    const newId = Date.now();
    const newWall: Wall = {
      id: newId,
      name: `Wall ${walls.length + 1}`,
      type: "wall",
      status: "not-started",
    };
    update({ ...localRoom, walls: [...walls, newWall] });
  };

  // Remove last unlocked/not-started wall
  const handleRemoveWall = (id: number) => {
    update({ ...localRoom, walls: walls.filter((w) => w.id !== id) });
  };

  // Add ceiling
  const handleAddCeiling = () => {
    if (ceiling) return;
    const newCeiling: Ceiling = {
      id: Date.now(),
      name: "Ceiling",
      type: "ceiling",
      status: "not-started",
    };
    update({ ...localRoom, ceiling: newCeiling });
  };

  // Remove ceiling (only if not started)
  const handleRemoveCeiling = () => {
    update({ ...localRoom, ceiling: undefined });
  };

  // Start rename
  const startRename = (id: number, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
  };

  // Commit rename
  const commitRename = () => {
    if (renamingId === null) return;
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }

    if (ceiling && renamingId === ceiling.id) {
      update({ ...localRoom, ceiling: { ...ceiling, name: trimmed } });
    } else {
      update({
        ...localRoom,
        walls: walls.map((w) =>
          w.id === renamingId ? { ...w, name: trimmed } : w,
        ),
      });
    }
    setRenamingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader showBack onBack={onBack} title={localRoom.name} />

      <div className="flex-1 px-5 pt-5 overflow-y-auto pb-6">
        {/* Walls section header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase">
            Walls
          </p>
          <button
            onClick={handleAddWall}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy/8 hover:bg-navy/15 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-navy" />
            <span className="text-xs font-semibold text-navy">Add Wall</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {walls.map((surface, index) => {
            const unlocked = isWallUnlocked(index);
            const canRemove =
              surface.status === "not-started" && walls.length > 1;
            return (
              <SurfaceCard
                key={`wall-${surface.id}`}
                surface={surface}
                unlocked={unlocked}
                onSelect={onSelectSurface}
                canRemove={canRemove}
                onRemove={() => handleRemoveWall(surface.id)}
                isRenaming={renamingId === surface.id}
                renameValue={renameValue}
                onStartRename={() => startRename(surface.id, surface.name)}
                onRenameChange={setRenameValue}
                onRenameCommit={commitRename}
                onRenameCancel={() => setRenamingId(null)}
              />
            );
          })}
        </div>

        {/* Ceiling section */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase">
            Ceiling
          </p>
          {!ceiling && (
            <button
              onClick={handleAddCeiling}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy/8 hover:bg-navy/15 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-navy" />
              <span className="text-xs font-semibold text-navy">
                Add Ceiling
              </span>
            </button>
          )}
        </div>

        {ceiling ? (
          <CeilingCard
            ceiling={ceiling}
            unlocked={isCeilingUnlocked()}
            onSelect={onSelectSurface}
            canRemove={ceiling.status === "not-started"}
            onRemove={handleRemoveCeiling}
            isRenaming={renamingId === ceiling.id}
            renameValue={renameValue}
            onStartRename={() => startRename(ceiling.id, ceiling.name)}
            onRenameChange={setRenameValue}
            onRenameCommit={commitRename}
            onRenameCancel={() => setRenamingId(null)}
          />
        ) : (
          <div className="w-full flex items-center justify-center p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground">
            <span className="text-sm">No ceiling added</span>
          </div>
        )}

        {allComplete && (
          <div className="mt-5 p-4 bg-success/8 border border-success/20 rounded-2xl flex items-center gap-3 mb-5">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            <p className="text-sm font-semibold text-success">
              All surfaces measured
            </p>
          </div>
        )}

        {allComplete && onProceed && (
          <Button
            onClick={onProceed}
            className="h-14 w-full text-base font-semibold rounded-xl bg-navy hover:bg-navy/90 text-navy-foreground tracking-wide"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

function SurfaceCard({
  surface,
  unlocked,
  onSelect,
  canRemove,
  onRemove,
  isRenaming,
  renameValue,
  onStartRename,
  onRenameChange,
  onRenameCommit,
  onRenameCancel,
}: {
  surface: Surface;
  unlocked: boolean;
  onSelect: (s: Surface) => void;
  canRemove: boolean;
  onRemove: () => void;
  isRenaming: boolean;
  renameValue: string;
  onStartRename: () => void;
  onRenameChange: (v: string) => void;
  onRenameCommit: () => void;
  onRenameCancel: () => void;
}) {
  const done = surface.status === "completed";
  const locked = !unlocked && !done;

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
        done
          ? "bg-success/5 border-success"
          : locked
            ? "bg-muted/40 border-border opacity-60"
            : "bg-card border-border"
      }`}
    >
      {/* Top-right controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {done && <CheckCircle2 className="w-4 h-4 text-success" />}
        {locked && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
        {!done && !locked && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartRename();
            }}
            className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center"
            aria-label="Rename"
          >
            <Pencil className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
        {canRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-6 h-6 rounded-md hover:bg-destructive/10 flex items-center justify-center"
            aria-label="Remove wall"
          >
            <Trash2 className="w-3 h-3 text-destructive" />
          </button>
        )}
      </div>

      {/* Tap area */}
      <button
        onClick={() => unlocked && onSelect(surface)}
        disabled={locked}
        className="flex flex-col items-center w-full mt-1"
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            done ? "bg-success/10" : locked ? "bg-muted" : "bg-navy/8"
          }`}
        >
          {locked ? (
            <Lock className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Camera
              className={`w-5 h-5 ${done ? "text-success" : "text-navy"}`}
            />
          )}
        </div>

        {isRenaming ? (
          <div
            className="flex items-center gap-1 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onRenameCommit();
                if (e.key === "Escape") onRenameCancel();
              }}
              className="w-full text-xs font-semibold text-center bg-muted rounded-md px-1 py-0.5 outline-none border border-navy/30"
            />
            <button onClick={onRenameCommit} className="shrink-0">
              <Check className="w-3 h-3 text-success" />
            </button>
            <button onClick={onRenameCancel} className="shrink-0">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <p
            className={`text-sm font-semibold text-center ${locked ? "text-muted-foreground" : "text-foreground"}`}
          >
            {surface.name}
          </p>
        )}

        <p
          className={`text-xs mt-0.5 ${done ? "text-success" : "text-muted-foreground"}`}
        >
          {done
            ? `${surface.measurements?.paintableArea ?? 0} sq.ft`
            : locked
              ? "Locked"
              : "Not started"}
        </p>
      </button>
    </div>
  );
}

function CeilingCard({
  ceiling,
  unlocked,
  onSelect,
  canRemove,
  onRemove,
  isRenaming,
  renameValue,
  onStartRename,
  onRenameChange,
  onRenameCommit,
  onRenameCancel,
}: {
  ceiling: Surface;
  unlocked: boolean;
  onSelect: (s: Surface) => void;
  canRemove: boolean;
  onRemove: () => void;
  isRenaming: boolean;
  renameValue: string;
  onStartRename: () => void;
  onRenameChange: (v: string) => void;
  onRenameCommit: () => void;
  onRenameCancel: () => void;
}) {
  const done = ceiling.status === "completed";
  const locked = !unlocked && !done;

  return (
    <div
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
        done
          ? "bg-success/5 border-success active:scale-[0.98]"
          : locked
            ? "bg-muted/40 border-border opacity-60 cursor-not-allowed"
            : "bg-card border-border hover:border-navy/30 active:scale-[0.98]"
      }`}
      onClick={() => unlocked && onSelect(ceiling)}
      style={{ cursor: locked ? "not-allowed" : "pointer" }}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          done ? "bg-success/10" : locked ? "bg-muted" : "bg-navy/8"
        }`}
      >
        {locked ? (
          <Lock className="w-5 h-5 text-muted-foreground" />
        ) : (
          <SquareDashedBottom
            className={`w-5 h-5 ${done ? "text-success" : "text-navy"}`}
          />
        )}
      </div>

      <div className="flex-1 text-left">
        {isRenaming ? (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onRenameCommit();
                if (e.key === "Escape") onRenameCancel();
              }}
              className="flex-1 text-sm font-semibold bg-muted rounded-md px-2 py-0.5 outline-none border border-navy/30"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRenameCommit();
              }}
            >
              <Check className="w-3.5 h-3.5 text-success" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRenameCancel();
              }}
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <p
            className={`text-sm font-semibold ${locked ? "text-muted-foreground" : "text-foreground"}`}
          >
            {ceiling.name}
          </p>
        )}
        <p
          className={`text-xs mt-0.5 ${done ? "text-success" : "text-muted-foreground"}`}
        >
          {done
            ? `${ceiling.measurements?.paintableArea ?? 0} sq.ft paintable`
            : locked
              ? "Complete all walls first"
              : "Not started"}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {!done && !locked && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartRename();
            }}
            className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center"
          >
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
        {canRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center"
          >
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
        )}
        {done ? (
          <CheckCircle2 className="w-5 h-5 text-success" />
        ) : locked ? (
          <Lock className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Camera className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
