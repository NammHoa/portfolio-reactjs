import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Skills from './components/Skills/Skills'
import './App.css'

function App() {
  return (
    <div id="top">
      <Header />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <main className="page-placeholder">
        <p>Sections coming next: Contact.</p>
      </main>
    </div>
  )
}

export default App
