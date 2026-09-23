import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Portfolio from './components/Portfolio/Portfolio'
import Skills from './components/Skills/Skills'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import { ProjectModalProvider } from './context/ProjectModalContext'

function App() {
  return (
    <div id="top">
      <Header />
      <Hero />
      <About />
      <ProjectModalProvider>
        <Projects />
        <Portfolio />
      </ProjectModalProvider>
      <Skills />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
