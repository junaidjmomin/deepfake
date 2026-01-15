"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface AnalysisTimelineProps {
  anomalies: Record<string, string>
}

export function AnalysisTimeline({ anomalies }: AnalysisTimelineProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-400" />
          Temporal Anomalies
        </CardTitle>
        <CardDescription>Specific timestamps with detected irregularities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(anomalies).map(([timestamp, description], index) => (
            <div key={timestamp} className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                {index < Object.entries(anomalies).length - 1 && <div className="w-0.5 h-12 bg-slate-600 my-2"></div>}
              </div>
              <div className="pb-4">
                <p className="font-semibold text-slate-200">{timestamp}</p>
                <p className="text-sm text-slate-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
