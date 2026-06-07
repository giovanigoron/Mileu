import { useEffect } from 'react'
import { parseIngredients } from '../api/mealdb.js'
import { useNotebook } from '../context/NotebookContext.jsx'

// Full recipe view, shown as an overlay "recipe page" on top of the notebook.
//
// Props:
//   meal     – a *full* meal object (must include instructions/ingredients).
//   onClose  – close the overlay.
//
// Splits the instructions into paragraphs/steps and lists ingredient+measure
// pairs. Shows YouTube and source links only when the API provides them.
export default function RecipeDetail({ meal, onClose }) {
  const { isSaved, toggleSave } = useNotebook()

  // Close on Escape, and lock body scroll while open.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!meal) return null

  const ingredients = parseIngredients(meal)
  const saved = isSaved(meal.idMeal)

  // Split instructions on blank lines / line breaks into readable steps.
  const steps = (meal.strInstructions || '')
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="overlay" onClick={onClose}>
      {/* Stop propagation so clicks inside the page don't close it */}
      <article className="detail" onClick={(e) => e.stopPropagation()}>
        <button className="detail__close" onClick={onClose} aria-label="Close recipe">
          ✕
        </button>

        <header className="detail__header">
          <img className="detail__photo" src={meal.strMealThumb} alt={meal.strMeal} />
          <div className="detail__head-text">
            <h2 className="detail__title">{meal.strMeal}</h2>
            <p className="detail__tags">
              {meal.strCategory && <span className="pill">{meal.strCategory}</span>}
              {meal.strArea && <span className="pill pill--area">{meal.strArea}</span>}
            </p>

            {/* Prominent Save toggle */}
            <button
              className={`btn btn--save ${saved ? 'is-saved' : ''}`}
              onClick={() => toggleSave(meal)}
              aria-pressed={saved}
            >
              {saved ? '🔖 Saved to notebook' : '🤍 Save to my notebook'}
            </button>
          </div>
        </header>

        <div className="detail__body">
          {/* Ingredients */}
          <section className="detail__section detail__ingredients">
            <h3 className="detail__heading">Ingredients</h3>
            {ingredients.length === 0 ? (
              <p className="muted">No ingredients listed.</p>
            ) : (
              <ul className="ingredient-list">
                {ingredients.map((it, i) => (
                  <li key={i} className="ingredient-list__item">
                    <span className="ingredient-list__measure">{it.measure}</span>
                    <span className="ingredient-list__name">{it.ingredient}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Instructions */}
          <section className="detail__section detail__instructions">
            <h3 className="detail__heading">Instructions</h3>
            {steps.length === 0 ? (
              <p className="muted">No instructions provided.</p>
            ) : (
              <ol className="step-list">
                {steps.map((step, i) => (
                  <li key={i} className="step-list__item">{step}</li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* External links (only when present) */}
        {(meal.strYoutube || meal.strSource) && (
          <footer className="detail__links">
            {meal.strYoutube && (
              <a className="btn btn--ink" href={meal.strYoutube} target="_blank" rel="noreferrer">
                ▶ Watch on YouTube
              </a>
            )}
            {meal.strSource && (
              <a className="btn btn--link" href={meal.strSource} target="_blank" rel="noreferrer">
                Original source ↗
              </a>
            )}
          </footer>
        )}
      </article>
    </div>
  )
}
