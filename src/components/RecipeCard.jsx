import { useNotebook } from '../context/NotebookContext.jsx'

// A single recipe card: photo + title + category, with a bookmark toggle and a
// strip of "washi tape" on the top corner for that scrapbook feel.
//
// Props:
//   meal      – a meal object (full, or the light id/name/thumb shape).
//   onOpen    – called with the meal when the card body is clicked.
//   tapeSide  – 'left' | 'right', just rotates the decorative tape.
export default function RecipeCard({ meal, onOpen, tapeSide = 'left' }) {
  const { isSaved, toggleSave } = useNotebook()
  const saved = isSaved(meal.idMeal)

  return (
    <article className="card">
      {/* Decorative tape on a corner */}
      <span className={`card__tape card__tape--${tapeSide}`} aria-hidden="true" />

      {/* Clickable body opens the full recipe */}
      <button
        className="card__open"
        onClick={() => onOpen(meal)}
        aria-label={`Open recipe: ${meal.strMeal}`}
      >
        <div className="card__photo-wrap">
          <img
            className="card__photo"
            src={meal.strMealThumb}
            alt={meal.strMeal}
            loading="lazy"
          />
        </div>
        <div className="card__caption">
          <h3 className="card__title">{meal.strMeal}</h3>
          {meal.strCategory && (
            <p className="card__meta">{meal.strCategory}</p>
          )}
        </div>
      </button>

      {/* Bookmark / save toggle */}
      <button
        className={`card__bookmark ${saved ? 'is-saved' : ''}`}
        onClick={() => toggleSave(meal)}
        aria-pressed={saved}
        title={saved ? 'Remove from notebook' : 'Save to my notebook'}
      >
        {saved ? '🔖' : '🤍'}
      </button>
    </article>
  )
}
