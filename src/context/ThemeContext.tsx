import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: (event?: React.MouseEvent) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shreyas_theme') as Theme
      if (saved === 'light' || saved === 'dark') return saved
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('shreyas_theme', theme)
  }, [theme])

  const toggleTheme = (event?: React.MouseEvent) => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'

    // Radial ripple transition if View Transitions API is supported
    if (
      event &&
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const x = event.clientX
      const y = event.clientY
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const transition = (document as any).startViewTransition(() => {
        setTheme(nextTheme)
      })

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
          {
            clipPath: nextTheme === 'dark' ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 400,
            easing: 'ease-in-out',
            pseudoElement: nextTheme === 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
          }
        )
      })
    } else {
      setTheme(nextTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
