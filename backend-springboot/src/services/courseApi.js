
import axios from 'axios'

const API_URL = 'http://localhost:8083/api/v1/courses'


export const getCourses = () => {
  return axios.get(API_URL)
}

export const getCourse = (id) => {
  return axios.get(`${API_URL}/${id}`)
}

export const addCourse = (course) => {
  return axios.post(API_URL, course)
}

export const updateCourse = (id, course) => {
  console.log('Updating course ID:', id)
  console.log('Sending course data:', JSON.stringify(course))

  return axios.put(`${API_URL}/${id}`, course, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// DELETE: Delete a course
export const deleteCourse = (id) => {
  return axios.delete(`${API_URL}/${id}`)
}
