"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { MetricsGrid } from "./metrics-grid"
import { HeatmapVisualization } from "./heatmap-visualization"
import { AnalysisTimeline } from "./analysis-timeline"

interface DetectionResultsProps {
  results: {
    overall_confidence: number
    risk_level: string
    is_deepfake: boolean
    metrics: {
      facial_consistency: number
      audio_sync: number
      breathing_pattern: number
      eye_movement: number
      skin_tone_uniformity: number
      mouth_movement: number
    }
    suspicious_frames: number[]
    timestamp_anomalies: Record<string, string>
  }
}

export function DetectionResults({ results }: DetectionResultsProps) {
  const confidencePercent = Math.round(results.overall_confidence * 100)
  const riskColors = {
    Critical: "text-red-400 bg-red-900/20",
    High: "text-orange-400 bg-orange-900/20",
    Medium: "text-yellow-400 bg-yellow-900/20",
    Low: "text-emerald-400 bg-emerald-900/20",
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-700">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {results.is_deepfake ? (
                  <>
                    <AlertCircle className="text-red-400" />
                    Deepfake Detected
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="text-emerald-400" />
                    Authentic Video
                  </>
                )}
              </CardTitle>
              <CardDescription>Analysis complete</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">{confidencePercent}%</div>
              <div
                className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${riskColors[results.risk_level as keyof typeof riskColors]}`}
              >
                {results.risk_level} Risk
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-red-500 transition-all duration-1000"
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Authentic</span>
            <span>Confidence Level</span>
            <span>Deepfake</span>
          </div>
        </CardContent>
      </Card>

      <MetricsGrid metrics={results.metrics} />

      <HeatmapVisualization suspicious_frames={results.suspicious_frames} confidence={results.overall_confidence} />

      {Object.keys(results.timestamp_anomalies).length > 0 && (
        <AnalysisTimeline anomalies={results.timestamp_anomalies} />
      )}

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            {results.is_deepfake
              ? "This video exhibits multiple indicators consistent with deepfake generation techniques. Suspicious patterns were detected in facial movements, audio synchronization, and biological signals."
              : "This video passed all authenticity checks. No significant anomalies detected in facial consistency, audio sync, or biological markers."}
          </p>
          {results.suspicious_frames.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-200 mb-2">
                Frames of Interest: {results.suspicious_frames.join(", ")}
              </p>
              <p className="text-sm text-slate-400">
                Manual review of these frames recommended for critical decisions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
