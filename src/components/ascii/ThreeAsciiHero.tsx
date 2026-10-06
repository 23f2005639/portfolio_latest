import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js'
import { useTheme } from '@/context/ThemeContext'

export const ThreeAsciiHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isDark = theme === 'dark'

    // Safe dynamic width calculation bounded by container and viewport
    const getSafeWidth = () => {
      const clientW = container.clientWidth || 0
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 360
      const available = clientW > 0 ? clientW : screenW - 32
      return Math.min(1024, Math.max(280, available))
    }

    let width = getSafeWidth()
    let isMobile = width < 640
    let height = isMobile
      ? Math.min(260, Math.max(200, Math.round(width * 0.58)))
      : Math.min(280, Math.max(220, Math.round(width * 0.28)))

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(isDark ? 0x09090b : 0xffffff)

    // Camera calibrated for precious floating head mascot with ample clearance
    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 1000)
    const aspect = width / height
    const baseZ = 85
    camera.position.set(0, 0, aspect < 1.6 ? baseZ * (1.6 / aspect) : baseZ)

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)

    // Three.js AsciiEffect
    const effect = new AsciiEffect(renderer, ' .:-=+*#%@', {
      invert: isDark,
      resolution: 0.19,
      scale: 1,
    })
    effect.setSize(width, height)
    effect.domElement.style.color = isDark ? '#f4f4f5' : '#09090b'
    effect.domElement.style.backgroundColor = 'transparent'
    effect.domElement.style.margin = '0 auto'
    effect.domElement.style.display = 'flex'
    effect.domElement.style.justifyContent = 'center'
    effect.domElement.style.userSelect = 'none'
    effect.domElement.style.pointerEvents = 'auto'
    effect.domElement.style.maxWidth = '100%'
    effect.domElement.style.overflow = 'hidden'

    container.innerHTML = ''
    container.appendChild(effect.domElement)

    // Illumination focused on centered floating head
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 2.2 : 2.0)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 3.8 : 3.4)
    dirLight.position.set(0, 80, 85)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xffffff, 2.5, 260)
    pointLight.position.set(0, 15, 60)
    scene.add(pointLight)

    // Materials
    const chassisMat = new THREE.MeshPhongMaterial({
      color: isDark ? 0x2e2e32 : 0x222224,
      shininess: 90,
      specular: isDark ? 0xaaaaaa : 0x777777,
      flatShading: true,
    })
    const accentMat = new THREE.MeshPhongMaterial({
      color: isDark ? 0x4a4a52 : 0x3e3e42,
      shininess: 110,
      specular: 0xcccccc,
      flatShading: true,
    })

    // High-Resolution Face Screen Texture (Digital Eyes, Glints, Blush, Smile)
    const screenCanvas = document.createElement('canvas')
    screenCanvas.width = 384
    screenCanvas.height = 288
    const sCtx = screenCanvas.getContext('2d')
    if (sCtx) {
      // Screen background: pure white in light mode, pure black in dark mode
      sCtx.fillStyle = isDark ? '#000000' : '#ffffff'
      sCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height)

      // Screen bezel inner border
      sCtx.strokeStyle = isDark ? '#444444' : '#1a1a1a'
      sCtx.lineWidth = 8
      sCtx.strokeRect(4, 4, screenCanvas.width - 8, screenCanvas.height - 8)

      // Face features color
      const inkColor = isDark ? '#ffffff' : '#000000'
      const reflectionColor = isDark ? '#000000' : '#ffffff'
      const blushColor = isDark ? '#aaaaaa' : '#666666'

      // Left Eye
      sCtx.fillStyle = inkColor
      sCtx.beginPath()
      sCtx.arc(114, 120, 36, 0, Math.PI * 2)
      sCtx.fill()

      // Right Eye
      sCtx.beginPath()
      sCtx.arc(270, 120, 36, 0, Math.PI * 2)
      sCtx.fill()

      // Eye Glints (Cute reflection dots)
      sCtx.fillStyle = reflectionColor
      sCtx.beginPath()
      sCtx.arc(104, 110, 12, 0, Math.PI * 2)
      sCtx.fill()

      sCtx.beginPath()
      sCtx.arc(260, 110, 12, 0, Math.PI * 2)
      sCtx.fill()

      // Kawaii Cheek Blush
      sCtx.fillStyle = blushColor
      sCtx.beginPath()
      sCtx.arc(72, 160, 16, 0, Math.PI * 2)
      sCtx.fill()

      sCtx.beginPath()
      sCtx.arc(312, 160, 16, 0, Math.PI * 2)
      sCtx.fill()

      // Friendly Digital Smile Arc
      sCtx.strokeStyle = inkColor
      sCtx.lineWidth = 14
      sCtx.lineCap = 'round'
      sCtx.beginPath()
      sCtx.arc(192, 165, 38, 0.15 * Math.PI, 0.85 * Math.PI)
      sCtx.stroke()
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas)
    screenTexture.colorSpace = THREE.SRGBColorSpace
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture })

    // Mascot Head Group (Enlarged, Precious, Floating Cyber-Pet Head)
    const mascotHeadGroup = new THREE.Group()
    mascotHeadGroup.position.set(0, 0, 0)
    scene.add(mascotHeadGroup)

    // 1. Monitor Head Chassis (Scaled Up: 34 × 28 × 20)
    const headGeo = new THREE.BoxGeometry(34, 28, 20)
    const headMesh = new THREE.Mesh(headGeo, chassisMat)
    mascotHeadGroup.add(headMesh)

    // 2. Front Face Screen (28 × 22)
    const screenGeo = new THREE.PlaneGeometry(28, 22)
    const screenMesh = new THREE.Mesh(screenGeo, screenMat)
    screenMesh.position.set(0, 0, 10.2)
    mascotHeadGroup.add(screenMesh)

    // 3. Side Audio Knobs / Lateral Cylindrical Dials
    const dialGeo = new THREE.CylinderGeometry(4.8, 4.8, 3.8, 14)
    const dialLeft = new THREE.Mesh(dialGeo, accentMat)
    dialLeft.rotation.z = Math.PI / 2
    dialLeft.position.set(-18.5, 0, 0)
    mascotHeadGroup.add(dialLeft)

    const dialRight = new THREE.Mesh(dialGeo, accentMat)
    dialRight.rotation.z = Math.PI / 2
    dialRight.position.set(18.5, 0, 0)
    mascotHeadGroup.add(dialRight)

    // 4. Springy Antenna (Stem + Glowing Orb)
    const antennaStemGeo = new THREE.CylinderGeometry(1.2, 1.2, 13, 8)
    const antennaStem = new THREE.Mesh(antennaStemGeo, accentMat)
    antennaStem.position.set(0, 20.5, 0)
    mascotHeadGroup.add(antennaStem)

    const antennaBallGeo = new THREE.SphereGeometry(4.6, 12, 12)
    const antennaBall = new THREE.Mesh(antennaBallGeo, chassisMat)
    antennaBall.position.set(0, 28, 0)
    mascotHeadGroup.add(antennaBall)

    // 5. Orbiting Floating Data Sparks around head
    const sparkGeo = new THREE.OctahedronGeometry(2.2)
    const sparks: { mesh: THREE.Mesh; speed: number; orbitRadius: number; phase: number }[] = []
    for (let i = 0; i < 3; i++) {
      const sparkMesh = new THREE.Mesh(sparkGeo, isDark ? accentMat : chassisMat)
      scene.add(sparkMesh)
      sparks.push({
        mesh: sparkMesh,
        speed: 1.5 + i * 0.4,
        orbitRadius: 28 + i * 6,
        phase: (i * Math.PI * 2) / 3,
      })
    }

    // Mouse Interaction
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      // If hero container is completely scrolled out of viewport, return gaze to neutral
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        targetX = 0
        targetY = 0
        return
      }

      // Calculate normalized cursor position relative to container
      const rawX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const rawY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

      // Strictly clamp coordinates to [-1.0, 1.0] to prevent any runaway values
      let clampedX = Math.max(-1.0, Math.min(1.0, rawX))
      let clampedY = Math.max(-1.0, Math.min(1.0, rawY))

      // When scrolled down and hero starts moving off top of screen, damp gaze towards 0
      if (rect.top < 0) {
        const visibilityFactor = Math.max(0, Math.min(1, rect.bottom / rect.height))
        clampedX *= visibilityFactor
        clampedY *= visibilityFactor
      }

      targetX = clampedX
      targetY = clampedY
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0
    }

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      if (rect.bottom < 40 || rect.top > window.innerHeight) {
        targetX = 0
        targetY = 0
      } else if (rect.top < 0) {
        const factor = Math.max(0, Math.min(1, rect.bottom / rect.height))
        targetX *= factor
        targetY *= factor
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave)

    // Animation Loop
    let animId = 0
    let startTime = performance.now()

    const animate = () => {
      const now = performance.now()
      const t = (now - startTime) / 1000

      // Smooth mouse lerp (snappier response)
      mouseX += (targetX - mouseX) * 0.075
      mouseY += (targetY - mouseY) * 0.075

      // Camera parallax tracking - increased by 10%
      camera.position.x = Math.max(-2.2, Math.min(2.2, mouseX * 2.42))
      camera.position.y = Math.max(-1.65, Math.min(1.65, mouseY * 1.76))
      camera.lookAt(0, 0, 0)

      // Ambient floating bobbing
      mascotHeadGroup.position.y = Math.sin(t * 2.0) * 2.2

      // Head gaze tracking towards cursor:
      // Yaw (horizontal left/right): +10% sensitivity (max ±0.36 radians / ~20.6°)
      const desiredYaw = Math.sin(t * 1.2) * 0.04 + mouseX * 0.35
      mascotHeadGroup.rotation.y = Math.max(-0.36, Math.min(0.36, desiredYaw))

      // Pitch (vertical up/down): +10% sensitivity (max ±0.20 radians / ~11.5°) - completely prevents flipping
      const desiredPitch = -mouseY * 0.20
      mascotHeadGroup.rotation.x = Math.max(-0.20, Math.min(0.20, desiredPitch))

      // Roll (subtle tilt): +10% sensitivity (max ±0.07 radians / ~4.0°)
      const desiredRoll = Math.sin(t * 1.8) * 0.02 - mouseX * 0.055
      mascotHeadGroup.rotation.z = Math.max(-0.07, Math.min(0.07, desiredRoll))

      // Antenna springy inertia (+10% dynamic range)
      antennaBall.position.x = Math.sin(t * 3.5) * 0.6 + Math.max(-0.88, Math.min(0.88, mouseX * 0.88))

      // Orbiting sparkles
      sparks.forEach((s) => {
        const angle = t * s.speed + s.phase
        s.mesh.position.x = Math.cos(angle) * s.orbitRadius
        s.mesh.position.z = Math.sin(angle) * (s.orbitRadius * 0.5)
        s.mesh.position.y = Math.sin(t * 1.6 + s.phase) * 6
        s.mesh.rotation.x += 0.04
        s.mesh.rotation.y += 0.05
      })

      // Render through AsciiEffect
      effect.render(scene, camera)

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const newWidth = getSafeWidth()
      const nowMobile = newWidth < 640
      isMobile = nowMobile

      const newHeight = isMobile
        ? Math.min(260, Math.max(200, Math.round(newWidth * 0.58)))
        : Math.min(280, Math.max(220, Math.round(newWidth * 0.28)))

      const newAspect = newWidth / newHeight
      camera.aspect = newAspect
      camera.position.z = newAspect < 1.6 ? baseZ * (1.6 / newAspect) : baseZ
      camera.updateProjectionMatrix()

      renderer.setSize(newWidth, newHeight)
      effect.setSize(newWidth, newHeight)
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      container.removeEventListener('mouseleave', handleMouseLeave)
      resizeObserver.disconnect()
      renderer.dispose()
      if (container.contains(effect.domElement)) {
        container.removeChild(effect.domElement)
      }
    }
  }, [theme])

  return (
    <div className="w-full flex items-center justify-center overflow-hidden py-1 max-w-full">
      <div
        ref={containerRef}
        className="w-full flex items-center justify-center overflow-hidden max-w-full"
      />
    </div>
  )
}
