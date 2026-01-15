"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadSection } from "./upload-section"
import { AnalyticsSection } from "./analytics-section"
import { HistorySection } from "./history-section"
import { Header } from "./header"

export function DashboardClient({ user }: { user: User }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAnalysisComplete = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <UploadSection onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>

          <TabsContent value="history">
            <HistorySection key={refreshKey} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
