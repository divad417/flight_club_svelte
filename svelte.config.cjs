// svelte.config.cjs
// SvelteKit 3 reads its configuration from vite.config.js (svelte.config.js/.ts
// are no longer supported). This file exists solely for svelte-jester, which
// requires a svelte.config.js/.cjs to find the `preprocess` option for
// component tests. Keep its preprocess option in sync with vite.config.js.
const preprocess = require('svelte-preprocess');

module.exports = {
  preprocess: preprocess({
    scss: {
      charset: false,
      silenceDeprecations: ['import', 'if-function', 'global-builtin', 'color-functions']
    }
  })
};
