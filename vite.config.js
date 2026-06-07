import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
//
// `base: './'` makes all asset URLs relative, so the build works whether it is
// served from the domain root OR from a GitHub Pages project sub-path like
// `https://<username>.github.io/<repo>/`. You don't have to hard-code the repo
// name this way.
//
// If you'd rather pin it to a specific repo path instead, replace the line with:
//   base: '/your-repo-name/',
export default defineConfig({
  plugins: [react()],
  base: './',
})
