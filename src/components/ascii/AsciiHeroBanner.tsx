import React, { useEffect, useRef } from 'react'
import { AsciiRenderer } from '@/engine/AsciiRenderer'
import { createDefaultAsciiLayer } from '@/engine/defaultLayer'
import type { Layer } from '@/types'

export const AsciiHeroBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<AsciiRenderer | null>(null)
  const layerRef = useRef<Layer>(createDefaultAsciiLayer({ artStyle: 'braille', fontSize: 8, characterSpacing: 0.9 }))
  const animFrameId = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    const renderer = new AsciiRenderer()
    rendererRef.current = renderer

    const canvas = renderer.getCanvas()
    canvas.className = 'w-full h-auto block select-none pointer-events-auto'
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(canvas)

    let imageAspect = 2142 / 694 // ~3.086

    const updateDimensionsAndRender = () => {
      if (!containerRef.current) return
      const width = Math.min(1000, containerRef.current.clientWidth || 800)
      const height = Math.round(width / imageAspect)
      renderer.resize(width, height)
    }

    const img = new Image()
    img.src = '/me_hu_shreyas.png'
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        imageAspect = img.naturalWidth / img.naturalHeight
        updateDimensionsAndRender()
      }
      renderer.setSource(img)
    }

    updateDimensionsAndRender()

    const resizeObserver = new ResizeObserver(() => {
      updateDimensionsAndRender()
    })
    resizeObserver.observe(containerRef.current)

    // Animation loop for ambient pulse and mouse interaction
    let startTime = performance.now()
    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000
      const currentLayer = layerRef.current

      currentLayer.brightness = 0
      currentLayer.contrast = 1.0 + Math.sin(elapsed * 1.5) * 0.03

      renderer.render([currentLayer], '#ffffff')
      animFrameId.current = requestAnimationFrame(loop)
    }
    animFrameId.current = requestAnimationFrame(loop)

    // Mouse handlers for reactive proximity distortion
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

  return (
    <div className="w-full flex items-center justify-center">
      <div 
        ref={containerRef} 
        className="w-full flex items-center justify-center overflow-hidden" 
      />
    </div>
  )
}
