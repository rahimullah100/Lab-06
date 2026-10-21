import { Link } from 'react-router-dom'

const stats = [
  ['📚', '12', 'Active Courses', 'bg-primary-subtle text-primary'],
  ['🎓', '246', 'Registered Students', 'bg-success-subtle text-success'],
  ['🏛️', '18', 'Course Sections', 'bg-warning-subtle text-warning-emphasis'],
]

function Dashboard() {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold text-uppercase small mb-1">Academic overview</p>
          <h1 className="page-title h2 mb-2">CompusHub Dashboard</h1>
          <p className="page-subtitle text-muted mb-0">University course and registration management system.</p>
        </div>
        <Link className="btn btn-primary" to="/courses">Manage courses</Link>
      </div>
      <div className="row g-3">
        {stats.map(([icon, value, label, color]) => (
          <div className="col-md-4" key={label}>
            <div className="card stat-card h-100"><div className="card-body d-flex align-items-center gap-3">
              <div className={`stat-icon ${color}`}>{icon}</div><div><div className="h3 mb-0">{value}</div><div className="text-muted small">{label}</div></div>
            </div></div>
          </div>
        ))}
      </div>
      <div className="card content-card mt-4"><div className="card-body p-4">
        <h2 className="h5">Welcome to CompusHub</h2>
        <p className="text-muted mb-0">Use the navigation menu to view courses, students, sections, and registrations. This prototype uses static sample data for the React UI lab.</p>
      </div></div>
    </div>
  )
}

export default Dashboard
