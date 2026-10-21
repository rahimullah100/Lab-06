import { NavLink } from 'react-router-dom'

const links = [
  ['/', 'Dashboard'],
  ['/courses', 'Courses'],
  ['/students', 'Students'],
  ['/sections', 'Sections'],
  ['/registrations', 'Registrations'],
]

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar sticky-top">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-semibold" to="/">
          <span className="brand-mark">C</span> CompusHub
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavigation" aria-controls="mainNavigation" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNavigation">
          <div className="navbar-nav ms-lg-auto gap-lg-1">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link px-lg-3 ${isActive ? 'active fw-semibold' : ''}`}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
