import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Static site for GitHub Pages. The Pages workflow sets VITE_BASE_PATH to the
// repository sub-path (e.g. /New_DADlab_Webpage/); locally the site is at /.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
});
