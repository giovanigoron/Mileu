import { useState } from 'react'

// All the browsing controls in one place:
//   • a text search bar for recipe names
//   • Category and Cuisine/Area dropdowns (populated from list endpoints)
//   • a small "Surprise me" button for a random recipe
//
// Props:
//   categories, areas  – arrays for the dropdowns
//   category, area     – current selections (controlled by BrowseView)
//   onSearch(text)     – run a name search
//   onCategory(value)  – category dropdown changed
//   onArea(value)      – area dropdown changed
//   onSurprise()       – fetch a random recipe
//   onClear()          – reset everything to the default browse
export default function SearchControls({
  categories,
  areas,
  category,
  area,
  onSearch,
  onCategory,
  onArea,
  onSurprise,
  onClear,
}) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(text.trim())
  }

  return (
    <div className="controls">
      {/* Name search */}
      <form className="controls__search" onSubmit={handleSubmit} role="search">
        <input
          type="search"
          className="input input--search"
          placeholder="Search recipes by name…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Search recipes by name"
        />
        <button type="submit" className="btn btn--brick">Search</button>
      </form>

      {/* Dropdown filters */}
      <div className="controls__filters">
        <label className="field">
          <span className="field__label">Category</span>
          <select
            className="input input--select"
            value={category}
            onChange={(e) => onCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.strCategory} value={c.strCategory}>
                {c.strCategory}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Cuisine</span>
          <select
            className="input input--select"
            value={area}
            onChange={(e) => onArea(e.target.value)}
          >
            <option value="">All cuisines</option>
            {areas.map((a) => (
              <option key={a.strArea} value={a.strArea}>
                {a.strArea}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Little extras */}
      <div className="controls__extras">
        <button type="button" className="btn btn--olive" onClick={onSurprise}>
          🎲 Surprise me
        </button>
        <button type="button" className="btn btn--link" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  )
}
