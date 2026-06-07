// Friendly error panel shown when an API request fails. Optionally renders a
// "Try again" button if an onRetry handler is supplied.
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="notice notice--error" role="alert">
      <p className="notice__title">Oh dear — a spill in the kitchen.</p>
      <p className="notice__body">{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button className="btn btn--ink" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
