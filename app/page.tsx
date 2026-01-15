import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-center items-center px-6">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-balance">Deepfake Detection Platform</h1>
          <p className="text-xl text-slate-300">
            Advanced AI-powered detection with explainable analysis and multi-modal verification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-slate-700">
            <div className="text-sm font-semibold text-blue-400 mb-2">Tier 1 Detection</div>
            <p className="text-sm text-slate-400">Fast analysis in seconds</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-slate-700">
            <div className="text-sm font-semibold text-purple-400 mb-2">Multi-Modal</div>
            <p className="text-sm text-slate-400">Facial, audio, and behavioral</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-slate-700">
            <div className="text-sm font-semibold text-emerald-400 mb-2">Explainable</div>
            <p className="text-sm text-slate-400">Detailed visualization of findings</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-slate-700">
            <div className="text-sm font-semibold text-orange-400 mb-2">Secure</div>
            <p className="text-sm text-slate-400">Privacy-first architecture</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
