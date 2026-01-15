"use client"

import { Card } from "@/components/ui/card"

interface MetricsGridProps {
  metrics: {
    facial_consistency: number
    audio_sync: number
    breathing_pattern: number
    eye_movement: number
    skin_tone_uniformity: number
    mouth_movement: number
  }
}

const METRIC_LABELS = {
  facial_consistency: "Facial Consistency",
  audio_sync: "Audio Sync",
  breathing_pattern: "Breathing Pattern",
  eye_movement: "Eye Movement",
  skin_tone_uniformity: "Skin Tone",
  mouth_movement: "Mouth Movement",
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(metrics).map(([key, value]) => {
        const percentage = Math.round(value * 100)
        const isAnomaly = value > 0.4
        return (
          <Card
            key={key}
            className={`${isAnomaly ? "bg-red-900/20 border-red-700" : "bg-slate-700/30 border-slate-600"} p-4`}
          >
            <div className="text-sm font-semibold text-slate-200 mb-3">
              {METRIC_LABELS[key as keyof typeof METRIC_LABELS]}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">{percentage}%</div>
              <div className="w-full bg-slate-600 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${isAnomaly ? "bg-red-500" : "bg-emerald-500"}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400">{isAnomaly ? "Anomaly Detected" : "Normal Range"}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
