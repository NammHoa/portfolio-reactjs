import { useEffect, useState } from 'react'
import './Header.css'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#projects' },
  { label: 'Projects', href: '#portfolio' },
  { label: 'Skills', href: '#skills' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const ENTER_THRESHOLD = 80
    const EXIT_THRESHOLD = 40

    const handleScroll = () => {
      const y = window.scrollY
      setIsScrolled((current) => {
        if (current) return y > EXIT_THRESHOLD
        return y > ENTER_THRESHOLD
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="header">
      <div className={`header__inner ${isScrolled ? 'header__inner--scrolled' : ''}`}>
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
