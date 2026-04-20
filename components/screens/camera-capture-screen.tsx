"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import {
  X,
  Camera,
  RotateCcw,
  Plus,
  CheckCircle2,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Surface } from "@/lib/types";

interface CameraCaptureScreenProps {
  surface: Surface;
  onBack: () => void;
  onCapture: () => void;
}

type Phase = "capture" | "crop" | "preview" | "analyzing";

// Each captured photo is stored as a data URL (or placeholder colour key for simulated photos)
type Photo = { src: string; isReal: boolean };

const PHOTO_COLORS = [
  "from-neutral-700 to-neutral-600",
  "from-slate-700 to-slate-600",
  "from-zinc-700 to-zinc-600",
  "from-stone-700 to-stone-600",
];

const ANALYZING_STEPS = [
  "Detecting wall boundaries...",
  "Identifying non-paintable areas...",
  "Calculating surface area...",
  "Finalizing measurements...",
];

// ---- Crop helper --------------------------------------------------------
// Creates a canvas with the cropped region and returns a data URL.
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );
      resolve(canvas.toDataURL("image/jpeg"));
    });
    image.src = imageSrc;
  });
}

// Simulated "captured" image — a solid-colour data URL for demo purposes
function makeSimulatedImage(index: number): string {
  const colours = ["#3b4252", "#434c5e", "#4c566a", "#2e3440"];
  const colour = colours[index % colours.length];
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, 800, 600);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Photo ${index + 1}`, 400, 310);
  return canvas.toDataURL("image/jpeg");
}

export function CameraCaptureScreen({
  surface,
  onBack,
  onCapture,
}: CameraCaptureScreenProps) {
  const [phase, setPhase] = useState<Phase>("capture");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);

  // ---- Crop state --------------------------------------------------------
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = useCallback(
    (
      _: unknown,
      croppedPixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  // ---- Simulate AI analysis progress ------------------------------------
  useEffect(() => {
    if (phase !== "analyzing") return;

    let step = 0;
    setAnalyzingStep(0);
    setAnalyzeProgress(0);

    const stepInterval = setInterval(() => {
      step += 1;
      if (step < ANALYZING_STEPS.length) setAnalyzingStep(step);
    }, 600);

    const progressInterval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          setTimeout(onCapture, 200);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [phase, onCapture]);

  // ---- Handlers ----------------------------------------------------------
  const handleCapture = () => {
    // Generate a simulated image and go to crop screen
    const src = makeSimulatedImage(photos.length);
    setPendingImageSrc(src);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setPhase("crop");
  };

  const handleConfirmCrop = async () => {
    if (!pendingImageSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(pendingImageSrc, croppedAreaPixels);
    setPhotos((prev) => [...prev, { src: cropped, isReal: true }]);
    setPendingImageSrc(null);
    setPhase("preview");
  };

  const handleCancelCrop = () => {
    setPendingImageSrc(null);
    setPhase("capture");
  };

  const handleAddMore = () => setPhase("capture");

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    if (updated.length === 0) setPhase("capture");
  };

  const handleProcess = () => setPhase("analyzing");

  // ======================================================================
  // ---- CROP SCREEN -----------------------------------------------------
  // ======================================================================
  if (phase === "crop" && pendingImageSrc) {
    return (
      <div className="flex flex-col h-full bg-black">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 bg-black">
          <button
            onClick={handleCancelCrop}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium"
            aria-label="Cancel crop"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <div className="flex flex-col items-center">
            <span className="text-white text-sm font-semibold">
              {surface.name}
            </span>
            <span className="text-white/40 text-[10px] tracking-wide uppercase">
              Crop & Adjust
            </span>
          </div>
          <button
            onClick={handleConfirmCrop}
            className="flex items-center gap-1.5 text-sm font-semibold rounded-full px-4 py-1.5"
            style={{ background: "#1da462", color: "#fff" }}
            aria-label="Confirm crop"
          >
            <Check className="w-4 h-4" />
            Use Photo
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative flex-1 overflow-hidden">
          <Cropper
            image={pendingImageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { background: "#000" },
              cropAreaStyle: {
                border: "2px solid rgba(255,255,255,0.7)",
                borderRadius: 12,
              },
            }}
          />

          {/* Overlay hint */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
              <span className="text-white/70 text-xs">
                Pinch to zoom · Drag to reposition
              </span>
            </div>
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="bg-black px-5 py-5 flex gap-3">
          <button
            onClick={handleCancelCrop}
            className="flex-1 h-12 rounded-full border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmCrop}
            className="flex-1 h-12 rounded-full text-white text-sm font-semibold transition-colors"
            style={{ background: "#1da462" }}
          >
            Confirm Crop
          </button>
        </div>
      </div>
    );
  }

  // ======================================================================
  // ---- AI ANALYZING SCREEN ---------------------------------------------
  // ======================================================================
  if (phase === "analyzing") {
    const ORBIT_R = 52;
    const CENTER = 110;

    const dots = [
      {
        color: "#1da462",
        shadow: "rgba(29,164,98,0.55)",
        size: 18,
        orbitDuration: "3.6s",
        delay: "0s",
      },
      {
        color: "#f5a623",
        shadow: "rgba(245,166,35,0.55)",
        size: 15,
        orbitDuration: "3.6s",
        delay: "-0.9s",
      },
      {
        color: "#e8541a",
        shadow: "rgba(232,84,26,0.55)",
        size: 16,
        orbitDuration: "3.6s",
        delay: "-1.8s",
      },
      {
        color: "#7b5ea7",
        shadow: "rgba(123,94,167,0.55)",
        size: 14,
        orbitDuration: "3.6s",
        delay: "-2.7s",
      },
    ];

    const STEPS = [
      "Scanning wall geometry",
      "Mapping surface dimensions",
      "Identifying paintable zones",
      "Separating obstructions",
      "Finalizing measurements",
    ];

    return (
      <div
        className="flex flex-col h-full items-center justify-between px-8 py-14 relative"
        style={{ background: "#f8f8f9" }}
      >
        <style>{`
          @keyframes orbitCW {
            from { transform: rotate(0deg) translateX(${ORBIT_R}px) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(${ORBIT_R}px) rotate(-360deg); }
          }
          @keyframes scanPulse {
            0%   { transform: scale(0.55); opacity: 0.55; }
            70%  { opacity: 0.12; }
            100% { transform: scale(1.55); opacity: 0; }
          }
          @keyframes scanPulse2 {
            0%   { transform: scale(0.4); opacity: 0.4; }
            70%  { opacity: 0.09; }
            100% { transform: scale(1.7); opacity: 0; }
          }
          @keyframes coreBreath {
            0%, 100% { transform: scale(1);    opacity: 0.9; }
            50%       { transform: scale(1.12); opacity: 1;   }
          }
          @keyframes ringRotate    { from { transform: rotate(0deg);    } to { transform: rotate(360deg);   } }
          @keyframes ringRotateCCW { from { transform: rotate(0deg);    } to { transform: rotate(-360deg);  } }
          @keyframes stepFade {
            0%   { opacity: 0; transform: translateY(6px);  }
            15%  { opacity: 1; transform: translateY(0);    }
            85%  { opacity: 1; transform: translateY(0);    }
            100% { opacity: 0; transform: translateY(-6px); }
          }
        `}</style>

        {/* Brand logo */}
        <div
          className="flex flex-col items-center opacity-85 justify-center"
          style={{ width: 140, height: 80, overflow: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/birla%20image-OF85rZkrUst9QCpKc4ltFIDNXHne5K.jpg"
            alt="Birla Opus Paints"
            style={{
              width: "180%",
              height: "180%",
              objectFit: "contain",
              objectPosition: "center",
              border: "none",
              outline: "none",
              boxShadow: "none",
              margin: "-20px",
            }}
            crossOrigin="anonymous"
          />
        </div>

        {/* Orbital animation */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative" style={{ width: 220, height: 220 }}>
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(29,164,98,0.07) 0%, rgba(123,94,167,0.05) 45%, transparent 72%)",
              }}
            />
            {[0, 0.8, 1.6].map((delay, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 160,
                  height: 160,
                  top: CENTER - 80,
                  left: CENTER - 80,
                  border: `1.5px solid rgba(${i === 0 ? "29,164,98,0.22" : i === 1 ? "245,166,35,0.18" : "123,94,167,0.15"})`,
                  animation: `${i < 2 ? "scanPulse" : "scanPulse2"} 2.4s cubic-bezier(0.4,0,0.6,1) infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: ORBIT_R * 2 + 18,
                height: ORBIT_R * 2 + 18,
                top: CENTER - ORBIT_R - 9,
                left: CENTER - ORBIT_R - 9,
                border: "1px dashed rgba(0,0,0,0.07)",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: ORBIT_R * 2 + 48,
                height: ORBIT_R * 2 + 48,
                top: CENTER - ORBIT_R - 24,
                left: CENTER - ORBIT_R - 24,
                border: "1px dashed rgba(0,0,0,0.05)",
                animation: "ringRotateCCW 18s linear infinite",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: ORBIT_R * 2 - 16,
                height: ORBIT_R * 2 - 16,
                top: CENTER - ORBIT_R + 8,
                left: CENTER - ORBIT_R + 8,
                border: "1px dashed rgba(0,0,0,0.06)",
                animation: "ringRotate 12s linear infinite",
              }}
            />
            {dots.map((dot, i) => (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  width: dot.size,
                  height: dot.size,
                  top: CENTER - dot.size / 2,
                  left: CENTER - dot.size / 2,
                  animation: `orbitCW ${dot.orbitDuration} linear infinite`,
                  animationDelay: dot.delay,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -6,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${dot.shadow} 0%, transparent 70%)`,
                    filter: "blur(4px)",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: dot.color,
                    boxShadow: `0 0 ${dot.size}px ${dot.shadow}, 0 0 ${dot.size * 2}px ${dot.shadow}40`,
                  }}
                />
              </div>
            ))}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 32,
                height: 32,
                top: CENTER - 16,
                left: CENTER - 16,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,1) 30%, rgba(240,240,240,0.7) 100%)",
                boxShadow:
                  "0 0 20px rgba(0,0,0,0.08), 0 0 40px rgba(29,164,98,0.1)",
                animation: "coreBreath 2.4s ease-in-out infinite",
              }}
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h2
              className="text-xl font-bold tracking-tight"
              style={{ color: "#111827", letterSpacing: "-0.4px" }}
            >
              Birla Opus AI is Analysing
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#6b7280", maxWidth: 220 }}
            >
              Processing{" "}
              <span className="font-semibold" style={{ color: "#374151" }}>
                {photos.length} {photos.length === 1 ? "image" : "images"}
              </span>{" "}
              for{" "}
              <span className="font-semibold" style={{ color: "#374151" }}>
                {surface.name}
              </span>
            </p>
          </div>
        </div>

        {/* Progress */}
        <div
          className="w-full flex flex-col items-center gap-4"
          style={{ maxWidth: 280 }}
        >
          <div style={{ minHeight: 18, overflow: "hidden" }}>
            <p
              key={analyzingStep}
              className="text-xs font-medium text-center tracking-widest uppercase"
              style={{
                color: "#9ca3af",
                letterSpacing: "0.1em",
                animation: "stepFade 0.65s ease forwards",
              }}
            >
              {STEPS[Math.min(analyzingStep, STEPS.length - 1)]}
            </p>
          </div>
          <div className="w-full">
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 3, background: "rgba(0,0,0,0.06)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${analyzeProgress}%`,
                  background:
                    "linear-gradient(90deg, #1da462 0%, #f5a623 38%, #e8541a 68%, #7b5ea7 100%)",
                  transition: "width 0.12s linear",
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px]" style={{ color: "#d1d5db" }}>
                Analysing
              </span>
              <span
                className="text-[11px] font-semibold tabular-nums"
                style={{ color: "#6b7280" }}
              >
                {analyzeProgress}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {dots.map((dot, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 7,
                  height: 7,
                  background: dot.color,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ======================================================================
  // ---- PREVIEW SCREEN --------------------------------------------------
  // ======================================================================
  if (phase === "preview") {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
            aria-label="Back"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex-1">
            <h2 className="text-base font-bold text-foreground">
              {surface.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}{" "}
              captured
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <div className="grid grid-cols-2 gap-3 mb-5">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800"
              >
                {photo.isReal ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.src}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${PHOTO_COLORS[i % PHOTO_COLORS.length]} flex items-center justify-center`}
                  >
                    <CheckCircle2 className="w-8 h-8 text-white/60" />
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/40 rounded-full">
                  <span className="text-white text-[10px] font-medium">
                    Photo {i + 1}
                  </span>
                </div>
                <button
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            ))}

            <button
              onClick={handleAddMore}
              className="aspect-[4/3] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-navy/30 hover:text-navy transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-medium">Add Image</span>
            </button>
          </div>

          <div className="p-3 bg-muted rounded-xl mb-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adding multiple images helps the AI get a more accurate
              measurement. Capture all visible parts of the{" "}
              {surface.type === "ceiling" ? "ceiling" : "wall"}.
            </p>
          </div>
        </div>

        <div className="px-5 pb-5 pt-3">
          <Button
            onClick={handleProcess}
            className="w-full h-14 text-base font-semibold rounded-xl bg-navy hover:bg-navy/90 text-navy-foreground tracking-wide"
          >
            Process {photos.length} {photos.length === 1 ? "Image" : "Images"}
          </Button>
        </div>
      </div>
    );
  }

  // ======================================================================
  // ---- CAPTURE SCREEN --------------------------------------------------
  // ======================================================================
  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" />

        <div className="absolute inset-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-7 h-7 border-t-[3px] border-l-[3px] border-white rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-7 h-7 border-t-[3px] border-r-[3px] border-white rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[3px] border-l-[3px] border-white rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[3px] border-r-[3px] border-white rounded-br-sm" />
        </div>

        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">
              {surface.name}
            </span>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="absolute top-4 right-4 px-2.5 py-1 bg-navy rounded-full">
            <span className="text-navy-foreground text-xs font-semibold">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </span>
          </div>
        )}

        <div className="absolute bottom-36 left-0 right-0 text-center">
          <p className="text-white/50 text-xs tracking-wide">
            Align the {surface.type === "ceiling" ? "ceiling" : "wall"} within
            the frame
          </p>
        </div>
      </div>

      <div className="bg-black px-6 pt-5 pb-8">
        <div className="flex items-center justify-center gap-6">
          {photos.length > 0 && (
            <button
              onClick={() => setPhotos((prev) => prev.slice(0, -1))}
              className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center"
              aria-label="Remove last"
            >
              <RotateCcw className="w-4 h-4 text-white/70" />
            </button>
          )}

          <button
            onClick={handleCapture}
            className="rounded-full border-4 border-white/80 flex items-center justify-center active:scale-95 transition-transform"
            style={{ width: 72, height: 72 }}
            aria-label="Capture photo"
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <Camera className="w-7 h-7 text-black" />
            </div>
          </button>

          {photos.length > 0 && (
            <button
              onClick={() => setPhase("preview")}
              className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center"
              aria-label="View captured photos"
            >
              <div
                className={`w-full h-full rounded-full overflow-hidden bg-gradient-to-br ${PHOTO_COLORS[photos.length % PHOTO_COLORS.length]}`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
