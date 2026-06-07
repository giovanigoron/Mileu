import { useState, useMemo, useEffect } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import { useNotebook } from '../context/NotebookContext.jsx'

// Build a shopping list from saved recipes. The user picks which saved recipes
// to include (all selected by default); ingredients are aggregated across them,
// with duplicates grouped so combined measures / source recipes are visible.
//
// Props:
//   onGoNotebook() – jump to the notebook tab (used when nothing is saved).
export default function ShoppingListView({ onGoNotebook }) {
  const {
    savedRecipes,
    buildShoppingList,
    checkedItems,
    toggleChecked,
    manualItems,
    addManualItem,
    removeManualItem,
    clearShoppingList,
  } = useNotebook()

  // Which saved recipes feed the list — default to all of them.
  const [selectedIds, setSelectedIds] = useState(() =>
    savedRecipes.map((m) => m.idMeal)
  )

  // Keep the selection sensible if recipes are added/removed elsewhere: drop
  // ids that no longer exist, and auto-include freshly saved recipes.
  useEffect(() => {
    setSelectedIds((prev) => {
      const existing = savedRecipes.map((m) => m.idMeal)
      const kept = prev.filter((id) => existing.includes(id))
      const added = existing.filter((id) => !prev.includes(id))
      return [...kept, ...added]
    })
  }, [savedRecipes])

  const [manualText, setManualText] = useState('')

  // The aggregated, grouped ingredient list.
  const list = useMemo(
    () => buildShoppingList(selectedIds),
    [buildShoppingList, selectedIds]
  )

  function toggleRecipe(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function handleAddManual(e) {
    e.preventDefault()
    addManualItem(manualText)
    setManualText('')
  }

  // Nothing saved at all → nudge the user to the notebook.
  if (savedRecipes.length === 0) {
    return (
      <section className="view">
        <EmptyState icon="🛒" title="No ingredients to gather yet">
          <p>
            Save a few recipes to your notebook first, then come back to build a
            tidy shopping list from them.
          </p>
          <button className="btn btn--brick" onClick={onGoNotebook}>
            Go to my notebook
          </button>
        </EmptyState>
      </section>
    )
  }

  const hasAnything = list.length > 0 || manualItems.length > 0

  return (
    <section className="view shopping">
      <h2 className="view__heading">Shopping List</h2>

      {/* Recipe picker */}
      <div className="shopping__picker">
        <p className="shopping__picker-label">Include recipes:</p>
        <div className="chip-row">
          {savedRecipes.map((m) => {
            const on = selectedIds.includes(m.idMeal)
            return (
              <button
                key={m.idMeal}
                className={`chip ${on ? 'is-on' : ''}`}
                onClick={() => toggleRecipe(m.idMeal)}
                aria-pressed={on}
              >
                {on ? '✓ ' : ''}{m.strMeal}
              </button>
            )
          })}
        </div>
      </div>

      {/* The list itself */}
      <div className="shopping__sheet">
        {!hasAnything ? (
          <EmptyState icon="📝" title="Your list is empty">
            <p>Select some recipes above, or add an item by hand below.</p>
          </EmptyState>
        ) : (
          <ul className="shopping__items">
            {/* Aggregated recipe ingredients */}
            {list.map((item) => {
              // Show combined measures, and which recipes need this ingredient.
              const measures = item.entries
                .map((e) => e.measure)
                .filter(Boolean)
                .join(' + ')
              const fromRecipes = Array.from(
                new Set(item.entries.map((e) => e.recipe))
              )
              return (
                <li key={item.key} className="shopping__row">
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.key]}
                      onChange={() => toggleChecked(item.key)}
                    />
                    <span className="check__box" aria-hidden="true" />
                    <span className={`check__text ${checkedItems[item.key] ? 'is-checked' : ''}`}>
                      <span className="shopping__name">{item.name}</span>
                      {measures && <span className="shopping__measure"> — {measures}</span>}
                      <span className="shopping__source">
                        {fromRecipes.length > 1
                          ? `for ${fromRecipes.length} recipes: ${fromRecipes.join(', ')}`
                          : `for ${fromRecipes[0]}`}
                      </span>
                    </span>
                  </label>
                </li>
              )
            })}

            {/* Manual items */}
            {manualItems.map((it) => (
              <li key={it.key} className="shopping__row shopping__row--manual">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={!!checkedItems[it.key]}
                    onChange={() => toggleChecked(it.key)}
                  />
                  <span className="check__box" aria-hidden="true" />
                  <span className={`check__text ${checkedItems[it.key] ? 'is-checked' : ''}`}>
                    <span className="shopping__name">{it.name}</span>
                    <span className="shopping__source">added by hand</span>
                  </span>
                </label>
                <button
                  className="shopping__remove"
                  onClick={() => removeManualItem(it.key)}
                  aria-label={`Remove ${it.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add a manual item + clear all */}
      <div className="shopping__footer">
        <form className="shopping__add" onSubmit={handleAddManual}>
          <input
            type="text"
            className="input"
            placeholder="Add your own item (e.g. napkins)…"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            aria-label="Add a manual shopping item"
          />
          <button type="submit" className="btn btn--olive">Add</button>
        </form>

        {hasAnything && (
          <button className="btn btn--link" onClick={clearShoppingList}>
            Clear the whole list
          </button>
        )}
      </div>
    </section>
  )
}
