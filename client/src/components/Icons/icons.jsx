import './icons.css'

function Duotone({ children }) {
  return (
    <svg className="duo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

export function IconMail() {
  return (
    <Duotone>
      <rect className="duo__tone" x="4.5" y="7.5" width="18" height="13" rx="2.5" />
      <g className="duo__line">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </g>
    </Duotone>
  )
}

export function IconPhone() {
  return (
    <Duotone>
      <rect className="duo__tone" x="8.5" y="4.5" width="10" height="18" rx="2.5" />
      <g className="duo__line">
        <rect x="6.5" y="2.5" width="10" height="18" rx="2.5" />
        <path d="M10.5 17.5h2" />
      </g>
    </Duotone>
  )
}

const GITHUB_MARK =
  'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z'

export function IconGithub() {
  return (
    <Duotone>
      <path className="duo__tone" transform="translate(1.2 1.2)" d={GITHUB_MARK} />
      <path className="duo__line" d={GITHUB_MARK} />
    </Duotone>
  )
}

export function IconCode() {
  return (
    <Duotone>
      <rect className="duo__tone" x="5.5" y="6.5" width="17" height="14" rx="6" />
      <g className="duo__line">
        <path d="M9 8l-4.5 4L9 16" />
        <path d="M15 8l4.5 4-4.5 4" />
        <path d="M13.2 6.5l-2.4 11" />
      </g>
    </Duotone>
  )
}

export function IconBrowser() {
  return (
    <Duotone>
      <rect className="duo__tone" x="4.5" y="5.5" width="18" height="16" rx="3" />
      <g className="duo__line">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M3 9h18" />
        <path d="M7.5 13h5" />
        <path d="M7.5 16h8" />
      </g>
    </Duotone>
  )
}

export function IconServer() {
  return (
    <Duotone>
      <rect className="duo__tone" x="5.5" y="5.5" width="16" height="6" rx="2" />
      <rect className="duo__tone" x="5.5" y="15.5" width="16" height="6" rx="2" />
      <g className="duo__line">
        <rect x="4" y="4" width="16" height="6" rx="2" />
        <rect x="4" y="14" width="16" height="6" rx="2" />
        <path d="M7.5 7h.01M7.5 17h.01" />
        <path d="M12 7h5M12 17h5" />
      </g>
    </Duotone>
  )
}

export function IconDatabase() {
  return (
    <Duotone>
      <path className="duo__tone" transform="translate(1.5 1.5)" d="M5 6a7 3 0 0 0 14 0v12c0 1.7-3.1 3-7 3s-7-1.3-7-3z" />
      <g className="duo__line">
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
        <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
      </g>
    </Duotone>
  )
}

export function IconToolbox() {
  return (
    <Duotone>
      <rect className="duo__tone" x="4.5" y="9.5" width="18" height="12" rx="2.5" />
      <g className="duo__line">
        <rect x="3" y="8" width="18" height="12" rx="2.5" />
        <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" />
        <path d="M3 13.5h18" />
        <path d="M10.5 12v3h3v-3z" />
      </g>
    </Duotone>
  )
}

export function IconDegree() {
  return (
    <Duotone>
      <path className="duo__tone" transform="translate(1.2 1.5)" d="M12 4 2.5 9 12 14l9.5-5z" />
      <g className="duo__line">
        <path d="M12 4 2.5 9 12 14l9.5-5z" />
        <path d="M6.5 11.5V15c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-3.5" />
        <path d="M21.5 9v5" />
      </g>
    </Duotone>
  )
}

export function IconUniversity() {
  return (
    <Duotone>
      <rect className="duo__tone" x="4.5" y="11.5" width="16" height="9.5" rx="1.5" />
      <g className="duo__line">
        <path d="M3 9.5 12 4l9 5.5" />
        <path d="M4 20h16" />
        <path d="M6.5 20v-8M10.5 20v-8M14.5 20v-8M18.5 20v-8" />
      </g>
    </Duotone>
  )
}

export function IconCalendar() {
  return (
    <Duotone>
      <rect className="duo__tone" x="4.5" y="6.5" width="17" height="16" rx="3" />
      <g className="duo__line">
        <rect x="3" y="5" width="17" height="16" rx="3" />
        <path d="M3 10h17" />
        <path d="M8 3v4M15 3v4" />
      </g>
    </Duotone>
  )
}

const STAR = 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z'

export function IconStar() {
  return (
    <Duotone>
      <path className="duo__tone" transform="translate(1.2 1.4)" d={STAR} />
      <path className="duo__line" d={STAR} />
    </Duotone>
  )
}
