import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import './App.css'

function App() {
  return (
    <div id="top">
      <Header />
      <Hero />
      <main className="page-placeholder">
        <p>Sections coming next: About, Projects, Skills, Contact.</p>
      </main>
    </div>
  )
}

export default App
