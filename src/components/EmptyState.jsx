// A charming empty-state block. Used for "no search results", an empty
// notebook, and an empty shopping list. `icon` is an emoji string.
export default function EmptyState({ icon = '🍲', title, children }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">{icon}</span>
      {title && <h3 className="empty-state__title">{title}</h3>}
      {children && <div className="empty-state__body">{children}</div>}
    </div>
  )
}
