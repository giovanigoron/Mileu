import RecipeCard from '../components/RecipeCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useNotebook } from '../context/NotebookContext.jsx'

// "My Notebook": every recipe the user has saved, persisted in localStorage.
// Saved recipes are full meal objects, so opening one is instant (no fetch).
//
// Props:
//   onOpen(meal)  – show the full recipe detail.
//   onGoBrowse()  – switch to the Browse tab (used by the empty state).
export default function NotebookView({ onOpen, onGoBrowse }) {
  const { savedRecipes } = useNotebook()

  if (savedRecipes.length === 0) {
    return (
      <section className="view">
        <EmptyState icon="📖" title="Your notebook is empty">
          <p>
            Nothing pressed between these pages just yet. Find a recipe you love
            and tap the <strong>bookmark</strong> to keep it here forever.
          </p>
          <button className="btn btn--brick" onClick={onGoBrowse}>
            Find recipes to save
          </button>
        </EmptyState>
      </section>
    )
  }

  return (
    <section className="view">
      <h2 className="view__heading">
        My Notebook
        <span className="view__count"> · {savedRecipes.length} saved</span>
      </h2>

      <div className="recipe-grid">
        {savedRecipes.map((meal, i) => (
          <RecipeCard
            key={meal.idMeal}
            meal={meal}
            onOpen={onOpen}
            tapeSide={i % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </section>
  )
}
