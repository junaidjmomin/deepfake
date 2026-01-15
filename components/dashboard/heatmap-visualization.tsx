"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HeatmapVisualizationProps {
  suspicious_frames: number[]
  confidence: number
}

export function HeatmapVisualization({ suspicious_frames, confidence }: HeatmapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, width, height)

    // Draw frame grid
    const frameWidth = width / 10
    for (let i = 0; i < 10; i++) {
      const x = i * frameWidth

      // Random anomaly score
      const isAnomaly = suspicious_frames.includes(i)
      const anomalyScore = isAnomaly ? 0.5 + Math.random() * 0.5 : Math.random() * 0.3

      // Color gradient based on anomaly
      const hue = isAnomaly ? 0 : 120 // Red for anomalies, green for normal
      const saturation = Math.min(100, anomalyScore * 200)
      const lightness = 40 - anomalyScore * 30

      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      ctx.fillRect(x, 0, frameWidth - 2, height)

      // Draw frame number
      ctx.fillStyle = "#94a3b8"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${i}`, x + frameWidth / 2, height - 8)
    }

    // Draw confidence threshold line
    const thresholdX = confidence * width * 0.8 + width * 0.1
    ctx.strokeStyle = "#60a5fa"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(thresholdX, 0)
    ctx.lineTo(thresholdX, height)
    ctx.stroke()
    ctx.setLineDash([])
  }, [suspicious_frames, confidence])

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg">Frame Analysis Heatmap</CardTitle>
        <CardDescription>Temporal distribution of anomalies across video frames</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <canvas ref={canvasRef} width={600} height={80} className="w-full border border-slate-600 rounded-lg" />
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-600 rounded"></div>
              <span className="text-slate-300">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
              <span className="text-slate-300">Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-slate-300">Anomaly</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
