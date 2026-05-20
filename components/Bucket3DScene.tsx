'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
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

  // Rotação idle bem sutil pra "respirar" — base π/2 rotaciona o logo p/ frente da câmera
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.PI / 2 + Math.sin(t * 0.4) * 0.06
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.02
  })

  return (
    <group ref={groupRef} scale={0.7}>
      {/* CORPO — cilindro levemente cônico (raio menor embaixo) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.05, 0.97, 2.4, 96, 1, false]} />
        <meshPhysicalMaterial
          map={labelTexture ?? undefined}
          color="#FFFFFF"
          metalness={0.02}
          roughness={0.42}
          clearcoat={0.55}
          clearcoatRoughness={0.35}
          reflectivity={0.4}
        />
      </mesh>

      {/* TAMPA — disco branco plástico no topo */}
      <mesh castShadow position={[0, 1.25, 0]}>
        <cylinderGeometry args={[1.12, 1.08, 0.18, 96]} />
        <meshPhysicalMaterial
          color="#F4F4F2"
          metalness={0.05}
          roughness={0.25}
          clearcoat={0.85}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* BORDA DA TAMPA — anel metalizado */}
      <mesh position={[0, 1.34, 0]}>
        <ringGeometry args={[0.9, 1.08, 96]} />
        <meshStandardMaterial
          color="#B8B8B5"
          metalness={0.6}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* TINTA NO TOPO — superfície que muda de cor */}
      <mesh position={[0, 1.345, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.02, 64]} />
        <meshPhysicalMaterial
          color={paintColor}
          metalness={0.0}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={0.55}
        />
      </mesh>

      {/* ALÇA — torus aberto (semi-círculo) */}
      <group position={[0, 1.4, 0]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.038, 16, 80, Math.PI]} />
          <meshStandardMaterial color="#0A0A0A" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Conectores da alça */}
        <mesh position={[-1.18, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[1.18, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Botão de pressão lateral da tampa */}
      <mesh position={[1.04, 1.25, 0]}>
        <boxGeometry args={[0.1, 0.06, 0.12]} />
        <meshStandardMaterial color="#D0D0CD" metalness={0.2} roughness={0.4} />
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
        shadows
        gl={{ antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ position: [1.4, 1.6, 3.4], fov: 42 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0.1, 0)
          camera.updateProjectionMatrix()
        }}
      >
        <Suspense fallback={null}>

          {/* Iluminação cinematográfica */}
          <ambientLight intensity={0.42} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={2.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={20}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />
          {/* Fill light fria à esquerda */}
          <directionalLight position={[-4, 3, 2]} intensity={0.6} color="#A8C8FF" />
          {/* Rim light de trás */}
          <directionalLight position={[0, 2, -5]} intensity={0.8} color="#FFCCAA" />

          <Bucket paintColor={paintColor} />

          {/* Sombra de contato — fotorrealista */}
          <ContactShadows
            opacity={0.55}
            scale={6}
            blur={2.6}
            far={3.5}
            position={[0, -1.22, 0]}
            resolution={1024}
          />

          {/* HDR studio environment — reflexos realistas */}
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  )
}
