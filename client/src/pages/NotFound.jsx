import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <section className="not-found">
      <span className="not-found__code">404</span>
      <h1 className="not-found__title">Page not found.</h1>
      <p className="not-found__text">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="not-found__link">
        Back to home
        <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}

export default NotFound
