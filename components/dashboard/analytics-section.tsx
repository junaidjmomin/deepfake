"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AnalyticsSection() {
  const [stats, setStats] = useState<any>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await supabase.from("detections").select("*")

        if (data) {
          const totalAnalyses = data.length
          const deepfakes = data.filter((d: any) => d.is_deepfake).length
          const authentic = totalAnalyses - deepfakes
          const avgConfidence = data.reduce((sum: number, d: any) => sum + d.overall_confidence, 0) / totalAnalyses

          // Generate mock chart data
          const chartData = Array.from({ length: 7 }, (_, i) => ({
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            analyses: Math.floor(Math.random() * totalAnalyses + 2),
            confidence: Math.round(avgConfidence * 100),
          }))

          setStats({
            totalAnalyses,
            deepfakes,
            authentic,
            avgConfidence,
            chartData,
          })
        }
      } catch (error) {
        console.error("[v0] Failed to fetch analytics:", error)
      }
    }

    fetchStats()
  }, [])

  if (!stats) {
    return <div className="text-slate-400">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-white">{stats.totalAnalyses}</div>
            <p className="text-sm text-slate-400">Total Analyses</p>
          </CardContent>
        </Card>
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-400">{stats.deepfakes}</div>
            <p className="text-sm text-red-300">Deepfakes Detected</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-900/20 border-emerald-700">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-400">{stats.authentic}</div>
            <p className="text-sm text-emerald-300">Authentic Videos</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-900/20 border-blue-700">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-400">{Math.round(stats.avgConfidence * 100)}%</div>
            <p className="text-sm text-blue-300">Avg Confidence</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Analysis Trend</CardTitle>
          <CardDescription>Analyses over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="analyses" stroke="#60a5fa" strokeWidth={2} dot={{ fill: "#60a5fa" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle>Confidence Distribution</CardTitle>
          <CardDescription>Average confidence scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { range: "0-25%", count: Math.floor(Math.random() * 5) },
                { range: "25-50%", count: Math.floor(Math.random() * 8) },
                { range: "50-75%", count: Math.floor(Math.random() * 12) },
                { range: "75-100%", count: Math.floor(Math.random() * 10) },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="range" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
