import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Tabs from './components/Tabs.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import BrowseView from './views/BrowseView.jsx'
import NotebookView from './views/NotebookView.jsx'
import ShoppingListView from './views/ShoppingListView.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

// Decide the starting theme: respect the visitor's OS-level dark-mode setting
// on first visit. After that, their explicit choice is remembered (below).
function getSystemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

// Top-level app shell. We keep navigation in simple local state (no router) so
// the app deploys cleanly to a GitHub Pages sub-path with zero routing config.
export default function App() {
  const [tab, setTab] = useState('browse')   // 'browse' | 'notebook' | 'shopping'
  const [openMeal, setOpenMeal] = useState(null) // full meal shown in the detail overlay

  // Theme is persisted, so it survives refreshes; defaults to the OS preference.
  const [theme, setTheme] = useLocalStorage('mileu.theme.v1', getSystemTheme())

  // Reflect the theme onto <html data-theme="…"> so the CSS variables switch.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Tabs active={tab} onChange={setTab} />

      <main className="app__main">
        {tab === 'browse' && <BrowseView onOpen={setOpenMeal} />}

        {tab === 'notebook' && (
          <NotebookView onOpen={setOpenMeal} onGoBrowse={() => setTab('browse')} />
        )}

        {tab === 'shopping' && (
          <ShoppingListView onGoNotebook={() => setTab('notebook')} />
        )}
      </main>

      <footer className="app__footer">
        <p>
          Made with ☕ &amp; flour · recipes from{' '}
          <a href="https://www.themealdb.com" target="_blank" rel="noreferrer">
            TheMealDB
          </a>
        </p>
      </footer>

      {/* Full recipe overlay, rendered above everything when a meal is open */}
      {openMeal && (
        <RecipeDetail meal={openMeal} onClose={() => setOpenMeal(null)} />
      )}
    </div>
  )
}
