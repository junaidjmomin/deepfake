"use client"

interface TierSelectorProps {
  selectedTier: number
  onTierSelect: (tier: number) => void
}

const TIERS = [
  {
    number: 1,
    name: "Fast",
    description: "Quick analysis",
    time: "2-5 sec",
    color: "bg-blue-600",
    borderColor: "border-blue-500",
  },
  {
    number: 2,
    name: "Balanced",
    description: "Standard analysis",
    time: "15-30 sec",
    color: "bg-purple-600",
    borderColor: "border-purple-500",
  },
  {
    number: 3,
    name: "Deep",
    description: "Detailed analysis",
    time: "1-3 min",
    color: "bg-emerald-600",
    borderColor: "border-emerald-500",
  },
  {
    number: 4,
    name: "Expert",
    description: "Full forensic analysis",
    time: "5-15 min",
    color: "bg-orange-600",
    borderColor: "border-orange-500",
  },
]

export function TierSelector({ selectedTier, onTierSelect }: TierSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TIERS.map((tier) => (
        <button
          key={tier.number}
          onClick={() => onTierSelect(tier.number)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedTier === tier.number
              ? `${tier.color} ${tier.borderColor} border-opacity-100`
              : "border-slate-600 bg-slate-700/20 hover:border-slate-500"
          }`}
        >
          <div className={`text-lg font-bold ${selectedTier === tier.number ? "text-white" : "text-slate-200"}`}>
            Tier {tier.number}
          </div>
          <div className={`text-sm ${selectedTier === tier.number ? "text-white/80" : "text-slate-400"}`}>
            {tier.name}
          </div>
          <div className={`text-xs mt-1 ${selectedTier === tier.number ? "text-white/60" : "text-slate-500"}`}>
            {tier.description} • {tier.time}
          </div>
        </button>
      ))}
    </div>
  )
}
