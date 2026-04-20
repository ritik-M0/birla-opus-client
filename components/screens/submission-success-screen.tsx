"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmissionSuccessScreenProps {
  leadId: string;
  onGoHome: () => void;
  onViewMeasurement: () => void;
}

export function SubmissionSuccessScreen({
  leadId,
  onGoHome,
  onViewMeasurement,
}: SubmissionSuccessScreenProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Main content — vertically centred */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Success icon */}
        <div className="relative mb-8">
          {/* Outer soft ring */}
          <div className="w-28 h-28 rounded-full bg-success/8 flex items-center justify-center">
            {/* Inner ring */}
            <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
              <CheckCircle2
                className="w-10 h-10 text-success"
                strokeWidth={1.75}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-foreground tracking-tight text-balance leading-snug">
          Measurement Submitted Successfully
        </h1>

        {/* Subtext */}
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed text-balance">
          Your site measurement has been recorded.
        </p>

        {/* Lead ID pill */}
        <div className="mt-5 px-4 py-2 bg-muted rounded-full">
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Lead ID:{" "}
          </span>
          <span className="text-xs text-foreground font-semibold tracking-wide">
            {leadId}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          onClick={onViewMeasurement}
          variant="outline"
          className="w-full h-13 text-sm font-semibold rounded-xl border-navy/20 text-navy hover:bg-navy/5"
        >
          View Measurement
        </Button>
        <Button
          onClick={onGoHome}
          className="w-full h-14 text-base font-semibold rounded-xl bg-navy hover:bg-navy/90 text-navy-foreground"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
