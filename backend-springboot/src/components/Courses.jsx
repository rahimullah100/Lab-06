import { useCallback, useEffect, useState } from 'react'
import { deleteCourse, getCourses, updateCourse } from '../services/courseApi'

const emptyCourse = { code: '', title: '', credits: '' }

function Courses() {
  const [courses, setCourses] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [course, setCourse] = useState(emptyCourse)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadCourses = useCallback(async () => {
    const response = await getCourses()
    setCourses(Array.isArray(response.data) ? response.data : [])
  }, [])

  useEffect(() => {
    let active = true
    const fetchCourses = async () => {
      try {
        const response = await getCourses()
        if (active) setCourses(Array.isArray(response.data) ? response.data : [])
      } catch (requestError) {
        if (active) setError('Failed to load courses. Start the Spring Boot API and try again.')
        console.error(requestError)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchCourses()
    return () => { active = false }
  }, [])

  const handleEdit = (selectedCourse) => {
    setEditingId(selectedCourse.id)
    setCourse({ code: String(selectedCourse.code ?? ''), title: String(selectedCourse.title ?? ''), credits: String(selectedCourse.credits ?? '') })
    setMessage('')
    setError('')
  }

  const handleChange = ({ target: { name, value } }) => setCourse((previous) => ({ ...previous, [name]: value }))

  const cancelEdit = () => {
    setEditingId(null)
    setCourse(emptyCourse)
    setError('')
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    const updatedCourse = { code: String(course.code ?? '').trim(), title: String(course.title ?? '').trim(), credits: Number(course.credits) }
    if (!updatedCourse.code || !updatedCourse.title || !Number.isFinite(updatedCourse.credits) || updatedCourse.credits < 1) {
      setError('Enter a course code, title, and at least one credit.')
      return
    }
    try {
      setSaving(true)
      await updateCourse(editingId, updatedCourse)
      await loadCourses()
      setEditingId(null)
      setCourse(emptyCourse)
      setError('')
      setMessage('Course updated successfully!')
    } catch (requestError) {
  console.error('Update error:', requestError)
  console.error('HTTP status:', requestError.response?.status)
  console.error('API response:', requestError.response?.data)

  const details = requestError.response
    ? `HTTP ${requestError.response.status}: ${
        typeof requestError.response.data === 'string'
          ? requestError.response.data
          : JSON.stringify(requestError.response.data)
      }`
    : requestError.message

  setError(`Failed to update course: ${details}`)
}
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return
    try {
      await deleteCourse(id)
      await loadCourses()
      if (editingId === id) cancelEdit()
      setError('')
      setMessage('Course deleted successfully!')
    } catch (requestError) {
      console.error(requestError)
      setError('Failed to delete course. Check the API response.')
    }
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold text-uppercase small mb-1">Academic catalog</p>
          <h1 className="page-title h2 mb-2">Course Management</h1>
          <p className="text-muted mb-0">Review, edit, and remove courses from the university catalog.</p>
        </div>
        <span className="badge text-bg-light border px-3 py-2">{courses.length} course{courses.length === 1 ? '' : 's'}</span>
      </div>

      {message && <div className="alert alert-success alert-dismissible fade show" role="alert">{message}<button type="button" className="btn-close" aria-label="Close" onClick={() => setMessage('')} /></div>}
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}<button type="button" className="btn-close" aria-label="Close" onClick={() => setError('')} /></div>}

      {editingId !== null && (
        <section className="card content-card mb-4">
          <div className="card-header bg-warning-subtle border-bottom-0 pt-4 px-4"><h2 className="h5 mb-0">Edit Course</h2></div>
          <div className="card-body p-4">
            <form onSubmit={handleUpdate}>
              <div className="row g-3">
                <div className="col-md-3"><label className="form-label" htmlFor="editCode">Course Code</label><input id="editCode" type="text" name="code" className="form-control" value={course.code} onChange={handleChange} required /></div>
                <div className="col-md-5"><label className="form-label" htmlFor="editTitle">Course Title</label><input id="editTitle" type="text" name="title" className="form-control" value={course.title} onChange={handleChange} required /></div>
                <div className="col-md-2"><label className="form-label" htmlFor="editCredits">Credits</label><input id="editCredits" type="number" name="credits" min="1" className="form-control" value={course.credits} onChange={handleChange} required /></div>
                <div className="col-md-2 d-flex align-items-end"><button type="submit" className="btn btn-success w-100" disabled={saving}>{saving ? 'Updating...' : 'Update'}</button></div>
              </div>
              <button type="button" className="btn btn-outline-secondary mt-3" onClick={cancelEdit} disabled={saving}>Cancel</button>
            </form>
          </div>
        </section>
      )}

      <section className="card content-card">
        <div className="card-header bg-white border-bottom-0 pt-4 px-4"><h2 className="h5 mb-0">Course List</h2></div>
        <div className="card-body p-4 pt-3"><div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark"><tr><th scope="col">ID</th><th scope="col">Code</th><th scope="col">Title</th><th scope="col">Credits</th><th scope="col">Actions</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan="5" className="text-center text-muted py-4">Loading courses...</td></tr>}
              {!loading && courses.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No courses found.</td></tr>}
              {courses.map((item) => <tr key={item.id}><td>{item.id}</td><td><span className="fw-semibold">{item.code}</span></td><td>{item.title}</td><td>{item.credits}</td><td className="text-nowrap"><button type="button" className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button><button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button></td></tr>)}
            </tbody>
          </table>
        </div></div>
      </section>
    </div>
  )
}

export default Courses
