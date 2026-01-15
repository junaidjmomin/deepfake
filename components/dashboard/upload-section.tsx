"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUpload } from "./file-upload"
import { TierSelector } from "./tier-selector"
import { DetectionResults } from "./detection-results"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

interface AnalysisState {
  isAnalyzing: boolean
  results: any | null
  error: string | null
}

export function UploadSection({ onAnalysisComplete }: { onAnalysisComplete: () => void }) {
  const [selectedTier, setSelectedTier] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    results: null,
    error: null,
  })
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleFileSelect = (file: File) => {
    setUploadedFile(file)
    setAnalysisState({ isAnalyzing: false, results: null, error: null })
  }

  const handleAnalyze = async () => {
    if (!uploadedFile) return

    setAnalysisState({ isAnalyzing: true, results: null, error: null })

    try {
      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate mock analysis results based on tier
      const mockResults = generateMockAnalysis(selectedTier, uploadedFile.name)

      // Save to database
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setAnalysisState({
          isAnalyzing: false,
          results: null,
          error: "User not authenticated",
        })
        return
      }

      const { data: detection, error: detectionError } = await supabase
        .from("detections")
        .insert({
          user_id: user.id,
          file_name: uploadedFile.name,
          file_size: uploadedFile.size,
          detection_tier: selectedTier,
          overall_confidence: mockResults.overall_confidence,
          risk_level: mockResults.risk_level,
          is_deepfake: mockResults.is_deepfake,
        })
        .select()
        .single()

      if (detectionError) throw detectionError

      // Save analysis results
      await supabase.from("analysis_results").insert({
        detection_id: detection.id,
        facial_consistency: mockResults.metrics.facial_consistency,
        audio_sync: mockResults.metrics.audio_sync,
        breathing_pattern: mockResults.metrics.breathing_pattern,
        eye_movement: mockResults.metrics.eye_movement,
        skin_tone_uniformity: mockResults.metrics.skin_tone_uniformity,
        mouth_movement: mockResults.metrics.mouth_movement,
        overall_score: mockResults.overall_confidence,
        suspicious_frames: mockResults.suspicious_frames,
        timestamp_anomalies: mockResults.timestamp_anomalies,
      })

      setAnalysisState({
        isAnalyzing: false,
        results: { ...mockResults, detection_id: detection.id },
        error: null,
      })
      onAnalysisComplete()
    } catch (error) {
      setAnalysisState({
        isAnalyzing: false,
        results: null,
        error: error instanceof Error ? error.message : "Analysis failed",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Upload & Analyze Video</CardTitle>
          <CardDescription>Upload a video file for deepfake detection analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload onFileSelect={handleFileSelect} />

          {uploadedFile && (
            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">
                Selected: <span className="font-semibold">{uploadedFile.name}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-200 block mb-3">Detection Tier</label>
              <TierSelector selectedTier={selectedTier} onTierSelect={setSelectedTier} />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!uploadedFile || analysisState.isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 h-11"
              size="lg"
            >
              {analysisState.isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>

          {analysisState.error && (
            <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg">
              <p className="text-sm">{analysisState.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisState.results && <DetectionResults results={analysisState.results} />}
    </div>
  )
}

function generateMockAnalysis(tier: number, fileName: string) {
  const baseConfidence = 0.45 + Math.random() * 0.5
  const tierBoost = (tier - 1) * 0.08
  const confidence = Math.min(0.99, baseConfidence + tierBoost)

  const isFake = confidence > 0.55

  return {
    overall_confidence: Number.parseFloat(confidence.toFixed(3)),
    risk_level: confidence > 0.75 ? "Critical" : confidence > 0.55 ? "High" : confidence > 0.4 ? "Medium" : "Low",
    is_deepfake: isFake,
    metrics: {
      facial_consistency: Math.random() * 0.3 + (isFake ? 0.5 : 0.1),
      audio_sync: Math.random() * 0.25 + (isFake ? 0.4 : 0.1),
      breathing_pattern: Math.random() * 0.2 + (isFake ? 0.35 : 0.05),
      eye_movement: Math.random() * 0.3 + (isFake ? 0.45 : 0.1),
      skin_tone_uniformity: Math.random() * 0.25 + (isFake ? 0.35 : 0.05),
      mouth_movement: Math.random() * 0.2 + (isFake ? 0.3 : 0.05),
    },
    suspicious_frames: isFake
      ? [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
      : [],
    timestamp_anomalies: isFake
      ? {
          "0:12": "Facial distortion",
          "0:35": "Audio desync",
          "1:02": "Breathing pattern anomaly",
        }
      : {},
  }
}
