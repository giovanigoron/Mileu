# 🥄 Mileu — My Recipe Notebook

A digital recipe notebook styled like an early-2000s Balkan home cookbook —
lined paper, handwritten notes, a lace **mileu** (doily) motif, washi tape and a
coffee-stained page or two — but with modern functionality. It pulls recipes
from the free [TheMealDB](https://www.themealdb.com) API, lets you save
favourites into a personal notebook, and builds a shopping list from them.

*"Mileu" is the Romanian word for a doily — the decorative lace cloth once laid
on tables and furniture.*

The entire UI is in English. **No backend** — everything is saved in your
browser's `localStorage`.

---

## ✨ Features

- **Search & browse** — search by recipe name, filter by **Category** and
  **Cuisine/Area**, plus a fun **"Surprise me"** random recipe button.
- **Recipe detail** — full image, category, area, ingredient + measure list,
  step-by-step instructions, YouTube + source links, and a prominent
  **Save to my notebook** toggle.
- **My Notebook** — everything you've saved, persisted across refreshes, with a
  charming empty state and a remove option.
- **Shopping list** — generated from your saved recipes. Pick which recipes to
  include; duplicate ingredients are **grouped** (combined measures + which
  recipes they came from). Tick items off (checked state persists), add your own
  items by hand, or clear the whole list.
- Mobile-responsive, with friendly loading and error states (the free API
  occasionally returns nothing — the app handles that gracefully).

---

## 🚀 Run it locally

You need [Node.js](https://nodejs.org) (v18+).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

To preview a production build locally:

```bash
npm run build
npm run preview
```

---

## 📦 Deploy to GitHub Pages

The project is preconfigured for GitHub Pages. `vite.config.js` uses
`base: './'` (relative asset paths), so the build works at any sub-path like
`https://<username>.github.io/<repo>/` without hard-coding the repo name. The
`gh-pages` package is already a dev dependency, and `package.json` has a
`deploy` script.

1. **Create a GitHub repo** and push this project to it:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Mileu recipe notebook"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

2. **Deploy** — this builds the app and publishes the `dist/` folder to a
   `gh-pages` branch:

   ```bash
   npm run deploy
   ```

3. In your repo on GitHub, go to **Settings → Pages** and set the source to the
   **`gh-pages`** branch (root). After a minute your app is live at:

   ```
   https://<username>.github.io/<repo>/
   ```

To redeploy after changes, just run `npm run deploy` again.

> **Tip:** If you'd rather pin the base path to your repo name instead of using
> relative paths, open `vite.config.js` and replace `base: './'` with
> `base: '/<repo>/'`.

---

## 🛠️ Project structure

```
.
├── index.html              # HTML shell + Google Fonts
├── vite.config.js          # Vite config (base path for GitHub Pages)
├── package.json
├── public/
│   └── Mileu_icon.png       # app icon / favicon / logo
└── src/
    ├── main.jsx             # React entry, wraps app in NotebookProvider
    ├── App.jsx              # shell: header, tabs, view switching, detail overlay
    ├── api/
    │   └── mealdb.js        # all TheMealDB endpoints + ingredient parsing
    ├── context/
    │   └── NotebookContext.jsx  # saved recipes + shopping list (localStorage)
    ├── hooks/
    │   └── useLocalStorage.js   # persisted-state hook
    ├── components/
    │   ├── Header.jsx
    │   ├── Tabs.jsx
    │   ├── SearchControls.jsx
    │   ├── RecipeCard.jsx
    │   ├── RecipeGrid.jsx
    │   ├── RecipeDetail.jsx
    │   ├── Loader.jsx
    │   ├── ErrorMessage.jsx
    │   └── EmptyState.jsx
    ├── views/
    │   ├── BrowseView.jsx
    │   ├── NotebookView.jsx
    │   └── ShoppingListView.jsx
    └── styles/
        └── index.css        # the whole "Balkan notebook" theme
```

---

## 🌐 API notes

All data comes from TheMealDB's free test key (`1`):
`https://www.themealdb.com/api/json/v1/1/`. Ingredients live in the flat fields
`strIngredient1..20` with matching `strMeasure1..20`; `parseIngredients()` in
`src/api/mealdb.js` combines them into pairs and ignores blanks.

The free key is rate-limited and occasionally returns empty results — that's
expected, and the UI shows friendly messages rather than crashing.

---

Made with ☕ &amp; flour. Recipes courtesy of [TheMealDB](https://www.themealdb.com).
