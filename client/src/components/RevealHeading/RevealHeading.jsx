import './RevealHeading.css'

// A section heading whose lines rise out of a mask when the section scrolls into view
// (the `.reveal` classes on the section decide when, see RevealHeading.css).
function RevealHeading({ lines, className }) {
  return (
    <h2 className={className}>
      {lines.map((line, index) => (
        <span key={line}>
          <span className="reveal-heading__line" style={{ '--line': index }}>
            <span className="reveal-heading__text">{line}</span>
          </span>{' '}
        </span>
      ))}
    </h2>
  )
}

export default RevealHeading
