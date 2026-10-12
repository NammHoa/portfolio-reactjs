// Refreshes src/data/projects.fallback.json from the live API.
//
// The site shows this copy the moment it loads (so visitors never wait for the API
// to wake up) and then swaps in the live data when the API answers. It runs
// automatically before `npm run build`, and can be run by hand: `npm run sync-projects`.
//
// It never fails the build: without an API address, or if the API is down, the copy
// already in the repo is kept.
import { readFile, writeFile } from 'node:fs/promises'

const API = process.env.VITE_API_URL
const OUT = new URL('../src/data/projects.fallback.json', import.meta.url)
const TIMEOUT_MS = 90_000 // a sleeping free-tier server can take well over 20 seconds

if (!API) {
  console.log('[sync-projects] VITE_API_URL is not set, keeping the fallback already in the repo.')
  process.exit(0)
}

try {
  const res = await fetch(`${API}/api/projects`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('empty response')

  // Drop database bookkeeping the pages never use.
  const BOOKKEEPING = ['__v', 'createdAt', 'updatedAt']
  const clean = data.map((project) =>
    Object.fromEntries(Object.entries(project).filter(([key]) => !BOOKKEEPING.includes(key)))
  )
  const next = `${JSON.stringify(clean, null, 2)}\n`

  const previous = await readFile(OUT, 'utf8').catch(() => '')
  if (previous === next) {
    console.log(`[sync-projects] fallback already up to date (${clean.length} projects).`)
  } else {
    await writeFile(OUT, next)
    console.log(`[sync-projects] fallback updated from the API (${clean.length} projects).`)
  }
} catch (error) {
  console.warn(`[sync-projects] could not reach the API (${error.message}), keeping the fallback already in the repo.`)
}
