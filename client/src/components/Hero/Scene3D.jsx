import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Program, Geometry, Mesh } from 'ogl'

const MONOGRAM_TEXT = '.HN'
const GRID_WIDTH = 130
const GRID_HEIGHT = 54
const LUMINANCE_THRESHOLD = 0.82 // below this = part of the letterforms, not the background
const KEEP_PROBABILITY = 0.6
const DEPTH_JITTER = 0.14
const SCALE = 6.2

// Renders the site's own ".HN" mark into an offscreen canvas and samples
// the letterform pixels into a grid of points, so the resulting node
// network reads as the brand mark itself rather than a random blob.
function sampleMonogram() {
  const canvas = document.createElement('canvas')
  canvas.width = GRID_WIDTH
  canvas.height = GRID_HEIGHT
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, GRID_WIDTH, GRID_HEIGHT)
  ctx.fillStyle = '#000'
  ctx.font = `700 ${GRID_HEIGHT * 0.72}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(MONOGRAM_TEXT, GRID_WIDTH / 2, GRID_HEIGHT / 2 + GRID_HEIGHT * 0.04)
  const { data } = ctx.getImageData(0, 0, GRID_WIDTH, GRID_HEIGHT)

  // Same world-units-per-pixel on both axes so the wide, flat mark keeps
  // its true proportions instead of being stretched into a square.
  const cellSize = SCALE / GRID_WIDTH

  const grid = new Array(GRID_WIDTH * GRID_HEIGHT).fill(false)
  const nodes = []
  const nodeIndexByCell = new Map()

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const i = (row * GRID_WIDTH + col) * 4
      const luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
      const isSubject = luminance < LUMINANCE_THRESHOLD
      if (isSubject && Math.random() < KEEP_PROBABILITY) {
        const cell = row * GRID_WIDTH + col
        grid[cell] = true
        const x = (col - GRID_WIDTH / 2) * cellSize
        const y = (GRID_HEIGHT / 2 - row) * cellSize
        const z = (Math.random() - 0.5) * 2 * DEPTH_JITTER
        nodeIndexByCell.set(cell, nodes.length)
        nodes.push({ x, y, z, seed: Math.random() })
      }
    }
  }

  const edgeSet = new Set()
  const edges = []
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = row * GRID_WIDTH + col
      if (!grid[cell]) continue
      const a = nodeIndexByCell.get(cell)
      ;[
        [col + 1, row],
        [col, row + 1],
      ].forEach(([nc, nr]) => {
        if (nc >= GRID_WIDTH || nr >= GRID_HEIGHT) return
        const neighborCell = nr * GRID_WIDTH + nc
        if (!grid[neighborCell]) return
        const b = nodeIndexByCell.get(neighborCell)
        const key = a < b ? `${a}_${b}` : `${b}_${a}`
        if (!edgeSet.has(key)) {
          edgeSet.add(key)
          edges.push([a, b])
        }
      })
    }
  }

  return { nodes, edges }
}

const NODE_VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute float aSeed;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uActivation;
  uniform float uNear;
  uniform float uFar;

  varying float vGlow;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float viewZ = -mvPosition.z;
    float depthFade = smoothstep(uFar, uNear, viewZ);

    float pulseSpeed = mix(0.8, 2.6, uActivation);
    float pulse = 0.5 + 0.5 * sin(uTime * pulseSpeed + aSeed * 60.0);

    float size = (2.0 + aSeed * 1.8 + pulse * 1.3) * (18.0 / viewZ) * mix(0.5, 1.0, depthFade);
    gl_PointSize = size;

    vGlow = depthFade * mix(0.55, 1.0, pulse) * mix(0.6, 1.0, uActivation);
  }
`

const NODE_FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vGlow;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorA, uColorB, clamp(vGlow, 0.0, 1.0));

    gl_FragColor = vec4(color, core * clamp(mix(0.5, 1.0, vGlow), 0.0, 1.0));
  }
`

const LINE_VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute float aSeed;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uActivation;
  uniform float uNear;
  uniform float uFar;

  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float viewZ = -mvPosition.z;
    float depthFade = smoothstep(uFar, uNear, viewZ);

    float pulseSpeed = mix(0.8, 2.6, uActivation);
    float pulse = 0.5 + 0.5 * sin(uTime * pulseSpeed + aSeed * 60.0);

    vAlpha = depthFade * mix(0.08, 0.26, pulse) * mix(0.7, 1.0, uActivation);
  }
`

const LINE_FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform vec3 uColorA;

  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColorA, vAlpha);
  }
`

const COLOR_DIM = [0.18, 0.29, 0.17]
const COLOR_BRIGHT = [0.87, 0.74, 0.28]
const SWING_AMPLITUDE = Math.PI / 4 // ±45°, so it reverses well before the text turns edge-on
const SWING_PERIOD = 12 // seconds for one full back-and-forth pass

function createScene(canvas) {
  const renderer = new Renderer({
    canvas,
    alpha: true,
    antialias: true,
    dpr: Math.min(window.devicePixelRatio || 1, 1.5),
  })
  const gl = renderer.gl
  gl.clearColor(0, 0, 0, 0)

  const camera = new Camera(gl, { fov: 35 })
  camera.position.set(0, 0, 6)

  const scene = new Transform()

  const sharedUniforms = () => ({
    uTime: { value: 0 },
    uActivation: { value: 0.15 },
    uNear: { value: 4.4 },
    uFar: { value: 7.4 },
  })

  const { nodes, edges } = sampleMonogram()

  const nodePositions = new Float32Array(nodes.length * 3)
  const nodeSeeds = new Float32Array(nodes.length)
  nodes.forEach((n, i) => {
    nodePositions[i * 3] = n.x
    nodePositions[i * 3 + 1] = n.y
    nodePositions[i * 3 + 2] = n.z
    nodeSeeds[i] = n.seed
  })

  const linePositions = new Float32Array(edges.length * 2 * 3)
  const lineSeeds = new Float32Array(edges.length * 2)
  edges.forEach(([a, b], i) => {
    const seed = Math.random()
    const na = nodes[a]
    const nb = nodes[b]
    linePositions[i * 6] = na.x
    linePositions[i * 6 + 1] = na.y
    linePositions[i * 6 + 2] = na.z
    linePositions[i * 6 + 3] = nb.x
    linePositions[i * 6 + 4] = nb.y
    linePositions[i * 6 + 5] = nb.z
    lineSeeds[i * 2] = seed
    lineSeeds[i * 2 + 1] = seed
  })

  const nodeGeometry = new Geometry(gl, {
    position: { size: 3, data: nodePositions },
    aSeed: { size: 1, data: nodeSeeds },
  })
  const nodeProgram = new Program(gl, {
    vertex: NODE_VERTEX,
    fragment: NODE_FRAGMENT,
    uniforms: { uColorA: { value: COLOR_DIM }, uColorB: { value: COLOR_BRIGHT }, ...sharedUniforms() },
    transparent: true,
    depthTest: false,
  })
  nodeProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  const nodeMesh = new Mesh(gl, { mode: gl.POINTS, geometry: nodeGeometry, program: nodeProgram })
  nodeMesh.setParent(scene)

  const lineGeometry = new Geometry(gl, {
    position: { size: 3, data: linePositions },
    aSeed: { size: 1, data: lineSeeds },
  })
  const lineProgram = new Program(gl, {
    vertex: LINE_VERTEX,
    fragment: LINE_FRAGMENT,
    uniforms: { uColorA: { value: COLOR_DIM }, ...sharedUniforms() },
    transparent: true,
    depthTest: false,
  })
  lineProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  const lineMesh = new Mesh(gl, { mode: gl.LINES, geometry: lineGeometry, program: lineProgram })
  lineMesh.setParent(scene)

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
  const activation = { value: 0.15, target: 0.15 }

  function resize(width, height) {
    if (!width || !height) return
    renderer.setSize(width, height)
    camera.perspective({ aspect: width / height })
  }

  function setPointer(x, y) {
    pointer.targetX = x
    pointer.targetY = y
  }

  function setActive(isActive) {
    activation.target = isActive ? 1 : 0.15
  }

  let rafId = null
  let running = false
  let startTime = null

  function frame(time) {
    if (!running) return

    if (startTime === null) startTime = time
    const t = time * 0.001
    const elapsed = (time - startTime) * 0.001

    activation.value += (activation.target - activation.value) * 0.05

    nodeProgram.uniforms.uTime.value = t
    nodeProgram.uniforms.uActivation.value = activation.value
    lineProgram.uniforms.uTime.value = t
    lineProgram.uniforms.uActivation.value = activation.value

    pointer.x += (pointer.targetX - pointer.x) * 0.05
    pointer.y += (pointer.targetY - pointer.y) * 0.05

    scene.rotation.y = Math.sin((elapsed / SWING_PERIOD) * Math.PI * 2) * SWING_AMPLITUDE
    scene.rotation.x = pointer.y * -0.25

    renderer.render({ scene, camera })

    rafId = requestAnimationFrame(frame)
  }

  return {
    start() {
      if (running) return
      running = true
      startTime = null
      rafId = requestAnimationFrame(frame)
    },
    stop() {
      running = false
      if (rafId) cancelAnimationFrame(rafId)
      rafId = null
    },
    resize,
    setPointer,
    setActive,
  }
}

function Scene3D() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const scene = createScene(canvas)
    scene.resize(container.clientWidth, container.clientHeight)

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      scene.resize(width, height)
    })
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) {
        scene.start()
      } else {
        scene.stop()
      }
    })
    intersectionObserver.observe(container)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        scene.stop()
      } else if (container.getBoundingClientRect().top < window.innerHeight) {
        scene.start()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      scene.setPointer(x, y)
    }
    const handlePointerEnter = () => scene.setActive(true)
    const handlePointerLeave = () => {
      scene.setPointer(0, 0)
      scene.setActive(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerenter', handlePointerEnter)
    container.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerenter', handlePointerEnter)
      container.removeEventListener('pointerleave', handlePointerLeave)
      scene.stop()
    }
  }, [])

  return (
    <div ref={containerRef} className="hero__scene3d hero__scene3d--particles">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Scene3D
