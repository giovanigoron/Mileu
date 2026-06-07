// -----------------------------------------------------------------------------
// TheMealDB API helpers
//
// All requests go through TheMealDB's free, public test API (key "1").
// Docs: https://www.themealdb.com/api.php
//
// Every function returns a *normalised* result and throws a friendly Error on
// failure so the UI can show a nice message instead of crashing. The free API
// occasionally returns `{ meals: null }` (no results) or fails outright, so we
// handle both gracefully.
// -----------------------------------------------------------------------------

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/'

/**
 * Low-level fetch wrapper. Builds the full URL, checks the HTTP status, and
 * parses JSON. Throws an Error with a readable message on network/HTTP errors.
 */
async function request(endpoint) {
  let res
  try {
    res = await fetch(BASE_URL + endpoint)
  } catch (err) {
    // Network error / offline / CORS, etc.
    throw new Error('Could not reach the kitchen. Check your connection and try again.')
  }

  if (!res.ok) {
    throw new Error(`The recipe box hiccuped (error ${res.status}). Please try again.`)
  }

  return res.json()
}

/**
 * Turn a raw meal object from TheMealDB into a tidy list of ingredient/measure
 * pairs. The API stores them in flat fields strIngredient1..20 / strMeasure1..20.
 * We combine matching pairs and drop any that are empty or blank.
 *
 * @returns {Array<{ ingredient: string, measure: string }>}
 */
export function parseIngredients(meal) {
  if (!meal) return []
  const pairs = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = (meal[`strIngredient${i}`] || '').trim()
    const measure = (meal[`strMeasure${i}`] || '').trim()
    // Ignore empty or blank ingredient slots.
    if (ingredient) {
      pairs.push({ ingredient, measure })
    }
  }
  return pairs
}

// --- Search & filter endpoints ------------------------------------------------

/** Search recipes by name: search.php?s={query} → array of full meals (or []). */
export async function searchByName(query) {
  const data = await request(`search.php?s=${encodeURIComponent(query)}`)
  return data.meals || []
}

/**
 * Filter by main ingredient: filter.php?i={ingredient}
 * NOTE: this endpoint returns only { idMeal, strMeal, strMealThumb } — no
 * category/area/instructions. Fetch full details with getMealById when needed.
 */
export async function filterByIngredient(ingredient) {
  const data = await request(`filter.php?i=${encodeURIComponent(ingredient)}`)
  return data.meals || []
}

/** Filter by category: filter.php?c={category} → light meal objects. */
export async function filterByCategory(category) {
  const data = await request(`filter.php?c=${encodeURIComponent(category)}`)
  return data.meals || []
}

/** Filter by area/cuisine: filter.php?a={area} → light meal objects. */
export async function filterByArea(area) {
  const data = await request(`filter.php?a=${encodeURIComponent(area)}`)
  return data.meals || []
}

/** Full recipe by id: lookup.php?i={id} → a single full meal (or null). */
export async function getMealById(id) {
  const data = await request(`lookup.php?i=${encodeURIComponent(id)}`)
  return data.meals ? data.meals[0] : null
}

/** Random recipe: random.php → a single full meal (or null). */
export async function getRandomMeal() {
  const data = await request('random.php')
  return data.meals ? data.meals[0] : null
}

// --- List endpoints (for dropdowns) ------------------------------------------

/** Categories with descriptions/thumbs: categories.php → array. */
export async function listCategories() {
  const data = await request('categories.php')
  return data.categories || []
}

/** Area list: list.php?a=list → array of { strArea }. */
export async function listAreas() {
  const data = await request('list.php?a=list')
  return data.meals || []
}

/** Ingredient list: list.php?i=list → array of { strIngredient, ... }. */
export async function listIngredients() {
  const data = await request('list.php?i=list')
  return data.meals || []
}
