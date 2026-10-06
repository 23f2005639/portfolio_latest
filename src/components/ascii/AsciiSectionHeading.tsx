import React, { useState, useEffect, useRef } from 'react'

interface AsciiSectionHeadingProps {
  number?: string
  title: string
  subtitle?: string
}

const BRAILLE_CHARS = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏⠋⠓⠚⠞⠖⠶⠦⠲⠴⠤'
const GLYPH_CHARS = '!<>-_\\/[]{}-=+*^?#________'

export const AsciiSectionHeading: React.FC<AsciiSectionHeadingProps> = ({
  title,
  subtitle,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [displayText, setDisplayText] = useState(title)
  const frameRef = useRef<number>(0)
  const iterationRef = useRef<number>(0)

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(title)
      cancelAnimationFrame(frameRef.current)
      return
    }

    iterationRef.current = 0
    let step = 0

    const scramble = () => {
      setDisplayText(
        title
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iterationRef.current) {
              return title[index]
            }
            if (step % 2 === 0) {
              return BRAILLE_CHARS[Math.floor(Math.random() * BRAILLE_CHARS.length)]
            }
            return GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)]
          })
          .join('')
      )

      step++
      if (iterationRef.current < title.length) {
        iterationRef.current += 1 / 3
        frameRef.current = requestAnimationFrame(scramble)
      } else {
        setDisplayText(title)
      }
    }

    frameRef.current = requestAnimationFrame(scramble)

    return () => cancelAnimationFrame(frameRef.current)
  }, [isHovered, title])

  return (
    <div 
      className="group inline-flex flex-col mb-8 cursor-default select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:tracking-wider transition-all duration-200">
          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{displayText}</span>
        </h2>
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-sans tracking-normal">
          {subtitle}
        </p>
      )}
    </div>
  )
}
