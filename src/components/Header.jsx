import ThemeToggle from './ThemeToggle.jsx'

// App header: the "notebook cover" band with the doily motif, the Mileu logo
// (the supplied app icon), a handwritten tagline, and the light/dark toggle.
// The floral oilcloth pattern and lace doily are drawn in CSS (see index.css).
//
// Props: theme + onToggleTheme are passed straight through to ThemeToggle.
export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <div className="header__doily" aria-hidden="true" />
      <div className="header__inner">
        <img className="header__logo" src="./Mileu_icon.png" alt="Mileu" />
        <div className="header__titles">
          <h1 className="header__title">Mileu</h1>
          <p className="header__subtitle">my little recipe notebook</p>
        </div>
      </div>
    </header>
  )
}
