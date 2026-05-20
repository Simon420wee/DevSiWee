import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

/* ─── Cube constants ─────────────────────────────────────────── */
const CLR_EDGE     = new THREE.Color('#2de0f8')
const CLR_EDGE_HOV = new THREE.Color('#b8f5ff')

const RING_CFG = [
  { radius: 0.38, tube: 0.006, axis: new THREE.Vector3(1, 0, 0).normalize(), speed:  0.21, color: '#38bdf8' },
  { radius: 0.45, tube: 0.005, axis: new THREE.Vector3(0, 1, 1).normalize(), speed: -0.15, color: '#67e8f9' },
  { radius: 0.30, tube: 0.007, axis: new THREE.Vector3(1, 1, 0).normalize(), speed:  0.27, color: '#22d3ee' },
]

const ORBITAL_CFG = [
  { speed: 0.095, radius: 0.88, tiltX: 0.0, tiltZ: 1.2, color: '#22d3ee', size: 0.016 },
  { speed: 0.068, radius: 0.98, tiltX: 1.1, tiltZ: 0.3, color: '#67e8f9', size: 0.013 },
  { speed: 0.112, radius: 0.82, tiltX: 2.1, tiltZ: 0.8, color: '#38bdf8', size: 0.018 },
  { speed: 0.058, radius: 1.04, tiltX: 0.6, tiltZ: 2.0, color: '#22d3ee', size: 0.012 },
  { speed: 0.082, radius: 0.93, tiltX: 1.8, tiltZ: 1.5, color: '#a5f3fc', size: 0.014 },
]

/* ─── Platform glow (beneath cube) ──────────────────────────── */
const FLOOR_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const FLOOR_FRAG = /* glsl */`
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float dist  = length(vUv - 0.5) * 2.0;
    float alpha = pow(max(0.0, 1.0 - dist), 1.6) * uOpacity;
    vec3  col   = vec3(0.082, 0.831, 0.976);
    gl_FragColor = vec4(col, alpha);
  }
`

function PlatformGlow({ hovered }) {
  const matRef    = useRef()
  const opacityRef = useRef(0.22)

  useFrame((state, dt) => {
    if (!matRef.current) return
    const base   = hovered ? 0.36 : 0.22
    const pulse  = Math.sin(state.clock.elapsedTime * 0.5) * 0.06
    const target = base + pulse
    const k      = 1 - Math.pow(0.94, dt * 60)
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, k)
    matRef.current.uniforms.uOpacity.value = opacityRef.current
  })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]}>
      <planeGeometry args={[4.5, 4.5, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={FLOOR_VERT}
        fragmentShader={FLOOR_FRAG}
        uniforms={{ uOpacity: { value: 0.22 } }}
        transparent depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ─── Chakra Ring ────────────────────────────────────────────── */
function ChakraRing({ cfg, hovered }) {
  const ref    = useRef()
  const matRef = useRef()
  const geo    = useMemo(() => new THREE.TorusGeometry(cfg.radius, cfg.tube, 6, 80), []) // eslint-disable-line

  useFrame((_, dt) => {
    if (!ref.current || !matRef.current) return
    ref.current.rotateOnAxis(cfg.axis, cfg.speed * dt)
    const k = 1 - Math.pow(0.95, dt * 60)
    matRef.current.opacity = THREE.MathUtils.lerp(
      matRef.current.opacity, hovered ? 0.65 : 0.28, k
    )
  })
  return (
    <mesh ref={ref} geometry={geo}>
      <meshBasicMaterial ref={matRef} color={cfg.color}
        transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

/* ─── Orbital Dot ────────────────────────────────────────────── */
function OrbitalDot({ cfg, phase }) {
  const dotRef = useRef()
  useFrame((state) => {
    if (!dotRef.current) return
    const t = state.clock.elapsedTime * cfg.speed + phase
    dotRef.current.position.set(Math.cos(t) * cfg.radius, Math.sin(t) * cfg.radius, 0)
  })
  return (
    <group rotation={[cfg.tiltX, 0, cfg.tiltZ]}>
      <mesh ref={dotRef}>
        <sphereGeometry args={[cfg.size, 6, 6]} />
        <meshBasicMaterial color={cfg.color}
          transparent opacity={0.90} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/* ─── Scan Ring ──────────────────────────────────────────────── */
function ScanRing() {
  const ref    = useRef()
  const matRef = useRef()
  useFrame((state) => {
    if (!ref.current || !matRef.current) return
    const y = Math.sin(state.clock.elapsedTime * 0.20) * 0.53
    ref.current.position.y = y
    matRef.current.opacity = THREE.MathUtils.lerp(0.30, 0.04, Math.abs(y) / 0.53)
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.70, 0.003, 4, 100]} />
      <meshBasicMaterial ref={matRef} color="#67e8f9"
        transparent opacity={0.20} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

/* ─── Exterior Dust Particles ────────────────────────────────── */
function Particles() {
  const ref = useRef()
  const positions = useMemo(() => {
    const N = 40, pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const r = 1.10 + ((i * 0.41) % 0.42)
      const θ = (i * 137.508 * Math.PI) / 180
      const φ = Math.acos(1 - (2 * (i + 0.5)) / N)
      pos[i*3]   = r * Math.sin(φ) * Math.cos(θ)
      pos[i*3+1] = r * Math.sin(φ) * Math.sin(θ)
      pos[i*3+2] = r * Math.cos(φ)
    }
    return pos
  }, [])
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.030
    ref.current.rotation.x = state.clock.elapsedTime * 0.014
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={40} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#67e8f9" size={0.016}
        transparent opacity={0.55} depthWrite={false}
        blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

/* ══════════════════════════════════════════════════════════════
   SPACE ENVIRONMENT
   All elements rendered inside the Three.js scene so they share
   the same 3D perspective, depth, and Bloom post-processing.
   ══════════════════════════════════════════════════════════════ */

/* ─── Star Field ─────────────────────────────────────────────── */
/*
 * Two concentric layers of stars:
 *   Far  (r = 9–18): 500 tiny white points, very slow drift
 *   Near (r = 3–6) : 140 slightly larger, faster — gives parallax depth
 * Both layers rotate at different speeds to create parallax.
 */
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

function StarField() {
  const farRef  = useRef()
  const nearRef = useRef()

  const farPos = useMemo(() => {
    const N = IS_MOBILE ? 220 : 500, pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const r = 9 + (i * 0.018 % 9)
      const θ = (i * 2.399963) % (Math.PI * 2)   // golden-angle azimuth
      const φ = Math.acos(1 - (2 * (i + 0.5)) / N)
      pos[i*3]   = r * Math.sin(φ) * Math.cos(θ)
      pos[i*3+1] = r * Math.sin(φ) * Math.sin(θ)
      pos[i*3+2] = r * Math.cos(φ)
    }
    return pos
  }, [])

  const nearPos = useMemo(() => {
    const N = IS_MOBILE ? 60 : 140, pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const r = 3.2 + (i * 0.02 % 2.6)
      const θ = (i * 2.399963 + 1.1) % (Math.PI * 2)
      const φ = Math.acos(1 - (2 * (i + 0.5)) / N)
      pos[i*3]   = r * Math.sin(φ) * Math.cos(θ)
      pos[i*3+1] = r * Math.sin(φ) * Math.sin(θ)
      pos[i*3+2] = r * Math.cos(φ)
    }
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (farRef.current) {
      farRef.current.rotation.y = t * 0.0038
      farRef.current.rotation.x = t * 0.0016
    }
    if (nearRef.current) {
      nearRef.current.rotation.y = t * 0.0082
      nearRef.current.rotation.z = t * 0.0024
    }
  })

  return (
    <>
      {/* Distant stars — small, cool white */}
      <points ref={farRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={farPos} count={IS_MOBILE ? 220 : 500} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#d0e8ff" size={0.016} transparent opacity={0.62}
          depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>

      {/* Nearer stars — slightly larger, warmer white, create parallax depth */}
      <points ref={nearRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={nearPos} count={IS_MOBILE ? 60 : 140} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#e8f4ff" size={0.028} transparent opacity={0.48}
          depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </>
  )
}

/* ─── Distant Planet ─────────────────────────────────────────── */
/*
 * Positioned upper-right of the cube canvas: world [3.8, 1.5, -9]
 * Dark sphere + two BackSide atmosphere shells + thin ring system.
 * Slow self-rotation (visible via the ring tilt).
 */
function DistantPlanet() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.005
    }
  })

  return (
    <group ref={groupRef} position={[3.8, 1.5, -9]}>
      {/* Dark planet body — near-black with a deep blue hint */}
      <mesh>
        <sphereGeometry args={[0.9, 48, 32]} />
        <meshBasicMaterial color="#030b1c" />
      </mesh>

      {/* Broad atmospheric glow — wide, soft blue */}
      <mesh scale={1.22}>
        <sphereGeometry args={[0.9, 20, 16]} />
        <meshBasicMaterial color="#0b2d62" transparent opacity={0.20}
          depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>

      {/* Tighter rim light — brighter cyan edge */}
      <mesh scale={1.07}>
        <sphereGeometry args={[0.9, 20, 16]} />
        <meshBasicMaterial color="#0e6eb5" transparent opacity={0.16}
          depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>

      {/* Ring system — outer broad ring */}
      <mesh rotation={[0.32, 0.08, 0.18]}>
        <torusGeometry args={[1.55, 0.055, 3, 90]} />
        <meshBasicMaterial color="#0a3a68" transparent opacity={0.38}
          depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Ring system — inner narrower, slightly brighter */}
      <mesh rotation={[0.32, 0.08, 0.18]}>
        <torusGeometry args={[1.26, 0.032, 3, 90]} />
        <meshBasicMaterial color="#0e5590" transparent opacity={0.28}
          depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/* ─── Space Debris ───────────────────────────────────────────── */
/*
 * 8 low-poly asteroids scattered at radius 2–5 from scene centre.
 * Each is a slightly randomised icosahedron (detail=0, 20 faces).
 * Dark body + glowing blue-edge lineSegments — looks like rocks lit
 * by distant starlight.  Very slow spin + gentle float drift.
 */
const DEBRIS_CFG = [
  { pos: [-2.2,  0.8, -1.6], scale: 0.058, rSpeeds: [0.012, 0.019, 0.008] },
  { pos: [ 2.6, -0.7, -2.1], scale: 0.044, rSpeeds: [0.018, 0.011, 0.015] },
  { pos: [-3.0, -0.4, -3.8], scale: 0.072, rSpeeds: [0.008, 0.016, 0.010] },
  { pos: [ 1.6,  2.0, -4.2], scale: 0.040, rSpeeds: [0.014, 0.009, 0.020] },
  { pos: [-1.8,  1.7, -2.4], scale: 0.032, rSpeeds: [0.022, 0.014, 0.007] },
  { pos: [ 3.3, -1.4, -5.5], scale: 0.062, rSpeeds: [0.010, 0.018, 0.013] },
  { pos: [-2.5, -1.7, -3.3], scale: 0.038, rSpeeds: [0.016, 0.008, 0.018] },
  { pos: [ 0.9,  2.4, -4.8], scale: 0.048, rSpeeds: [0.013, 0.020, 0.011] },
]

function Asteroid({ cfg, idx }) {
  const groupRef = useRef()

  /* Slightly distorted icosahedron — each rock looks unique */
  const geo = useMemo(() => {
    const g   = new THREE.IcosahedronGeometry(1, 0)
    const arr = g.attributes.position.array
    for (let i = 0; i < arr.length; i++) {
      arr[i] *= 0.80 + ((i * 131 + idx * 47) % 100) / 500
    }
    g.attributes.position.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [idx])

  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo])

  /* Deterministic initial rotation so rocks don't all start the same */
  const initRot = useMemo(() => [
    (idx * 1.732) % (Math.PI * 2),
    (idx * 2.618) % (Math.PI * 2),
    (idx * 0.927) % (Math.PI * 2),
  ], [idx])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.x = initRot[0] + t * cfg.rSpeeds[0]
    groupRef.current.rotation.y = initRot[1] + t * cfg.rSpeeds[1]
    groupRef.current.rotation.z = initRot[2] + t * cfg.rSpeeds[2]
    /* Gentle float drift — each rock has its own phase */
    groupRef.current.position.set(
      cfg.pos[0] + Math.sin(t * 0.09  + idx * 0.82) * 0.07,
      cfg.pos[1] + Math.sin(t * 0.115 + idx * 1.25) * 0.10,
      cfg.pos[2]
    )
  })

  return (
    <group ref={groupRef} scale={cfg.scale}>
      {/* Dark rocky body */}
      <mesh geometry={geo}>
        <meshBasicMaterial color="#050e1e" />
      </mesh>
      {/* Edge glow — blue-lit by distant starlight */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#1a5282" transparent opacity={0.60}
          depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  )
}

function SpaceDebris() {
  const cfg = IS_MOBILE ? DEBRIS_CFG.slice(0, 4) : DEBRIS_CFG
  return (
    <>
      {cfg.map((c, i) => <Asteroid key={i} cfg={c} idx={i} />)}
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   SMOKE SYSTEM
   Cursor-driven volumetric smoke on the cube surface.
   ══════════════════════════════════════════════════════════════ */

function useSmokeTexture() {
  return useMemo(() => {
    const sz  = 64
    const c   = document.createElement('canvas')
    c.width   = c.height = sz
    const ctx = c.getContext('2d')
    const g   = ctx.createRadialGradient(sz/2, sz/2, 0, sz/2, sz/2, sz/2)
    g.addColorStop(0.00, 'rgba(255,255,255,1.00)')
    g.addColorStop(0.20, 'rgba(210,248,255,0.88)')
    g.addColorStop(0.50, 'rgba(56,189,248, 0.45)')
    g.addColorStop(0.78, 'rgba(14,165,233, 0.12)')
    g.addColorStop(1.00, 'rgba(0,0,0,     0.00)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, sz, sz)
    return new THREE.CanvasTexture(c)
  }, [])
}

const SMOKE_VERT = /* glsl */`
  attribute float aAlpha;
  attribute float aSize;
  varying   float vAlpha;
  void main() {
    vAlpha       = aAlpha;
    vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (260.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`

const SMOKE_FRAG = /* glsl */`
  uniform sampler2D uMap;
  varying float vAlpha;
  void main() {
    if (vAlpha < 0.004) discard;
    vec4 tex = texture2D(uMap, gl_PointCoord);
    if (tex.a  < 0.004) discard;
    vec3 tint    = vec3(0.44, 0.91, 1.00);
    gl_FragColor = vec4(tex.rgb * tint, tex.a * vAlpha);
  }
`

const MAX_PUFFS = 80

function SmokeSystem({ hoverStateRef }) {
  const texture  = useSmokeTexture()
  const geoRef   = useRef()
  const puffsRef = useRef([])
  const timerRef = useRef(0)

  const positions = useMemo(() => new Float32Array(MAX_PUFFS * 3), [])
  const alphas    = useMemo(() => new Float32Array(MAX_PUFFS),     [])
  const sizes     = useMemo(() => new Float32Array(MAX_PUFFS),     [])

  useFrame((_, dt) => {
    const hs = hoverStateRef.current

    if (hs.active && hs.point) {
      timerRef.current += dt
      const interval = 1 / 22
      while (timerRef.current >= interval && puffsRef.current.length < MAX_PUFFS) {
        timerRef.current -= interval
        const sp = 0.14
        puffsRef.current.push({
          x: hs.point.x + (Math.random() - 0.5) * sp,
          y: hs.point.y + (Math.random() - 0.5) * sp * 0.6,
          z: hs.point.z + (Math.random() - 0.5) * sp * 0.5 + 0.04,
          vx:    (Math.random() - 0.5) * 0.06,
          vy:    0.06 + Math.random() * 0.11,
          vz:    (Math.random() - 0.5) * 0.04,
          size:  0.17 + Math.random() * 0.19,
          alpha: 0.58 + Math.random() * 0.30,
          age:   0,
          life:  0.85 + Math.random() * 0.75,
        })
      }
    } else {
      timerRef.current = 0
    }

    puffsRef.current = puffsRef.current.filter(p => p.age < p.life)

    for (let i = 0; i < MAX_PUFFS; i++) {
      positions[i*3] = positions[i*3+1] = positions[i*3+2] = 0
      alphas[i] = 0
      sizes[i]  = 0.001
    }

    puffsRef.current.forEach((p, i) => {
      if (i >= MAX_PUFFS) return
      p.age += dt
      p.x   += p.vx * dt
      p.y   += p.vy * dt
      p.z   += p.vz * dt
      p.vy  *= 0.993

      const t      = p.age / p.life
      const easeIn = Math.min(1.0, t / 0.10)
      const alpha  = p.alpha * easeIn * (1.0 - t) * (1.0 - t)

      positions[i*3]   = p.x
      positions[i*3+1] = p.y
      positions[i*3+2] = p.z
      alphas[i]        = alpha
      sizes[i]         = p.size * (1.0 + t * 0.85)
    })

    if (geoRef.current) {
      geoRef.current.attributes.position.needsUpdate = true
      geoRef.current.attributes.aAlpha.needsUpdate   = true
      geoRef.current.attributes.aSize.needsUpdate    = true
    }
  })

  return (
    <points renderOrder={1}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" array={positions} count={MAX_PUFFS} itemSize={3} />
        <bufferAttribute attach="attributes-aAlpha"   array={alphas}    count={MAX_PUFFS} itemSize={1} />
        <bufferAttribute attach="attributes-aSize"    array={sizes}     count={MAX_PUFFS} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={SMOKE_VERT}
        fragmentShader={SMOKE_FRAG}
        uniforms={{ uMap: { value: texture } }}
        transparent depthWrite={false} depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Neon Cube ──────────────────────────────────────────────── */
function NeonCube({ hovered, setHovered, hoverStateRef }) {
  const groupRef    = useRef()
  const edgesMatRef = useRef()
  const innerMatRef = useRef()
  const edgesGeo    = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.1, 1.1, 1.1)), [])

  useFrame((_, dt) => {
    if (!groupRef.current || !edgesMatRef.current) return
    groupRef.current.rotation.y += 0.0024 * dt * 60
    groupRef.current.rotation.x += 0.0009 * dt * 60
    groupRef.current.rotation.z += 0.0005 * dt * 60

    const k = 1 - Math.pow(0.96, dt * 60)
    edgesMatRef.current.color.lerp(hovered ? CLR_EDGE_HOV : CLR_EDGE, k)
    edgesMatRef.current.opacity = THREE.MathUtils.lerp(
      edgesMatRef.current.opacity, hovered ? 1.0 : 0.92, k
    )
    if (innerMatRef.current) {
      innerMatRef.current.opacity = THREE.MathUtils.lerp(
        innerMatRef.current.opacity, hovered ? 0.10 : 0.055, k
      )
    }
  })

  return (
    <group ref={groupRef}>
      {/* Invisible proxy — raycasted to get world-space hit point for smoke */}
      <mesh
        onPointerEnter={(e) => {
          e.stopPropagation()
          setHovered(true)
          hoverStateRef.current.active = true
          hoverStateRef.current.point  = e.point.clone()
        }}
        onPointerMove={(e) => {
          e.stopPropagation()
          if (hoverStateRef.current.point) {
            hoverStateRef.current.point.copy(e.point)
          } else {
            hoverStateRef.current.point = e.point.clone()
          }
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          setHovered(false)
          hoverStateRef.current.active = false
        }}
      >
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Outer glass shell */}
      <mesh>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial color="#0ea5e9"
          transparent opacity={0.055} depthWrite={false}
          blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner emissive core — BackSide makes it glow from within */}
      <mesh scale={0.88}>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial ref={innerMatRef} color="#22d3ee"
          transparent opacity={0.055} depthWrite={false}
          blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>

      {/* Neon wire edges */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial ref={edgesMatRef} color={CLR_EDGE}
          transparent opacity={0.92} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {RING_CFG.map((cfg, i) => <ChakraRing key={i} cfg={cfg} hovered={hovered} />)}
    </group>
  )
}

/* ─── Scene Lights ───────────────────────────────────────────── */
function SceneLights({ hovered }) {
  const coreRef = useRef()
  const rimRef  = useRef()

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.96, dt * 60)
    if (coreRef.current) {
      coreRef.current.intensity = THREE.MathUtils.lerp(
        coreRef.current.intensity, hovered ? 16 : 8, k
      )
    }
    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.lerp(
        rimRef.current.intensity, hovered ? 4 : 2, k
      )
    }
  })

  return (
    <>
      <pointLight ref={coreRef} color="#22d3ee" intensity={8} distance={5} decay={2} />
      <pointLight ref={rimRef}  color="#0ea5e9" intensity={2} distance={6} decay={2} position={[0, 1.2, -1.5]} />
      <ambientLight intensity={0.04} />
    </>
  )
}

/* ─── Scene ──────────────────────────────────────────────────── */
function Scene({ hovered, setHovered, hoverStateRef }) {
  const phases = useMemo(
    () => ORBITAL_CFG.map((_, i) => (i * Math.PI * 2) / ORBITAL_CFG.length), []
  )
  return (
    <>
      <SceneLights hovered={hovered} />

      {/* ── Space environment (rendered first = furthest back) ── */}
      <StarField />
      <DistantPlanet />
      <SpaceDebris />

      {/* ── Central cube + atmosphere ───────────────────────── */}
      <NeonCube hovered={hovered} setHovered={setHovered} hoverStateRef={hoverStateRef} />
      <ScanRing />
      <PlatformGlow hovered={hovered} />
      {ORBITAL_CFG.map((cfg, i) => <OrbitalDot key={i} cfg={cfg} phase={phases[i]} />)}
      <Particles />

      {/* ── Cursor smoke (rendered last = on top) ───────────── */}
      <SmokeSystem hoverStateRef={hoverStateRef} />

      <EffectComposer>
        <Bloom
          intensity={2.2}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.55}
          mipmapBlur
          radius={0.82}
        />
      </EffectComposer>
    </>
  )
}

/* ─── Export ─────────────────────────────────────────────────── */
export default function HeroCube3D() {
  const [hovered, setHovered] = useState(false)
  const hoverStateRef = useRef({ active: false, point: null })

  return (
    <div style={{ width: 'min(400px, 94vw)', height: 'min(400px, 94vw)', position: 'relative', cursor: 'default' }}>
      <Canvas
        camera={{ position: [0, 0, 2.9], fov: 48, near: 0.05 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Scene hovered={hovered} setHovered={setHovered} hoverStateRef={hoverStateRef} />
      </Canvas>
    </div>
  )
}
