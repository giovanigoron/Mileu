import { useState } from 'react'
import Header from './components/Header.jsx'
import Tabs from './components/Tabs.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import BrowseView from './views/BrowseView.jsx'
import NotebookView from './views/NotebookView.jsx'
import ShoppingListView from './views/ShoppingListView.jsx'

// Top-level app shell. We keep navigation in simple local state (no router) so
// the app deploys cleanly to a GitHub Pages sub-path with zero routing config.
export default function App() {
  const [tab, setTab] = useState('browse')   // 'browse' | 'notebook' | 'shopping'
  const [openMeal, setOpenMeal] = useState(null) // full meal shown in the detail overlay

  return (
    <div className="app">
      <Header />
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
