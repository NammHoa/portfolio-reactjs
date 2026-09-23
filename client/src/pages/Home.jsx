import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Projects from '../components/Projects/Projects'
import Portfolio from '../components/Portfolio/Portfolio'
import Skills from '../components/Skills/Skills'
import Contact from '../components/Contact/Contact'
import { ProjectModalProvider } from '../context/ProjectModalContext'

function Home() {
  return (
    <>
      <Hero />
      <About />
      <ProjectModalProvider>
        <Projects />
        <Portfolio />
      </ProjectModalProvider>
      <Skills />
      <Contact />
    </>
  )
}

export default Home
