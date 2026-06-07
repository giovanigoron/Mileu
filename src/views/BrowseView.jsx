import { useState, useEffect, useCallback } from 'react'
import SearchControls from '../components/SearchControls.jsx'
import RecipeGrid from '../components/RecipeGrid.jsx'
import Loader from '../components/Loader.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import EmptyState from '../components/EmptyState.jsx'
import {
  searchByName,
  filterByCategory,
  filterByArea,
  getRandomMeal,
  getMealById,
  listCategories,
  listAreas,
} from '../api/mealdb.js'

// Remove duplicate objects from a list based on one string field, keeping the
// first occurrence of each value (TheMealDB occasionally returns dupes).
function dedupeBy(list, field) {
  const seen = new Set()
  return list.filter((item) => {
    const val = item[field]
    if (seen.has(val)) return false
    seen.add(val)
    return true
  })
}

// The main browsing experience: search, filter, and a "Surprise me" extra.
//
// Props:
//   onOpen(meal) – ask the parent (App) to show the full recipe detail.
export default function BrowseView({ onOpen }) {
  // Dropdown data
  const [categories, setCategories] = useState([])
  const [areas, setAreas] = useState([])

  // Current selections
  const [category, setCategory] = useState('')
  const [area, setArea] = useState('')

  // Results + status
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [heading, setHeading] = useState('Suggested recipes')

  // --- Load dropdown lists once -----------------------------------------------
  useEffect(() => {
    // Failure here is non-fatal: the dropdowns just stay empty.
    // The free API can return duplicate entries, so we de-dupe by name to keep
    // React keys unique and the dropdowns tidy.
    listCategories()
      .then((cats) => setCategories(dedupeBy(cats, 'strCategory')))
      .catch(() => {})
    listAreas()
      .then((list) => setAreas(dedupeBy(list, 'strArea')))
      .catch(() => {})
  }, [])

  // --- A reusable "run this fetch and manage state" helper --------------------
  const run = useCallback(async (fetcher, label) => {
    setLoading(true)
    setError(null)
    setHeading(label)
    try {
      const result = await fetcher()
      setMeals(result)
    } catch (err) {
      setError(err.message)
      setMeals([])
    } finally {
      setLoading(false)
    }
  }, [])

  // --- Initial / default browse ----------------------------------------------
  const loadDefault = useCallback(() => {
    setCategory('')
    setArea('')
    // An empty name search returns a broad selection to fill the page.
    run(() => searchByName(''), 'Suggested recipes')
  }, [run])

  useEffect(() => {
    loadDefault()
  }, [loadDefault])

  // --- Handlers ---------------------------------------------------------------
  function handleSearch(text) {
    if (!text) return loadDefault()
    setCategory('')
    setArea('')
    run(() => searchByName(text), `Results for “${text}”`)
  }

  function handleCategory(value) {
    setCategory(value)
    setArea('')
    if (!value) return loadDefault()
    // filter.php returns light meals (no category field) — inject the known
    // category so the cards still show it.
    run(
      async () => {
        const list = await filterByCategory(value)
        return list.map((m) => ({ ...m, strCategory: value }))
      },
      `${value} recipes`
    )
  }

  function handleArea(value) {
    setArea(value)
    setCategory('')
    if (!value) return loadDefault()
    run(() => filterByArea(value), `${value} cuisine`)
  }

  // "Surprise me" opens a random recipe straight into the detail view.
  async function handleSurprise() {
    try {
      const meal = await getRandomMeal()
      if (meal) onOpen(meal)
    } catch {
      setError('The surprise recipe got away. Try again!')
    }
  }

  // Cards from filter endpoints are "light" (no instructions). When one is
  // opened we fetch full details by id first, falling back to what we have.
  async function handleOpen(meal) {
    if (meal.strInstructions) return onOpen(meal) // already full
    try {
      const full = await getMealById(meal.idMeal)
      onOpen(full || meal)
    } catch {
      onOpen(meal)
    }
  }

  return (
    <section className="view">
      <SearchControls
        categories={categories}
        areas={areas}
        category={category}
        area={area}
        onSearch={handleSearch}
        onCategory={handleCategory}
        onArea={handleArea}
        onSurprise={handleSurprise}
        onClear={loadDefault}
      />

      <h2 className="view__heading">{heading}</h2>

      {loading && <Loader message="Fetching recipes…" />}

      {!loading && error && <ErrorMessage message={error} onRetry={loadDefault} />}

      {!loading && !error && meals.length === 0 && (
        <EmptyState icon="🍂" title="Nothing on this page yet">
          <p>The recipe box came back empty. Try another search or filter.</p>
        </EmptyState>
      )}

      {!loading && !error && meals.length > 0 && (
        <RecipeGrid meals={meals} onOpen={handleOpen} />
      )}
    </section>
  )
}
