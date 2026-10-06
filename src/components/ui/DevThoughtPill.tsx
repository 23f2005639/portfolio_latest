import React, { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'

const ML_DEV_THOUGHTS = [
  "100% test accuracy achieved by deleting the test set.",
  "Trained with batch_size=1 and pure adrenaline.",
  "It's not a hallucination, it's non-deterministic poetry.",
  "Running on 16GB of VRAM and pure stubbornness.",
  "Loss was converging, so I touched nothing and walked away slowly.",
  "My model isn't overfitting, it just memorized reality with high conviction.",
  "Gradient descent works in mysterious ways.",
  "Feature engineering: turning caffeine into covariance matrices.",
  "The GPU fan noise is just the neural network breathing.",
  "Early stopping is just acknowledging you got lucky.",
]

interface DevThoughtPillProps {
  initialIndex?: number
  className?: string
}

export const DevThoughtPill: React.FC<DevThoughtPillProps> = ({
  initialIndex = 0,
  className = '',
}) => {
  const [index, setIndex] = useState<number>(initialIndex % ML_DEV_THOUGHTS.length)
  const [revealed, setRevealed] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const handleNext = () => {
    setIsAnimating(true)
    setRevealed(true)
    setIndex((prev) => (prev + 1) % ML_DEV_THOUGHTS.length)
    setTimeout(() => setIsAnimating(false), 250)
  }

  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <button
        onClick={handleNext}
        className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all font-mono text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 shadow-2xs cursor-pointer active:scale-98"
        title="Click to reveal another high-IQ ML thought"
      >
        <Sparkles className="w-3 h-3 text-amber-500 shrink-0 group-hover:rotate-12 transition-transform" />
        
        {!revealed ? (
          <span className="italic">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">dev thought:</span> click to reveal high-IQ ML truth
          </span>
        ) : (
          <span className={`transition-opacity duration-200 ${isAnimating ? 'opacity-40' : 'opacity-100'}`}>
            <span className="text-zinc-400 dark:text-zinc-500 font-semibold mr-1.5">[{index + 1}/{ML_DEV_THOUGHTS.length}]</span>
            "{ML_DEV_THOUGHTS[index]}"
          </span>
        )}

        <RefreshCw className="w-3 h-3 ml-1 text-zinc-400 dark:text-zinc-500 group-hover:rotate-180 transition-transform duration-300 shrink-0" />
      </button>
    </div>
  )
}
