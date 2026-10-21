import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container py-4 py-md-5">{children}</main>
    </>
  )
}

export default Layout
