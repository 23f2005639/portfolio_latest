import React, { useEffect, useState } from 'react'

const ASCII_CHARS = '01#%*+=.:-_/[]{}?~@'

interface AsciiMatrixTextProps {
  text: string
  className?: string
  duration?: number
  delay?: number
}

export const AsciiMatrixText: React.FC<AsciiMatrixTextProps> = ({
  text,
  className = '',
  duration = 1200,
  delay = 150,
}) => {
  const [displayText, setDisplayText] = useState<string>('')
  const [isComplete, setIsComplete] = useState<boolean>(false)

  useEffect(() => {
    // If user prefers reduced motion, show text immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text)
      setIsComplete(true)
      return
    }

    let frameId: number
    const startTime = performance.now() + delay
    const totalLength = text.length

    const update = (now: number) => {
      if (now < startTime) {
        frameId = requestAnimationFrame(update)
        return
      }

      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      const revealedCount = Math.floor(progress * totalLength)

      let result = ''
      for (let i = 0; i < totalLength; i++) {
        const targetChar = text[i]
        if (targetChar === ' ' || targetChar === '\n') {
          result += targetChar
        } else if (i < revealedCount) {
          result += targetChar
        } else if (i < revealedCount + 4) {
          result += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        } else {
          result += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        }
      }

      setDisplayText(result)

      if (progress < 1) {
        frameId = requestAnimationFrame(update)
      } else {
        setDisplayText(text)
        setIsComplete(true)
      }
    }

    frameId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [text, duration, delay])

  return (
    <span className={className}>
      {displayText || text}
      {!isComplete && (
        <span className="inline-block w-2 h-4 ml-1 bg-zinc-900 dark:bg-zinc-100 animate-pulse align-middle" />
      )}
    </span>
  )
}
