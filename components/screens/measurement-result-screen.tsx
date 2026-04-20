"use client";

import { useState } from "react";
import { Pencil, Check, X, Images, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/app-header";
import type { Surface, SurfaceMeasurement, BlockedObject } from "@/lib/types";

interface MeasurementResultScreenProps {
  surface: Surface;
  capturedPhotos?: string[];
  onBack: () => void;
  onSave: (measurements: SurfaceMeasurement) => void;
}

const defaultMeasurements: SurfaceMeasurement = {
  totalArea: 120,
  paintableArea: 96,
  nonPaintableArea: 14,
  blockedArea: 10,
  blockedObjects: [
    { id: "obj-1", name: "Sofa", area: 5, addedToPaintable: false },
    { id: "obj-2", name: "TV Unit", area: 3, addedToPaintable: false },
    { id: "obj-3", name: "Object 3", area: 2, addedToPaintable: false },
  ],
};

export function MeasurementResultScreen({
  surface,
  capturedPhotos = [],
  onBack,
  onSave,
}: MeasurementResultScreenProps) {
  const [measurements, setMeasurements] = useState<SurfaceMeasurement>(
    surface.measurements || defaultMeasurements,
  );
  const [editingField, setEditingField] = useState<
    keyof SurfaceMeasurement | null
  >(null);
  const [editValue, setEditValue] = useState("");
  const [showPhotos, setShowPhotos] = useState(false);
  const [editingObjectId, setEditingObjectId] = useState<string | null>(null);
  const [editingObjectField, setEditingObjectField] = useState<
    "name" | "area" | null
  >(null);
  const [editingObjectValue, setEditingObjectValue] = useState("");

  // Calculate effective blocked area (total minus objects added to paintable)
  const effectiveBlockedArea =
    (measurements.blockedObjects?.reduce((acc, obj) => {
      return acc + (obj.addedToPaintable ? 0 : obj.area);
    }, 0) ??
      0) ||
    measurements.blockedArea;

  // Calculate effective paintable area
  const addedToPaintableTotal =
    measurements.blockedObjects?.reduce((acc, obj) => {
      return acc + (obj.addedToPaintable ? obj.area : 0);
    }, 0) ?? 0;

  const effectivePaintable = measurements.paintableArea + addedToPaintableTotal;

  const handleEdit = (field: keyof SurfaceMeasurement) => {
    setEditingField(field);
    setEditValue(String(measurements[field]));
  };

  const handleSaveEdit = () => {
    if (editingField) {
      setMeasurements((prev) => ({
        ...prev,
        [editingField]: parseFloat(editValue) || 0,
      }));
      setEditingField(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleToggleBlockedObject = (objectId: string) => {
    setMeasurements((prev) => ({
      ...prev,
      blockedObjects: prev.blockedObjects?.map((obj) =>
        obj.id === objectId
          ? { ...obj, addedToPaintable: !obj.addedToPaintable }
          : obj,
      ),
    }));
  };

  const handleEditBlockedObject = (
    objectId: string,
    field: "name" | "area",
  ) => {
    const obj = measurements.blockedObjects?.find((o) => o.id === objectId);
    if (obj) {
      setEditingObjectId(objectId);
      setEditingObjectField(field);
      setEditingObjectValue(String(obj[field]));
    }
  };

  const handleSaveBlockedObjectEdit = () => {
    if (editingObjectId && editingObjectField) {
      setMeasurements((prev) => ({
        ...prev,
        blockedObjects: prev.blockedObjects?.map((obj) =>
          obj.id === editingObjectId
            ? {
                ...obj,
                [editingObjectField]:
                  editingObjectField === "area"
                    ? parseFloat(editingObjectValue) || 0
                    : editingObjectValue,
              }
            : obj,
        ),
      }));
    }
    setEditingObjectId(null);
    setEditingObjectField(null);
    setEditingObjectValue("");
  };

  const handleCancelBlockedObjectEdit = () => {
    setEditingObjectId(null);
    setEditingObjectField(null);
    setEditingObjectValue("");
  };

  const handleSave = () => {
    onSave({
      ...measurements,
      paintableArea: effectivePaintable,
      blockedArea: effectiveBlockedArea,
    });
  };

  const fields: {
    key: keyof SurfaceMeasurement;
    label: string;
    dot: string;
  }[] = [
    {
      key: "totalArea",
      label: `Total ${surface.type === "ceiling" ? "Ceiling" : "Wall"} Area`,
      dot: "bg-navy",
    },
    { key: "paintableArea", label: "Paintable Area", dot: "bg-success" },
    { key: "nonPaintableArea", label: "Non-Paintable Area", dot: "bg-mustard" },
    { key: "blockedArea", label: "Blocked Area", dot: "bg-muted-foreground" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader showBack onBack={onBack} title={surface.name} />

      <div className="flex-1 px-5 pt-5 overflow-y-auto pb-2">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Measurement Results
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review and adjust values if needed
            </p>
          </div>
          <button
            onClick={() => setShowPhotos((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shrink-0 mt-0.5 ${
              showPhotos
                ? "bg-navy text-navy-foreground border-navy"
                : "bg-muted text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            <Images className="w-3.5 h-3.5" />
            {showPhotos ? "Hide Photos" : "Show Photos"}
          </button>
        </div>

        {showPhotos && capturedPhotos.length > 0 && (
          <div className="mb-5">
            <div
              className={`grid gap-2 ${
                capturedPhotos.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {capturedPhotos.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${surface.name} photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className="text-white text-[10px] font-medium">
                      Photo {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPhotos && capturedPhotos.length === 0 && (
          <div className="mb-5 flex items-center justify-center h-28 rounded-2xl bg-muted border border-dashed border-border">
            <p className="text-xs text-muted-foreground">No photos captured</p>
          </div>
        )}

        <div className="space-y-3">
          {fields.map(({ key, label, dot }) => (
            <div
              key={key}
              className="p-4 bg-card rounded-2xl border border-border"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
                  <span className="text-sm font-medium text-foreground truncate">
                    {label}
                  </span>
                </div>

                {editingField === key ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 h-8 text-right text-sm px-2"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-success" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-base font-bold text-foreground">
                      {key === "paintableArea"
                        ? effectivePaintable
                        : key === "blockedArea"
                          ? effectiveBlockedArea
                          : measurements[key]}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        sq.ft
                      </span>
                    </span>
                    {key !== "blockedArea" && (
                      <button
                        onClick={() => handleEdit(key)}
                        className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
                      >
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Total area validation hint */}
              {key === "totalArea" && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border">
                  <AlertCircle className="w-3.5 h-3.5 text-mustard shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Please review total{" "}
                    {surface.type === "ceiling" ? "ceiling" : "wall"} area
                    before proceeding
                  </p>
                </div>
              )}

              {/* Blocked area object-wise breakdown */}
              {key === "blockedArea" &&
                measurements.blockedObjects &&
                measurements.blockedObjects.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-foreground mb-2.5">
                      Blocked Area Detected
                    </p>
                    <div className="space-y-2">
                      {measurements.blockedObjects.map((obj) => (
                        <div key={obj.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex-1 min-w-0">
                              {editingObjectId === obj.id &&
                              editingObjectField === "name" ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="text"
                                    value={editingObjectValue}
                                    onChange={(e) =>
                                      setEditingObjectValue(e.target.value)
                                    }
                                    className="h-8 text-sm px-2"
                                    autoFocus
                                  />
                                  <button
                                    onClick={handleSaveBlockedObjectEdit}
                                    className="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center shrink-0"
                                  >
                                    <Check className="w-3.5 h-3.5 text-success" />
                                  </button>
                                  <button
                                    onClick={handleCancelBlockedObjectEdit}
                                    className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {obj.name}
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleEditBlockedObject(obj.id, "name")
                                    }
                                    className="rounded-lg hover:bg-background p-1"
                                  >
                                    <Pencil className="w-3 h-3 text-muted-foreground" />
                                  </button>
                                </div>
                              )}
                              {editingObjectId === obj.id &&
                              editingObjectField === "area" ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <Input
                                    type="number"
                                    value={editingObjectValue}
                                    onChange={(e) =>
                                      setEditingObjectValue(e.target.value)
                                    }
                                    className="w-16 h-6 text-xs px-1"
                                    autoFocus
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    sq.ft
                                  </span>
                                  <button
                                    onClick={handleSaveBlockedObjectEdit}
                                    className="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center shrink-0"
                                  >
                                    <Check className="w-3.5 h-3.5 text-success" />
                                  </button>
                                  <button
                                    onClick={handleCancelBlockedObjectEdit}
                                    className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                  <span>
                                    {obj.area}{" "}
                                    <span className="text-muted-foreground">
                                      sq.ft
                                    </span>
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleEditBlockedObject(obj.id, "area")
                                    }
                                    className="rounded-lg hover:bg-background p-1"
                                  >
                                    <Pencil className="w-3 h-3 text-muted-foreground" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleBlockedObject(obj.id)}
                              className={`flex-1 h-7 rounded-lg text-xs font-semibold transition-colors ${
                                !obj.addedToPaintable
                                  ? "bg-navy text-navy-foreground"
                                  : "bg-secondary text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              Keep Excluded
                            </button>
                            <button
                              onClick={() => handleToggleBlockedObject(obj.id)}
                              className={`flex-1 h-7 rounded-lg text-xs font-semibold transition-colors ${
                                obj.addedToPaintable
                                  ? "bg-success text-white"
                                  : "bg-secondary text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              Add to Paintable
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {addedToPaintableTotal > 0 && (
                      <p className="text-xs text-success font-medium mt-2.5 p-2 bg-success/5 rounded-lg">
                        +{addedToPaintableTotal} sq.ft added to paintable area
                      </p>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5 pt-3">
        <Button
          onClick={handleSave}
          className="w-full h-14 text-base font-semibold rounded-xl bg-navy hover:bg-navy/90 text-navy-foreground tracking-wide"
        >
          Save {surface.type === "ceiling" ? "Ceiling" : "Wall"}
        </Button>
      </div>
    </div>
  );
}
