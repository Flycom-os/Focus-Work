import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function TrackerHome() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'tracker')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  return (
    <div className="page">
      <div className="page__title">Tracker</div>
      <div className="trackerTiles">
        <Link className="trackerTile" to="/tracker/issues">
          Issues
        </Link>
        <Link className="trackerTile" to="/tracker/timesheets">
          Timesheets
        </Link>
        <Link className="trackerTile" to="/tracker/profile">
          User Profile
        </Link>
      </div>
    </div>
  )
}

