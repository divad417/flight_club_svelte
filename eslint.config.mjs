// eslint.config.mjs
import svelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['build/**', '.svelte-kit/**', 'node_modules/**', 'functions/**', 'static/**', 'svelte.config.cjs']
  },
  ...tseslint.configs.recommended,
  // Must come after tseslint's global parser config so svelte-eslint-parser
  // wins for .svelte files.
  ...svelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    rules: {
      // `_`-prefixed params are intentionally unused (uniform callback signatures)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // SvelteKit intercepts internal <a href> clicks for client-side routing
      // natively; only programmatic goto() needs an explicit resolve().
      'svelte/no-navigation-without-resolve': ['error', { ignoreLinks: true }]
    }
  },
  prettier
);
