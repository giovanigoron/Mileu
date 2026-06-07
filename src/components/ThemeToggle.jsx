// A small round button that flips between light and dark themes.
// Shows a moon while in light mode (tap to go dark) and a sun while in dark
// mode (tap to go light).
//
// Props:
//   theme     – 'light' | 'dark'
//   onToggle  – called when the button is pressed
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
