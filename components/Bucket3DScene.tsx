'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

/**
 * Gera a etiqueta da marca em um canvas 2D pra usar como textura no balde 3D.
 * Textura wrappa em volta do cilindro (UV horizontal = circunferência).
 */
function useBrandLabelTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Fundo branco
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, 2048, 1024)

    // ── FAIXA LARANJA (topo) — wrappa o cilindro inteiro ──
    ctx.fillStyle = '#F28C28'
    ctx.beginPath()
    ctx.moveTo(0, 280)
    for (let x = 0; x <= 2048; x += 20) {
      const y = 280 + Math.sin((x / 2048) * Math.PI * 4) * 12
      ctx.lineTo(x, y)
    }
    ctx.lineTo(2048, 360)
    for (let x = 2048; x >= 0; x -= 20) {
      const y = 360 + Math.sin((x / 2048) * Math.PI * 4 + 0.5) * 10
      ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()

    // Highlight da faixa laranja
    ctx.fillStyle = 'rgba(255, 168, 85, 0.6)'
    ctx.beginPath()
    ctx.moveTo(0, 290)
    for (let x = 0; x <= 2048; x += 20) {
      const y = 290 + Math.sin((x / 2048) * Math.PI * 4) * 10
      ctx.lineTo(x, y)
    }
    ctx.lineTo(2048, 310)
    for (let x = 2048; x >= 0; x -= 20) {
      const y = 310 + Math.sin((x / 2048) * Math.PI * 4 + 0.5) * 8
      ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()

    // ── FAIXA VERMELHA (meio) ──
    ctx.fillStyle = '#D62828'
    ctx.beginPath()
    ctx.moveTo(0, 500)
    for (let x = 0; x <= 2048; x += 20) {
      const y = 500 + Math.sin((x / 2048) * Math.PI * 4 + 1) * 15
      ctx.lineTo(x, y)
    }
    ctx.lineTo(2048, 610)
    for (let x = 2048; x >= 0; x -= 20) {
      const y = 610 + Math.sin((x / 2048) * Math.PI * 4 + 1.5) * 12
      ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()

    // ── FAIXA AZUL ROYAL (base) ──
    ctx.fillStyle = '#1F4FBF'
    ctx.beginPath()
    ctx.moveTo(0, 780)
    for (let x = 0; x <= 2048; x += 20) {
      const y = 780 + Math.sin((x / 2048) * Math.PI * 4 + 2) * 18
      ctx.lineTo(x, y)
    }
    ctx.lineTo(2048, 1024)
    ctx.lineTo(0, 1024)
    ctx.closePath()
    ctx.fill()

    // Highlight da faixa azul
    ctx.fillStyle = 'rgba(58, 111, 224, 0.55)'
    ctx.beginPath()
    ctx.moveTo(0, 800)
    for (let x = 0; x <= 2048; x += 20) {
      const y = 800 + Math.sin((x / 2048) * Math.PI * 4 + 2) * 14
      ctx.lineTo(x, y)
    }
    ctx.lineTo(2048, 850)
    for (let x = 2048; x >= 0; x -= 20) {
      const y = 850 + Math.sin((x / 2048) * Math.PI * 4 + 2.5) * 10
      ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()

    // ── LOGO "COR & LAR" centrado horizontalmente (frente do balde) ──
    ctx.font = '900 130px "Bebas Neue", Impact, sans-serif'
    ctx.fillStyle = '#0E1B3C'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = '4px'
    ctx.fillText('COR & LAR', 1024, 690)

    // ── "TINTAS" ──
    ctx.font = '700 60px "Bebas Neue", Impact, sans-serif'
    ctx.fillText('TINTAS', 1024, 880)

    // ── PINCEL atrás do COR & LAR (à direita do texto) ──
    ctx.save()
    ctx.translate(1280, 670)
    ctx.rotate(-0.12)
    // Cabo de madeira
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(0, -12, 90, 24)
    // Ferrule
    ctx.fillStyle = '#999'
    ctx.fillRect(85, -16, 24, 32)
    // Cerdas vermelhas
    ctx.fillStyle = '#D62828'
    ctx.beginPath()
    ctx.moveTo(109, -20)
    ctx.lineTo(155, -28)
    ctx.lineTo(162, -8)
    ctx.lineTo(162, 8)
    ctx.lineTo(155, 28)
    ctx.lineTo(109, 20)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    if ('colorSpace' in texture) {
      // @ts-ignore
      texture.colorSpace = THREE.SRGBColorSpace
    }
    return texture
  }, [])
}

/**
 * O balde 3D real — geometria procedural com PBR
 */
function Bucket({ paintColor }: { paintColor: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const labelTexture = useBrandLabelTexture()

  // Idle animation — mais fluida e cinematográfica
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    // Rotação base π/2 (logo p/ frente) + oscilação suave e ampla
    groupRef.current.rotation.y = Math.PI / 2 + Math.sin(t * 0.28) * 0.18
    // Float vertical suave
    groupRef.current.position.y = Math.sin(t * 0.45) * 0.035
  })

  return (
    <group ref={groupRef} scale={0.78}>
      {/* CORPO — cilindro OPEN-ENDED (sem tampas; evita o bug do mapeamento radial no topo) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.05, 0.97, 2.4, 96, 1, true]} />
        <meshStandardMaterial
          map={labelTexture ?? undefined}
          color="#FFFFFF"
          metalness={0.0}
          roughness={0.45}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* FUNDO — disco fechando o balde por baixo */}
      <mesh position={[0, -1.19, 0]}>
        <cylinderGeometry args={[0.97, 0.97, 0.02, 64]} />
        <meshStandardMaterial color="#E8E8E5" roughness={0.5} />
      </mesh>

      {/* PAREDE INTERNA escurecida — dá profundidade ao olhar para dentro */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.95, 0.93, 1.2, 64, 1, true]} />
        <meshStandardMaterial
          color="#2A2A28"
          roughness={0.85}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* TINTA — disco sólido da cor da paleta, ligeiramente abaixo da borda */}
      <mesh position={[0, 1.14, 0]}>
        <cylinderGeometry args={[0.93, 0.93, 0.04, 64]} />
        <meshStandardMaterial
          color={paintColor}
          metalness={0.05}
          roughness={0.22}
        />
      </mesh>

      {/* BORDA SUPERIOR — anel claro na altura do topo do balde */}
      <mesh position={[0, 1.21, 0]}>
        <ringGeometry args={[0.93, 1.08, 96]} />
        <meshStandardMaterial
          color="#E8E8E5"
          metalness={0.1}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

interface BucketScene3DProps {
  paintColor: string
  className?: string
}

export default function BucketScene3D({ paintColor, className = '' }: BucketScene3DProps) {
  return (
    <div className={className} style={{ display: 'block', position: 'relative' }}>
      <Canvas
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ position: [1.3, 1.5, 3.6], fov: 40 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0.1, 0)
          camera.updateProjectionMatrix()
        }}
      >
        <Suspense fallback={null}>
          {/* Iluminação simples e leve — sem HDR, sem shadow maps */}
          <ambientLight intensity={0.85} />
          <directionalLight position={[4, 6, 4]} intensity={1.1} />
          <directionalLight position={[-3, 2, 2]} intensity={0.4} color="#C8DCFF" />
          <directionalLight position={[0, 3, -4]} intensity={0.45} color="#FFD8B5" />

          <Bucket paintColor={paintColor} />
        </Suspense>
      </Canvas>
    </div>
  )
}
