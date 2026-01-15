"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface Detection {
  id: string
  file_name: string
  overall_confidence: number
  risk_level: string
  is_deepfake: boolean
  created_at: string
}

export function HistorySection() {
  const [detections, setDetections] = useState<Detection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const { data, error } = await supabase
          .from("detections")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20)

        if (error) throw error
        setDetections(data as Detection[])
      } catch (error) {
        console.error("[v0] Failed to fetch detections:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetections()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-400" size={32} />
      </div>
    )
  }

  if (detections.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-8">
          <div className="text-center text-slate-400">
            <p className="text-sm">No analyses yet. Upload a video to get started.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Detection History</CardTitle>
          <CardDescription>Your recent analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {detections.map((detection) => {
              const confidencePercent = Math.round(detection.overall_confidence * 100)
              return (
                <div
                  key={detection.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {detection.is_deepfake ? (
                      <AlertCircle className="text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="text-emerald-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-200 truncate">{detection.file_name}</p>
                      <p className="text-xs text-slate-400">{new Date(detection.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-white">{confidencePercent}%</div>
                    <span className="inline-block text-xs font-semibold px-2 py-1 rounded bg-slate-600 text-slate-200 mt-1">
                      {detection.risk_level}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
