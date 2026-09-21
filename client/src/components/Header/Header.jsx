import { useState } from 'react'
import './Header.css'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#top" className="header__logo" onClick={closeMenu}>
          .HN
        </a>

        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="header__cta header__cta--mobile" onClick={closeMenu}>
            Let's talk
            <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <a href="#contact" className="header__cta header__cta--desktop">
          Let's talk
          <span aria-hidden="true">↗</span>
        </a>

        <button
          type="button"
          className={`header__toggle ${isMenuOpen ? 'header__toggle--open' : ''}`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header
