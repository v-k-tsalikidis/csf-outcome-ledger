import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// GitHub Pages serves a project site from a subpath, so a build that asks
// for its assets at the root loads the HTML and then 404s on everything
// else. The result is a blank page with no error anyone can see.
//
// BASE_PATH overrides it, because this app is meant to move: served from
// the root of another site, `BASE_PATH=/` produces the right build without
// editing this file.
const base = process.env.BASE_PATH ?? '/CSF-Outcome-Ledger/';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // The dev server always serves from the root; only a build needs the
  // subpath it will actually be published under.
  base: command === 'build' ? base : '/',
}));
