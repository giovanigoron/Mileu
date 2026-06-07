// App header: the "notebook cover" band with the doily motif, the Mileu logo
// (the supplied app icon), and a handwritten tagline. The floral oilcloth
// pattern and lace doily are drawn in CSS (see index.css).
export default function Header() {
  return (
    <header className="header">
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
