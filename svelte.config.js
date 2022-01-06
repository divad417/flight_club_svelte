import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    scss: {
      charset: false
    }
  }),

  kit: {
    target: '#svelte',
    adapter: adapter({
      fallback: 'index.html'
    }),
    prerender: {
      enabled: false
    },
    ssr: false
  }
};

export default config;
