// A small, on-theme loading indicator: a spinning wooden-spoon emoji plus a
// handwritten "stirring…" message. Used while API requests are in flight.
export default function Loader({ message = 'Stirring the pot…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spoon" aria-hidden="true">🥄</span>
      <p className="loader__text">{message}</p>
    </div>
  )
}
