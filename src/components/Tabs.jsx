import { useNotebook } from '../context/NotebookContext.jsx'

// Top-level navigation between the three views. The notebook tab carries a
// little ribbon-bookmark and a count badge of how many recipes are saved.
const TABS = [
  { id: 'browse', label: 'Browse', icon: '🔍' },
  { id: 'notebook', label: 'My Notebook', icon: '📖' },
  { id: 'shopping', label: 'Shopping List', icon: '🛒' },
]

export default function Tabs({ active, onChange }) {
  const { savedRecipes } = useNotebook()

  return (
    <nav className="tabs" aria-label="Main sections">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${active === tab.id ? 'is-active' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <span className="tab__icon" aria-hidden="true">{tab.icon}</span>
          <span className="tab__label">{tab.label}</span>
          {tab.id === 'notebook' && savedRecipes.length > 0 && (
            <span className="tab__badge">{savedRecipes.length}</span>
          )}
        </button>
      ))}
    </nav>
  )
}
