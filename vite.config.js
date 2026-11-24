// vite.config.js
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ fallback: 'index.html' }),
      // target defaults to '#svelte', matching the container id in src/app.html
      preprocess: preprocess({
        scss: {
          charset: false,
          // Bootstrap 5.x (node_modules) is still on legacy Sass syntax;
          // silence its deprecations until bootstrap moves on.
          silenceDeprecations: ['import', 'if-function', 'global-builtin', 'color-functions']
        }
      })
    })
  ]
});
