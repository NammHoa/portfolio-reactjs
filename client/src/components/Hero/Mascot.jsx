import { useEffect, useRef } from 'react'
import './Mascot.css'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function FarTile() {
  return (
    <g>
      <path
        d="M0 400 C 80 330 160 330 240 390 C 320 440 380 320 470 340 C 560 360 640 320 760 400 L760 470 L0 470 Z"
        fill="#d6e2b4"
      />
      <rect x="120" y="90" width="110" height="30" rx="15" fill="#f6f8e6" />
      <rect x="150" y="72" width="60" height="30" rx="15" fill="#f6f8e6" />
      <rect x="470" y="170" width="92" height="26" rx="13" fill="#f6f8e6" />
    </g>
  )
}

function TreeTile() {
  const trees = [
    { x: 90, r: 30 },
    { x: 310, r: 38 },
    { x: 520, r: 28 },
    { x: 690, r: 34 },
  ]
  return (
    <g>
      {trees.map(({ x, r }) => (
        <g key={x}>
          <rect x={x - 5} y={400} width="10" height="50" fill="#5b7d4f" />
          <circle cx={x} cy={400} r={r} fill="#8fb07a" />
        </g>
      ))}
    </g>
  )
}

function Note({ className, color }) {
  return (
    <g className={`mascot-note ${className}`}>
      <circle cx="0" cy="0" r="6" fill={color} />
      <path d="M5 0 V-22 q10 2 10 12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Mascot() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let frame = null
    const handlePointerMove = (event) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        const rect = root.getBoundingClientRect()
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2)
        const dy = (event.clientY - (rect.top + rect.height * 0.35)) / (window.innerHeight / 2)
        root.style.setProperty('--px', `${clamp(dx, -1, 1) * 4}px`)
        root.style.setProperty('--py', `${clamp(dy, -1, 1) * 3}px`)
      })
    }
    window.addEventListener('pointermove', handlePointerMove)

    const observer = new IntersectionObserver(([entry]) => {
      root.dataset.paused = entry.isIntersecting ? 'false' : 'true'
    })
    observer.observe(root)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef} className="mascot">
      <svg viewBox="0 0 760 570" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <clipPath id="mascot-clip">
            <rect width="760" height="570" rx="28" />
          </clipPath>
        </defs>

        <g clipPath="url(#mascot-clip)">
          <rect width="760" height="570" fill="#e9edc9" />
          <circle cx="610" cy="120" r="46" fill="#f2c7a5" />

          <g className="mascot-far">
            <FarTile />
            <g transform="translate(760 0)">
              <FarTile />
            </g>
          </g>

          <g className="mascot-trees">
            <TreeTile />
            <g transform="translate(760 0)">
              <TreeTile />
            </g>
          </g>

          <rect y="420" width="760" height="150" fill="#b9cf9a" />
          <rect y="452" width="760" height="96" fill="#2f4a2b" />
          <rect y="452" width="760" height="4" fill="#46663f" />
          <rect y="548" width="760" height="22" fill="#a9c48f" />

          <g className="mascot-dashes">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <rect key={i} x={i * 120} y="516" width="64" height="7" rx="3.5" fill="#faf7f2" />
            ))}
          </g>

          <g transform="translate(380 500) scale(1.25)">
            <ellipse cx="10" cy="4" rx="95" ry="10" fill="#1f3320" opacity="0.18" />

            <g className="mascot-notes" transform="translate(-30 -235)">
              <Note className="mascot-note--1" color="#2f4a2b" />
              <Note className="mascot-note--2" color="#5b7d4f" />
              <Note className="mascot-note--3" color="#d99f78" />
            </g>

            <g className="mascot-hop">
              <g transform="translate(-22 -80)">
                <g className="mascot-leg mascot-leg--back">
                  <rect x="-13" y="0" width="26" height="66" rx="13" fill="#d99f78" />
                  <rect x="-15" y="58" width="42" height="22" rx="11" fill="#1f3320" />
                </g>
              </g>
              <g transform="translate(24 -80)">
                <g className="mascot-leg mascot-leg--front">
                  <rect x="-13" y="0" width="26" height="66" rx="13" fill="#e8b794" />
                  <rect x="-15" y="58" width="42" height="22" rx="11" fill="#1f3320" />
                </g>
              </g>

              <g transform="translate(0 -18)">
              <g className="mascot-bob">
                <path
                  d="M-70 -110 C-70 -200 -40 -250 10 -250 C70 -250 85 -190 85 -130 C85 -80 60 -55 10 -55 C-40 -55 -70 -70 -70 -110 Z"
                  fill="#f2c7a5"
                />
                <ellipse cx="10" cy="-95" rx="40" ry="28" fill="#f7d6ba" opacity="0.7" />

                <g transform="translate(-46 -136)">
                  <g className="mascot-arm">
                    <rect x="-9" y="0" width="18" height="46" rx="9" fill="#d99f78" />
                    <circle cx="0" cy="48" r="10" fill="#d99f78" />
                  </g>
                </g>

                <g className="mascot-eye">
                  <ellipse cx="30" cy="-178" rx="13" ry="16" fill="#fff" />
                  <ellipse className="mascot-pupil" cx="33" cy="-177" rx="6.5" ry="9" fill="#1f3320" />
                </g>
                <g className="mascot-eye">
                  <ellipse cx="58" cy="-176" rx="10" ry="13" fill="#fff" />
                  <ellipse className="mascot-pupil" cx="60" cy="-175" rx="5" ry="7.5" fill="#1f3320" />
                </g>
                <path className="mascot-brow" d="M18 -202 L38 -207" stroke="#1f3320" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path className="mascot-brow" d="M50 -203 L66 -201" stroke="#1f3320" strokeWidth="5" strokeLinecap="round" fill="none" />
                <ellipse cx="66" cy="-150" rx="8" ry="5" fill="#e79a7a" opacity="0.6" />
                <path d="M36 -146 Q48 -135 60 -146" stroke="#1f3320" strokeWidth="5" strokeLinecap="round" fill="none" />

                <path d="M-20 -186 C-28 -270 66 -276 74 -214" stroke="#1f3320" strokeWidth="9" strokeLinecap="round" fill="none" />
                <circle cx="-20" cy="-165" r="25" fill="#1f3320" />
                <circle cx="-20" cy="-165" r="15" fill="#e6ebc3" />

                <g transform="translate(5 -108)">
                  <g className="mascot-laptop">
                    <rect x="-52" y="-33" width="104" height="66" rx="9" fill="#2f4a2b" />
                    <rect x="-46" y="-27" width="92" height="54" rx="6" fill="none" stroke="#faf7f2" strokeOpacity="0.25" strokeWidth="2" />
                    <text
                      x="0"
                      y="11"
                      textAnchor="middle"
                      fontSize="32"
                      fontWeight="800"
                      fill="#faf7f2"
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      .HN
                    </text>
                  </g>
                </g>

                <path d="M80 -108 L58 -86" stroke="#d99f78" strokeWidth="16" strokeLinecap="round" fill="none" />
                <circle cx="54" cy="-82" r="11" fill="#d99f78" />
              </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Mascot
