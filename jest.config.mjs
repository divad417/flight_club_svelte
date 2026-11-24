// Jest runs in ESM mode (NODE_OPTIONS=--experimental-vm-modules jest — see
// the test script in package.json). svelte-jester 5 requires it for Svelte 4+:
// the compiled Svelte 5 output is ESM-only. In ESM mode, ESM-only packages in
// node_modules (svelte, @testing-library/*) are loaded natively.
export default {
  extensionsToTreatAsEsm: [".ts", ".svelte"],
  moduleFileExtensions: ["js", "ts", "json", "node", "svelte"],
  moduleNameMapper: {
    "^#lib/(.*)\\.js$": "<rootDir>/src/lib/$1",
    "^#lib/(.*)": "<rootDir>/src/lib/$1"
  },
  testEnvironment: "jsdom",
  // @testing-library/svelte-core dynamically imports .svelte/.svelte.js
  // scaffolding from node_modules; let the svelte-jester transform reach it.
  transformIgnorePatterns: ["node_modules/(?!@testing-library/)"],
  transform: {
    // .svelte.js patterns must come first: they end in .js too.
    "^.+\\.svelte\\.js$": ["svelte-jester", { preprocess: true }],
    "^.+\\.svelte$": ["svelte-jester", { preprocess: true }],
    "^.+\\.[jt]s$": ["ts-jest", { tsconfig: "tsconfig.jest.json", useESM: true }]
  }
};
