import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'

function MainLayout() {
  return (
    <div id="top">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ThemeToggle />
    </div>
  )
}

export default MainLayout
