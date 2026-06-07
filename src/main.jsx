import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { NotebookProvider } from './context/NotebookContext.jsx'
import './styles/index.css'

// Mount the React app. NotebookProvider wraps everything so the saved-recipes
// notebook and shopping list are available to any component via context.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotebookProvider>
      <App />
    </NotebookProvider>
  </React.StrictMode>
)
