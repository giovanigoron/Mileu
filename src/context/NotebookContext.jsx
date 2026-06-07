import { createContext, useContext, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { parseIngredients } from '../api/mealdb.js'

// -----------------------------------------------------------------------------
// NotebookContext holds everything that must survive a page refresh:
//   • savedRecipes   – full meal objects the user bookmarked
//   • checkedItems   – which shopping-list rows are ticked off
//   • manualItems    – extra shopping-list items the user typed in
//
// All three are persisted to localStorage via the useLocalStorage hook.
// -----------------------------------------------------------------------------

const NotebookContext = createContext(null)

// localStorage keys (versioned so future format changes are easy to migrate).
const KEYS = {
  saved: 'mileu.savedRecipes.v1',
  checked: 'mileu.shoppingChecked.v1',
  manual: 'mileu.shoppingManual.v1',
}

export function NotebookProvider({ children }) {
  const [savedRecipes, setSavedRecipes] = useLocalStorage(KEYS.saved, [])
  const [checkedItems, setCheckedItems] = useLocalStorage(KEYS.checked, {})
  const [manualItems, setManualItems] = useLocalStorage(KEYS.manual, [])

  // --- Saved recipes (the notebook) ------------------------------------------

  const isSaved = useCallback(
    (id) => savedRecipes.some((m) => m.idMeal === id),
    [savedRecipes]
  )

  /** Add a recipe to the notebook (ignores duplicates). */
  const saveRecipe = useCallback((meal) => {
    if (!meal) return
    setSavedRecipes((prev) =>
      prev.some((m) => m.idMeal === meal.idMeal) ? prev : [...prev, meal]
    )
  }, [setSavedRecipes])

  /** Remove a recipe from the notebook. */
  const removeRecipe = useCallback((id) => {
    setSavedRecipes((prev) => prev.filter((m) => m.idMeal !== id))
  }, [setSavedRecipes])

  /** Bookmark toggle used by the detail view and cards. */
  const toggleSave = useCallback((meal) => {
    if (!meal) return
    setSavedRecipes((prev) =>
      prev.some((m) => m.idMeal === meal.idMeal)
        ? prev.filter((m) => m.idMeal !== meal.idMeal)
        : [...prev, meal]
    )
  }, [setSavedRecipes])

  // --- Shopping list ---------------------------------------------------------

  /**
   * Build an aggregated shopping list from a set of recipe ids.
   *
   * Ingredients are grouped case-insensitively. For each unique ingredient we
   * keep every measure we saw plus which recipe it came from, so duplicates are
   * combined rather than silently dropped.
   *
   * @param {string[]} recipeIds  ids of saved recipes to include.
   * @returns {Array<{ key, name, entries: Array<{ measure, recipe }> }>}
   */
  const buildShoppingList = useCallback((recipeIds) => {
    const groups = new Map()

    savedRecipes
      .filter((meal) => recipeIds.includes(meal.idMeal))
      .forEach((meal) => {
        parseIngredients(meal).forEach(({ ingredient, measure }) => {
          const key = ingredient.toLowerCase()
          if (!groups.has(key)) {
            groups.set(key, { key, name: ingredient, entries: [] })
          }
          groups.get(key).entries.push({
            measure: measure || '',
            recipe: meal.strMeal,
          })
        })
      })

    // Alphabetical so the list is easy to scan while shopping.
    return Array.from(groups.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [savedRecipes])

  /** Toggle a single shopping-list row's checked state (keyed by item key). */
  const toggleChecked = useCallback((itemKey) => {
    setCheckedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }))
  }, [setCheckedItems])

  /** Add a free-text item the user typed in. */
  const addManualItem = useCallback((text) => {
    const name = text.trim()
    if (!name) return
    setManualItems((prev) => [
      ...prev,
      { key: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name },
    ])
  }, [setManualItems])

  /** Remove a single manual item. */
  const removeManualItem = useCallback((itemKey) => {
    setManualItems((prev) => prev.filter((it) => it.key !== itemKey))
    setCheckedItems((prev) => {
      const next = { ...prev }
      delete next[itemKey]
      return next
    })
  }, [setManualItems, setCheckedItems])

  /** Wipe the whole shopping list: checked state + manual items. */
  const clearShoppingList = useCallback(() => {
    setCheckedItems({})
    setManualItems([])
  }, [setCheckedItems, setManualItems])

  const value = useMemo(
    () => ({
      // notebook
      savedRecipes,
      isSaved,
      saveRecipe,
      removeRecipe,
      toggleSave,
      // shopping list
      checkedItems,
      manualItems,
      buildShoppingList,
      toggleChecked,
      addManualItem,
      removeManualItem,
      clearShoppingList,
    }),
    [
      savedRecipes, isSaved, saveRecipe, removeRecipe, toggleSave,
      checkedItems, manualItems, buildShoppingList, toggleChecked,
      addManualItem, removeManualItem, clearShoppingList,
    ]
  )

  return <NotebookContext.Provider value={value}>{children}</NotebookContext.Provider>
}

/** Convenience hook so components can pull notebook state without importing context. */
export function useNotebook() {
  const ctx = useContext(NotebookContext)
  if (!ctx) throw new Error('useNotebook must be used inside a <NotebookProvider>')
  return ctx
}
