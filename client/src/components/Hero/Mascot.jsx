import { useEffect, useRef } from 'react'
import './Mascot.css'

const FLOOR_Y = 340
const DEPTH_Y = 0.5
const DEPTH_SCALE = 0.0025
const CHEER_SECONDS = 1.8
const RAD = Math.PI / 180
const RAISE = 8 // lifts the body (not the feet) so the legs show below the belly

const INK = '#161616'
const FAR = '#e3e9ee'

// Positions are on the floor: x across the screen, z toward the camera.
const fwd = (deg) => [Math.sin(deg * RAD), Math.cos(deg * RAD)]
const stand = (target, deg, hold) => {
  const [fx, fz] = fwd(deg)
  return [target[0] - hold * fx, target[1] - hold * fz]
}

const COLORS = { dot: '#ee6c4d', h: '#161616', n: '#2f4a2b' }

// The story: letters wait outside the frame; the mascot runs out for each one,
// brings it in and puts it down in its dashed slot.
const LOOP = 30.6
const WAVE = [25.0, 28.0]
const STATIC_TIME = 26.0
const START_YAW = -90

const ITEMS = [
  { key: 'dot', start: [-60, -10], slot: [204, 0], hold: 58, pickDeg: 90, placeDeg: 60, ps: 1.6, pe: 2.2, ce: 4.8, pl: 5.5, lift: 76, cs: 1 },
  { key: 'h', start: [670, 40], slot: [278, 0], hold: 72, pickDeg: -90, placeDeg: -110, ps: 9.8, pe: 10.4, ce: 13.4, pl: 14.1, lift: 44, cs: 0.72 },
  { key: 'n', start: [700, -35], slot: [374, 0], hold: 72, pickDeg: -90, placeDeg: -80, ps: 17.8, pe: 18.4, ce: 21.0, pl: 21.7, lift: 44, cs: 0.72 },
]
ITEMS.forEach((it) => {
  it.pickAt = stand(it.start, it.pickDeg, it.hold)
  it.placeAt = stand(it.slot, it.placeDeg, it.hold)
})
const [DOT, H, N] = ITEMS

const TRIPS = [
  { t0: 0, t1: 1.5, pts: [[60, 25], DOT.pickAt] },
  { t0: 2.4, t1: 4.8, pts: [DOT.pickAt, DOT.placeAt] },
  { t0: 5.7, t1: 9.7, pts: [DOT.placeAt, H.pickAt] },
  { t0: 10.6, t1: 13.4, pts: [H.pickAt, H.placeAt] },
  { t0: 14.3, t1: 17.7, pts: [H.placeAt, N.pickAt] },
  { t0: 18.6, t1: 21.0, pts: [N.pickAt, N.placeAt] },
  { t0: 21.9, t1: 24.9, pts: [N.placeAt, [300, -62], [130, -35], [84, 55]] },
  { t0: 28.2, t1: 30.0, pts: [[84, 55], [-100, 55]] },
]
TRIPS.forEach((trip) => {
  trip.lens = trip.pts.slice(1).map((p, i) => Math.hypot(p[0] - trip.pts[i][0], p[1] - trip.pts[i][1]))
  trip.total = trip.lens.reduce((x, y) => x + y, 0)
})

// Where the character looks while standing still (while walking it looks where it is going).
const HEADINGS = [
  [0, -90], [1.5, DOT.pickDeg], [4.8, DOT.placeDeg], [9.7, H.pickDeg], [13.4, H.placeDeg],
  [17.7, N.pickDeg], [21.0, N.placeDeg], [24.9, 0],
]

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const smooth = (u) => u * u * (3 - 2 * u)
const lerp = (a, b, u) => a + (b - a) * u
const wrap180 = (a) => ((((a + 180) % 360) + 360) % 360) - 180

// Walking speed stays constant in the middle of a trip and only ramps at the ends.
function trapezoid(u, ramp = 0.22) {
  const vmax = 1 / (1 - ramp)
  if (u < ramp) return (vmax * u * u) / (2 * ramp)
  if (u > 1 - ramp) {
    const w = 1 - u
    return 1 - (vmax * w * w) / (2 * ramp)
  }
  return (vmax * ramp) / 2 + vmax * (u - ramp)
}

function charPos(t) {
  let pos = TRIPS[0].pts[0]
  for (const trip of TRIPS) {
    if (t >= trip.t1) {
      pos = trip.pts[trip.pts.length - 1]
      continue
    }
    if (t < trip.t0) break
    let d = trapezoid((t - trip.t0) / (trip.t1 - trip.t0)) * trip.total
    for (let i = 0; i < trip.lens.length; i++) {
      if (d <= trip.lens[i] || i === trip.lens.length - 1) {
        const u = trip.lens[i] === 0 ? 0 : clamp(d / trip.lens[i], 0, 1)
        const a = trip.pts[i]
        const b = trip.pts[i + 1]
        return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]
      }
      d -= trip.lens[i]
    }
  }
  return pos
}

function restHeading(t) {
  let heading = HEADINGS[0][1]
  for (const [time, value] of HEADINGS) if (t >= time) heading = value
  return heading
}

// Damped spring so every channel eases and overshoots a little instead of snapping.
function spring(s, target, dt, stiffness, damping) {
  const steps = Math.max(1, Math.ceil(dt / 0.012))
  const h = dt / steps
  for (let i = 0; i < steps; i++) {
    s.v += (stiffness * (target - s.x) - damping * s.v) * h
    s.x += s.v * h
  }
  return s.x
}

const makeSpring = (x = 0) => ({ x, v: 0 })

function Limb({ name, layer, foot }) {
  return (
    <g data-limb={name} data-lay={layer}>
      <line data-k="ink" stroke={INK} strokeWidth="28" strokeLinecap="round" />
      <line data-k="fill" stroke="#fff" strokeWidth="20" strokeLinecap="round" />
      {foot && <ellipse data-k="foot" className="mascot-w" cx="7" cy="0" rx="21" ry="12" vectorEffect="non-scaling-stroke" />}
    </g>
  )
}

// Legs hang below the body, so both legs are drawn behind the torso ("back" = far leg, "mid" = near leg).
function Layer({ layer }) {
  const withArms = layer !== 'mid'
  const withLegs = layer !== 'front'
  const withHeadwear = layer !== 'mid'
  return (
    <g data-layer={layer}>
      {withLegs && ['legA', 'legB'].map((n) => <Limb key={n} name={n} layer={layer} foot />)}
      {withArms && ['armA', 'armB'].map((n) => <Limb key={n} name={n} layer={layer} />)}
      {withHeadwear && (
        <>
          <path data-band={layer} fill="none" stroke="#ee6c4d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {['A', 'B'].map((n) => (
            <ellipse key={n} data-cup={n} data-lay={layer} cy="0" ry="12.5" fill="#ee6c4d" stroke={INK} strokeWidth="3" />
          ))}
        </>
      )}
    </g>
  )
}

function Item({ k }) {
  const wide = k !== 'dot'
  return (
    <g data-item={k}>
      <ellipse data-shadow cx="0" cy="2" rx={wide ? 44 : 18} ry={wide ? 5 : 4} fill={INK} opacity="0.12" />
      <use href={`#mascot-shape-${k}`} fill={COLORS[k]} stroke={COLORS[k]} strokeWidth="4" strokeLinejoin="round" />
    </g>
  )
}

function Mascot() {
  const rootRef = useRef(null)
  const cheerRef = useRef(-1)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const q = (selector) => root.querySelector(selector)
    const all = (selector) => [...root.querySelectorAll(selector)]
    const part = (name) => q(`[data-part="${name}"]`)

    const limbs = {}
    const LIMB_LAYERS = { armA: ['back', 'front'], armB: ['back', 'front'], legA: ['back', 'mid'], legB: ['back', 'mid'] }
    Object.entries(LIMB_LAYERS).forEach(([name, layers]) => {
      limbs[name] = layers.map((layer) => {
        const g = q(`[data-limb="${name}"][data-lay="${layer}"]`)
        return {
          g,
          ink: g.querySelector('[data-k="ink"]'),
          fill: g.querySelector('[data-k="fill"]'),
          foot: g.querySelector('[data-k="foot"]'),
        }
      })
    })
    const bands = { back: q('[data-band="back"]'), front: q('[data-band="front"]') }
    const cups = { A: all('[data-cup="A"]'), B: all('[data-cup="B"]') }
    const dom = {
      svg: q('svg'), char: part('char'), shadow: part('shadow'),
      torso: part('torso'), belly: part('belly'), head: part('head'),
      eyeA: part('eyeA'), eyeB: part('eyeB'), mouth: part('mouth'), mouthO: part('mouthO'),
      bubble: part('bubble'), bubble2: part('bubble2'), actors: part('actors'),
    }
    const items = ITEMS.map((it) => ({
      ...it,
      el: q(`[data-item="${it.key}"]`),
      ghost: q(`[data-ghost="${it.key}"]`),
      y: makeSpring(0),
      angle: makeSpring(0),
    }))
    const charEntry = { el: dom.char, z: 0 }
    let orderKey = ''

    const S = {
      yaw: makeSpring(START_YAW),
      bend: makeSpring(0),
      carry: makeSpring(0),
      armA: makeSpring(0),
      armB: makeSpring(0),
      splayA: makeSpring(-12),
      splayB: makeSpring(-12),
      lagX: makeSpring(0),
      lagY: makeSpring(0),
      look: makeSpring(0),
      mouth: makeSpring(0),
    }
    let prev = null
    let vx = 0
    let vz = 0
    let accel = 0
    let phase = 0
    let pointer = null

    const render = (t, dt) => {
      const [X, Z] = charPos(t)
      let dX = 0
      let dZ = 0
      if (prev) {
        dX = X - prev[0]
        dZ = Z - prev[1]
      }
      const jump = Math.hypot(dX, dZ) > 150
      if (jump) {
        dX = 0
        dZ = 0
      }
      const k = Math.min(1, dt * 12)
      const nvx = dt > 0 ? dX / dt : 0
      const nvz = dt > 0 ? dZ / dt : 0
      const prevSpeed = Math.hypot(vx, vz)
      vx += (nvx - vx) * k
      vz += (nvz - vz) * k
      const speed = Math.hypot(vx, vz * 0.9)
      accel += (dt > 0 ? (speed - prevSpeed) / dt - accel : 0) * Math.min(1, dt * 8)
      phase += Math.hypot(dX, dZ) * 0.095
      prev = [X, Z]

      const cheer = cheerRef.current
      const cu = cheer >= 0 ? cheer / CHEER_SECONDS : -1
      const cheering = cu >= 0 && cu < 1

      // Heading: look where we walk, otherwise the scripted pose.
      const headingTarget = speed > 28 ? (Math.atan2(vx, vz) * 180) / Math.PI : restHeading(t)
      const yawNow = S.yaw.x
      const yaw = spring(S.yaw, yawNow + wrap180(headingTarget - yawNow), dt, 62, 12.5)
      const c = Math.cos(yaw * RAD)
      const s = Math.sin(yaw * RAD)

      const m = smooth(clamp(speed / 55, 0, 1))
      const bob = m * Math.abs(Math.sin(phase)) * 5
      const hop = cheering ? -26 * Math.sin(Math.PI * clamp(cu / 0.45, 0, 1)) : 0

      let bendTarget = 0
      let carrying = false
      items.forEach((it) => {
        if (t >= it.ps && t < it.pe) bendTarget = Math.max(bendTarget, Math.sin((Math.PI * (t - it.ps)) / (it.pe - it.ps)))
        if (t >= it.ce && t < it.pl) bendTarget = Math.max(bendTarget, Math.sin((Math.PI * (t - it.ce)) / (it.pl - it.ce)))
        if (t >= it.ps + 0.2 && t < it.pl - 0.1) carrying = true
      })
      const pointing = t >= WAVE[0] && t < WAVE[1]
      const waving = cheering
      const bend = spring(S.bend, bendTarget, dt, 130, 17)
      const carry = spring(S.carry, carrying ? 1 : 0, dt, 70, 13)

      const scale = 1 + Z * DEPTH_SCALE
      const sy = FLOOR_Y + Z * DEPTH_Y
      dom.char.setAttribute('transform', `translate(${X.toFixed(2)} ${sy.toFixed(2)}) scale(${scale.toFixed(4)})`)
      dom.shadow.setAttribute('rx', (50 - (bob - hop) * 0.9).toFixed(1))

      // Lean toward the facing direction (screen x only shows when seen from the side).
      const lean = (m * 3 + bend * 13) * RAD
      const roll = Math.sin(phase) * m * 2.4
      const breathe = 1 + Math.sin(t * 1.6) * 0.012
      const squash = 1 - bend * 0.07
      const torsoDX = Math.tan(lean) * 72 * s + roll * c
      const lagX = spring(S.lagX, -clamp(accel / 260, -1, 1) * 3.5 * s, dt, 90, 8)
      const lagY = spring(S.lagY, bob * 0.5 - hop * 0.15, dt, 110, 9)
      const bodyY = -bob + hop - RAISE
      const set = (el, attrs) => Object.entries(attrs).forEach(([n, v]) => el.setAttribute(n, typeof v === 'number' ? v.toFixed(2) : v))

      set(dom.torso, { cx: torsoDX, cy: -72 + bodyY, rx: 56, ry: 58 * squash * breathe })
      set(dom.belly, { cx: torsoDX, cy: -36 + bodyY, rx: 34, ry: 9 })
      const headDX = Math.tan(lean) * 143 * s + roll * c * 1.2 + lagX + 4 * s
      const headY = bodyY + lagY
      set(dom.head, { cx: headDX, cy: -143 + headY + bend * 4, rx: 28, ry: 21 })

      // Face sits on the head surface and disappears when we face away.
      const look = spring(S.look, clamp(vx / 90, -1, 1) * 1.5 + (pointing ? 3 : 0) + (pointer ? clamp((pointer.x - (dom.svg.getBoundingClientRect().left + (dom.svg.getBoundingClientRect().width * X) / 600)) / 300, -1, 1) * 2 : 0), dt, 220, 24)
      const face = (u, y, w) => {
        const x = u * c + w * s + headDX
        const z = -u * s + w * c
        return [x, y + headY + bend * 4, z]
      }
      const b = t % 4.7
      let blink = 1
      if (b > 4.4 && b < 4.64) blink = 1 - 0.88 * Math.sin((Math.PI * (b - 4.4)) / 0.24) ** 2
      ;[[dom.eyeA, 10], [dom.eyeB, -10]].forEach(([el, u]) => {
        const [x, y, z] = face(u, -145, 24)
        const vis = clamp(z / 24, 0, 1)
        el.setAttribute('display', vis > 0.04 ? 'inline' : 'none')
        set(el, { cx: x + look * vis, cy: y, rx: 3.2 * vis, ry: 4.3 * blink })
      })
      const [mx1, my1, mz1] = face(-5, -135, 26)
      const [mxm, mym] = face(0, -130.5, 26)
      const [mx2, my2] = face(5, -135, 26)
      const mouthVis = clamp(mz1 / 24, 0, 1)
      dom.mouth.setAttribute('display', mouthVis > 0.06 ? 'inline' : 'none')
      dom.mouth.setAttribute('d', `M${mx1.toFixed(2)} ${my1.toFixed(2)} Q${(2 * mxm - (mx1 + mx2) / 2).toFixed(2)} ${(2 * mym - (my1 + my2) / 2).toFixed(2)} ${mx2.toFixed(2)} ${my2.toFixed(2)}`)
      const open = clamp(spring(S.mouth, waving || pointing ? 1 : 0, dt, 200, 22), 0, 1)
      const [ox, oy] = face(0, -133, 26)
      dom.mouthO.setAttribute('display', open > 0.05 && mouthVis > 0.06 ? 'inline' : 'none')
      set(dom.mouthO, { cx: ox, cy: oy, rx: 4.5 * mouthVis * open, ry: 4 * open })

      // Headphones: two cups at the sides and a band over the top, split into front/back halves.
      ;['A', 'B'].forEach((n, i) => {
        const u = i === 0 ? 29 : -29
        const x = u * c + headDX
        const z = -u * s
        const layer = z < -0.5 ? 0 : 1
        cups[n].forEach((el, idx) => {
          el.setAttribute('display', idx === layer ? 'inline' : 'none')
          set(el, { cx: x, cy: -142 + headY + bend * 4, rx: 7 + 5.5 * Math.abs(s) })
        })
      })
      const backPts = []
      const frontPts = []
      for (let i = 0; i <= 16; i++) {
        const a = (i / 16) * Math.PI
        const u = 29 * Math.cos(a)
        const x = u * c + headDX
        const y = -142 - 33 * Math.sin(a) + headY + bend * 4
        const z = -u * s
        ;(z < -0.5 ? backPts : frontPts).push([x, y, i])
      }
      const toPath = (pts) => {
        let d = ''
        let last = -2
        pts.forEach(([x, y, i]) => {
          d += `${i === last + 1 ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)} `
          last = i
        })
        return d
      }
      bands.back.setAttribute('d', toPath(backPts))
      bands.front.setAttribute('d', toPath(frontPts))

      // Limbs: swing forward/back along the facing direction; foreshortened when seen head-on.
      const sw = Math.sin(phase)
      const cw = Math.cos(phase)
      const armSplay = lerp(-12, 30, carry)
      const armAlpha = (side) => {
        if (pointing) return side === 'A' ? 10 : 60
        if (waving && side === 'A') return 118 + Math.sin(t * 10) * 14
        return lerp((side === 'A' ? -sw : sw) * 22 * m, 72, carry)
      }
      const spA = spring(S.armA, armAlpha('A'), dt, 150, 15)
      const spB = spring(S.armB, armAlpha('B'), dt, 150, 15)
      // Presenting pose: one arm sweeps up toward the logo, the other hand rests on the chest ("me").
      const splayA = spring(S.splayA, pointing ? -125 + Math.sin(t * 4) * 4 : armSplay, dt, 120, 14)
      const splayB = spring(S.splayB, pointing ? 55 : armSplay, dt, 120, 14)
      const placeLimb = (name, shoulder, alpha, splayDeg, len, foot, liftY, side) => {
        const ar = alpha * RAD
        const sr = splayDeg * RAD
        const su = side * shoulder[0]
        const by = foot ? bodyY + RAISE : bodyY
        const sx0 = su * c + torsoDX * (shoulder[1] < -70 ? 1 : 0.3)
        const sy0 = shoulder[1] + by
        const sz0 = -su * s
        const tu = su - side * Math.sin(sr) * len
        const tyy = shoulder[1] + Math.cos(ar) * Math.cos(sr) * len + by - liftY
        const tw = Math.sin(ar) * Math.cos(sr) * len
        const tx = tu * c + tw * s + torsoDX * (shoulder[1] < -70 ? 1 : 0.3)
        const tz = -tu * s + tw * c
        const layer = (sz0 + tz) / 2 < -0.5 ? 0 : 1
        const color = (sz0 + tz) / 2 < -6 ? FAR : '#fff'
        limbs[name].forEach((l, idx) => {
          l.g.setAttribute('display', idx === layer ? 'inline' : 'none')
          ;[l.ink, l.fill].forEach((ln) => set(ln, { x1: sx0, y1: sy0, x2: tx, y2: tyy }))
          l.fill.setAttribute('stroke', color)
          if (foot) {
            // The shoe is a footprint on the floor: rotate it with the heading, then flatten it for perspective.
            const footAngle = (Math.atan2(c, s) * 180) / Math.PI
            l.foot.setAttribute('transform', `translate(${tx.toFixed(2)} ${(tyy + 2).toFixed(2)}) scale(1 0.62) rotate(${footAngle.toFixed(1)})`)
            l.foot.style.fill = color
          }
        })
      }
      placeLimb('armA', [58, -102], spA, splayA, 46, false, 0, 1)
      placeLimb('armB', [58, -102], spB, splayB, 46, false, 0, -1)
      placeLimb('legA', [18, -40], sw * 22 * m, 0, 38, true, Math.max(0, cw) * 7 * m - hop * 0.3, 1)
      placeLimb('legB', [18, -40], -sw * 22 * m, 0, 38, true, Math.max(0, -cw) * 7 * m - hop * 0.3, -1)

      if (cheering) {
        const sc = cu < 0.12 ? (cu / 0.12) * 1.1 : cu < 0.2 ? lerp(1.1, 1, (cu - 0.12) / 0.08) : 1
        const o = cu > 0.85 ? clamp((1 - cu) / 0.15, 0, 1) : 1
        dom.bubble.setAttribute('transform', `translate(${clamp(X, 80, 520).toFixed(1)} ${(sy - 214 * scale).toFixed(1)}) scale(${sc.toFixed(3)})`)
        dom.bubble.setAttribute('opacity', o.toFixed(2))
      } else {
        dom.bubble.setAttribute('opacity', 0)
      }

      // "It's me!" pops up while the mascot points at the finished logo.
      if (pointing) {
        const u2 = clamp((t - (WAVE[0] + 0.5)) / 0.5, 0, 1)
        const sc2 = u2 < 0.6 ? (u2 / 0.6) * 1.12 : lerp(1.12, 1, (u2 - 0.6) / 0.4)
        const o2 = u2 > 0 ? clamp((WAVE[1] - t) / 0.35, 0, 1) : 0
        dom.bubble2.setAttribute('transform', `translate(${clamp(X + 14, 90, 520).toFixed(1)} ${(sy - 214 * scale).toFixed(1)}) scale(${sc2.toFixed(3)})`)
        dom.bubble2.setAttribute('opacity', o2.toFixed(2))
      } else {
        dom.bubble2.setAttribute('opacity', 0)
      }

      const alpha = t < 0.6 ? t / 0.6 : t > LOOP - 1.4 ? clamp((LOOP - 0.6 - t) / 0.8, 0, 1) : 1

      const entries = [charEntry]
      charEntry.z = Z
      items.forEach((it, idx) => {
        let ix = it.start[0]
        let iz = it.start[1]
        let iy = 0
        let isx = 1
        let isy = 1
        let cscale = 1
        let carried = false
        const heldX = X + it.hold * s
        const heldZ = Z + it.hold * c
        if (t < it.ps) {
          // waiting on the floor
        } else if (t < it.pe) {
          const u = smooth((t - it.ps) / (it.pe - it.ps))
          iy = -it.lift * u
          cscale = lerp(1, it.cs, u)
        } else if (t < it.ce) {
          const blend = smooth(clamp((t - it.pe) / 0.3, 0, 1))
          ix = lerp(it.start[0], heldX, blend)
          iz = lerp(it.start[1], heldZ, blend)
          iy = -it.lift - bob * 0.6
          cscale = it.cs
          carried = true
        } else if (t < it.pl) {
          const p = (t - it.ce) / (it.pl - it.ce)
          const e = smooth(p)
          ix = lerp(heldX, it.slot[0], e)
          iz = lerp(heldZ, it.slot[1], e)
          iy = -it.lift * (1 - p * p)
          cscale = lerp(it.cs, 1, p * p)
          if (p > 0.88) {
            const bounce = Math.sin((Math.PI * (p - 0.88)) / 0.12)
            isy = 1 - 0.12 * bounce
            isx = 1 + 0.08 * bounce
          }
        } else {
          ix = it.slot[0]
          iz = it.slot[1]
        }
        if (carried) {
          iy = spring(it.y, iy, dt, 190, 15)
        } else {
          it.y.x = iy
          it.y.v = 0
        }
        const angle = spring(it.angle, carried ? lean * 20 * s - clamp(accel / 300, -1, 1) * 4 : 0, dt, 110, 9)
        if (t >= WAVE[0] && t < WAVE[1] + 0.4) {
          const u = clamp((t - (WAVE[0] + idx * 0.22)) / 0.8, 0, 1)
          const h = Math.sin(Math.PI * u)
          iy -= 16 * h
          isy *= 1 + 0.06 * h
          isx *= 1 - 0.04 * h
        }
        const isc = 1 + iz * DEPTH_SCALE
        const isyScreen = FLOOR_Y + iz * DEPTH_Y
        it.el.setAttribute(
          'transform',
          `translate(${ix.toFixed(2)} ${(isyScreen + iy * isc).toFixed(2)}) rotate(${angle.toFixed(2)}) scale(${(isx * cscale * isc).toFixed(3)} ${(isy * cscale * isc).toFixed(3)})`
        )
        it.el.setAttribute('opacity', alpha)
        it.el.querySelector('[data-shadow]').setAttribute('opacity', (0.12 * clamp(1 + iy / 90, 0.2, 1)).toFixed(3))
        it.ghost.setAttribute('opacity', t < it.pl ? 0.22 * alpha : 0)
        entries.push({ el: it.el, z: iz + 0.01 })
      })

      // Paint far things first so the character can walk behind and in front of the letters.
      entries.sort((a, b) => a.z - b.z)
      const key = entries.map((e) => e.el.getAttribute('data-item') || 'char').join(',')
      if (key !== orderKey) {
        orderKey = key
        entries.forEach((e) => dom.actors.appendChild(e.el))
      }    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      for (let i = 0; i < 40; i++) render(STATIC_TIME, 0.03)
      return undefined
    }

    render(0, 0.016)

    let raf = null
    let last = 0
    let clock = 0
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      clock += dt
      if (cheerRef.current >= 0) {
        cheerRef.current += dt
        if (cheerRef.current > CHEER_SECONDS) cheerRef.current = -1
      }
      render(clock % LOOP, dt)
      raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = null
    }

    let inView = true
    const sync = () => (inView && !document.hidden ? start() : stop())
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      sync()
    })
    observer.observe(root)
    document.addEventListener('visibilitychange', sync)
    const handlePointerMove = (event) => {
      pointer = { x: event.clientX }
    }
    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  const handleClick = () => {
    if (cheerRef.current < 0) cheerRef.current = 0
  }

  return (
    <div ref={rootRef} className="mascot" onClick={handleClick}>
      <svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <g id="mascot-shape-dot">
            <circle cx="0" cy="-14" r="14" />
          </g>
          <g id="mascot-shape-h">
            <rect x="-38" y="-84" width="18" height="84" rx="6" />
            <rect x="20" y="-84" width="18" height="84" rx="6" />
            <rect x="-38" y="-50" width="76" height="18" rx="6" />
          </g>
          <g id="mascot-shape-n">
            <rect x="-38" y="-84" width="18" height="84" rx="6" />
            <rect x="20" y="-84" width="18" height="84" rx="6" />
            <polygon points="-38,-84 -16,-84 38,0 16,0" />
          </g>
        </defs>

        <rect x="0" y="300" width="600" height="150" fill="#f7e2c6" />
        <line x1="0" y1="300" x2="600" y2="300" stroke="#ead2b0" strokeWidth="3" />

        {ITEMS.map((it) => (
          <use
            key={it.key}
            data-ghost={it.key}
            href={`#mascot-shape-${it.key}`}
            fill="none"
            stroke="#161616"
            strokeWidth="3"
            strokeDasharray="6 6"
            transform={`translate(${it.slot[0]} ${FLOOR_Y})`}
          />
        ))}

        <g data-part="actors">
          {ITEMS.map((it) => (
            <Item key={it.key} k={it.key} />
          ))}
          <g data-part="char">
            <ellipse data-part="shadow" cx="0" cy="2" rx="50" ry="8" fill={INK} opacity="0.14" />
            <Layer layer="back" />
            <Layer layer="mid" />
            <ellipse data-part="torso" className="mascot-w" />
            <ellipse data-part="belly" fill="#e6ebef" opacity="0.9" />
            <ellipse data-part="head" className="mascot-w" />
            <ellipse data-part="eyeA" fill={INK} />
            <ellipse data-part="eyeB" fill={INK} />
            <path data-part="mouth" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
            <ellipse data-part="mouthO" fill="#7a2f2f" />
            <Layer layer="front" />
          </g>
        </g>

        <g data-part="bubble" opacity="0">
          <rect x="-66" y="-15" width="132" height="38" rx="19" fill="#161616" opacity="0.08" transform="translate(0 4)" />
          <rect x="-66" y="-15" width="132" height="38" rx="19" fill="#fff" />
          <path d="M-8 22 L8 22 L0 36 Z" fill="#fff" />
          <text
            x="0"
            y="9"
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fill="#2f4a2b"
            fontFamily="Inter, system-ui, sans-serif"
          >
            Hi, I&apos;m Nam!
          </text>
        </g>

        <g data-part="bubble2" opacity="0">
          <rect x="-48" y="-15" width="96" height="38" rx="19" fill="#161616" opacity="0.08" transform="translate(0 4)" />
          <rect x="-48" y="-15" width="96" height="38" rx="19" fill="#fff" />
          <path d="M-8 22 L8 22 L0 36 Z" fill="#fff" />
          <text
            x="0"
            y="9"
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fill="#2f4a2b"
            fontFamily="Inter, system-ui, sans-serif"
          >
            It&apos;s me!
          </text>
        </g>
      </svg>
    </div>
  )
}

export default Mascot
