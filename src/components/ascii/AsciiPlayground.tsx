import React, { useState, useEffect, useRef } from 'react'
import { AsciiRenderer } from '@/engine/AsciiRenderer'
import { AsciiTextRasterizer } from '@/engine/AsciiTextRasterizer'
import { createDefaultAsciiLayer } from '@/engine/defaultLayer'
import type { ArtStyle, DitherAlgorithm, Layer } from '@/types'
import { Sliders, Copy, Download, Check, Sparkles, RefreshCw } from 'lucide-react'

const PRESET_WORDS = [
  'AGENTIC SYSTEMS',
  'LANGGRAPH',
  'PYTORCH POISSON',
  'DEBERTA RAG',
  'ZERO-DAY ESCAPE',
  'SHREYAS NAMDEO',
]

const ART_STYLES: { id: ArtStyle; label: string }[] = [
  { id: 'braille', label: 'Braille' },
  { id: 'classic', label: 'Classic ASCII' },
  { id: 'dotcross', label: 'Dot Cross' },
  { id: 'halftone', label: 'Halftone' },
  { id: 'line', label: 'Line' },
  { id: 'retro', label: 'Retro' },
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'particles', label: 'Particles' },
]

export const AsciiPlayground: React.FC = () => {
  const [inputText, setInputText] = useState('AGENTIC SYSTEMS')
  const [currentStyle, setCurrentStyle] = useState<ArtStyle>('braille')
  const [ditherAlg, setDitherAlg] = useState<DitherAlgorithm>('floyd-steinberg')
  const [ditherStrength, setDitherStrength] = useState<number>(0.85)
  const [fontSize, setFontSize] = useState<number>(10)
  const [copied, setCopied] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<AsciiRenderer | null>(null)
  const rasterizerRef = useRef<AsciiTextRasterizer | null>(null)
  const layerRef = useRef<Layer>(createDefaultAsciiLayer({ artStyle: 'braille' }))
  const animFrameId = useRef<number>(0)

  // Initialize renderer
  useEffect(() => {
    if (!containerRef.current) return

    const renderer = new AsciiRenderer()
    const rasterizer = new AsciiTextRasterizer()
    rendererRef.current = renderer
    rasterizerRef.current = rasterizer

    const canvas = renderer.getCanvas()
    canvas.className = 'w-full h-auto block select-none pointer-events-auto rounded-lg'
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(canvas)

    const updateRender = () => {
      if (!containerRef.current || !rendererRef.current || !rasterizerRef.current) return
      const width = Math.min(840, containerRef.current.clientWidth || 700)
      const height = Math.min(260, Math.max(160, Math.floor(width * 0.28)))

      rendererRef.current.resize(width, height)

      const textFontSize = Math.max(28, Math.min(48, Math.floor(width * 0.05)))
      const sourceCanvas = rasterizerRef.current.render({
        width,
        height,
        lines: [inputText.trim() || 'AI ARCHITECT'],
        fontSize: textFontSize,
        fontWeight: '800',
        letterSpacing: 2,
        sublines: ['GLYPH ENGINE 2D · BROWSER SYNTHESIS'],
        subFontSize: 12,
        align: 'center',
      })

      rendererRef.current.setSource(sourceCanvas)
    }

    updateRender()

    const resizeObserver = new ResizeObserver(() => updateRender())
    resizeObserver.observe(containerRef.current)

    // Canvas render loop
    let startTime = performance.now()
    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000
      const currentLayer = layerRef.current
      currentLayer.brightness = 0
      currentLayer.contrast = 1.0 + Math.sin(elapsed * 1.5) * 0.03
      rendererRef.current?.render([currentLayer], '#ffffff')
      animFrameId.current = requestAnimationFrame(loop)
    }
    animFrameId.current = requestAnimationFrame(loop)

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      renderer.setMouse(x * scaleX, y * scaleY)
    }

    const handleMouseLeave = () => {
      renderer.setMouse(-1, -1)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animFrameId.current)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Update text source when text changes
  useEffect(() => {
    if (!rendererRef.current || !rasterizerRef.current || !containerRef.current) return
    const width = Math.min(840, containerRef.current.clientWidth || 700)
    const height = Math.min(260, Math.max(160, Math.floor(width * 0.28)))

    const textFontSize = Math.max(28, Math.min(48, Math.floor(width * 0.05)))
    const sourceCanvas = rasterizerRef.current.render({
      width,
      height,
      lines: [inputText.trim() || 'AI ARCHITECT'],
      fontSize: textFontSize,
      fontWeight: '800',
      letterSpacing: 2,
      sublines: ['GLYPH ENGINE 2D · BROWSER SYNTHESIS'],
      subFontSize: 12,
      align: 'center',
    })

    rendererRef.current.setSource(sourceCanvas)
  }, [inputText])

  // Update layer properties when style / sliders change
  useEffect(() => {
    const l = layerRef.current
    l.artStyle = currentStyle
    l.ditherAlgorithm = ditherAlg
    l.ditherStrength = ditherStrength
    l.fontSize = fontSize
  }, [currentStyle, ditherAlg, ditherStrength, fontSize])

  const copyCanvasPng = () => {
    if (!rendererRef.current) return
    const canvas = rendererRef.current.getCanvas()
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `glyph-${inputText.toLowerCase().replace(/\s+/g, '-')}.png`
      a.click()
      URL.revokeObjectURL(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-900" />
            <h3 className="font-mono text-sm font-bold tracking-tight text-zinc-900 uppercase">
              Glyph ASCII Engine · Interactive Sandbox
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Test the real-time Canvas 2D rasterization pipeline powering headings across this site.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCanvasPng}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copied ? 'Downloaded' : 'Export PNG'}</span>
          </button>
        </div>
      </div>

      {/* Input & Presets */}
      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-xs font-mono text-zinc-500 mb-1">
            INPUT WORD OR PHRASE:
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value.toUpperCase())}
              placeholder="TYPE ANY WORD..."
              maxLength={30}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-200 font-mono text-sm bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400 font-semibold uppercase tracking-wider"
            />
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-zinc-400 mr-1">Presets:</span>
          {PRESET_WORDS.map((preset) => (
            <button
              key={preset}
              onClick={() => setInputText(preset)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                inputText === preset
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Style Chips */}
      <div className="mt-4">
        <label className="block text-xs font-mono text-zinc-500 mb-1.5">
          RENDER STYLE:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {ART_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setCurrentStyle(style.id)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                currentStyle === style.id
                  ? 'border-zinc-900 bg-zinc-900 text-white font-medium shadow-2xs'
                  : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300'
              }`}
            >
              <span>{style.label}</span>
              {currentStyle === style.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview Canvas Container */}
      <div className="mt-5 p-3 rounded-xl border border-zinc-200 bg-white flex items-center justify-center min-h-[160px] overflow-hidden tech-dots">
        <div ref={containerRef} className="w-full" />
      </div>

      {/* Engine Controls / Sliders */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-zinc-100 text-xs font-mono text-zinc-600">
        <div>
          <div className="flex justify-between mb-1">
            <span>DITHER STRENGTH:</span>
            <span className="font-semibold text-zinc-900">{(ditherStrength * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ditherStrength}
            onChange={(e) => setDitherStrength(parseFloat(e.target.value))}
            className="w-full accent-zinc-900 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>FONT RESOLUTION:</span>
            <span className="font-semibold text-zinc-900">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="16"
            step="1"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full accent-zinc-900 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>DITHER ALGORITHM:</span>
          </div>
          <select
            value={ditherAlg}
            onChange={(e) => setDitherAlg(e.target.value as DitherAlgorithm)}
            className="w-full px-2 py-1 rounded border border-zinc-200 bg-zinc-50 text-xs font-mono text-zinc-900 focus:outline-hidden"
          >
            <option value="floyd-steinberg">Floyd-Steinberg (Diffusion)</option>
            <option value="atkinson">Atkinson (Mac Classic)</option>
            <option value="bayer">Bayer 8x8 (Ordered Matrix)</option>
            <option value="none">None (Direct Threshold)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
