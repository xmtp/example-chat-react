const {
  NodeGlobalsPolyfillPlugin,
} = require('@esbuild-plugins/node-globals-polyfill')
const postCssPlugin = require('esbuild-style-plugin')
const cssModulesPlugin = require('esbuild-css-modules-plugin')

const WATCH = process.argv.includes('--watch')

const EXT_ROOT_DIR = './src'

const define = {
  'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  'process.env.NODE_DEBUG': `"${process.env.NODE !== 'production'}"`,
  'process.env.IS_EXTENSION': `"true"`,
  global: 'window',
}

const plugins = [
  NodeGlobalsPolyfillPlugin({
    buffer: true,
    process: false,
  }),
  cssModulesPlugin({
    inject: true, // inject css into the page
  }),
  postCssPlugin({
    postcss: {
      plugins: [require('tailwindcss', require('autoprefixer'))],
    },
  }),
]

const commonOptions = {
  jsx: 'automatic',
  jsxDev: false,
  treeShaking: true,
  loader: {
    '.svg': 'dataurl',
  },
  bundle: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  target: ['es2020'],
  platform: 'browser',
  watch: WATCH
    ? {
        onRebuild(error) {
          if (error) console.error('watch build failed:', error)
          else console.log(`[${new Date()}] watch build succeeded`)
        },
      }
    : undefined,
}

// Config to deal with firebase-messaging-sw.js needing to be named that
require('esbuild')
  .build({
    define: {
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      'process.env.NODE_DEBUG': `"${process.env.NODE !== 'production'}"`,
      'process.env.IS_EXTENSION': `"true"`,
      global: 'window',
      window: '{}',
    },
    entryPoints: [`${EXT_ROOT_DIR}/background/index.ts`],
    ...commonOptions,
    outfile: './public/firebase-messaging-sw.js',
  })
  .then((out) => {
    console.log('Build complete', out)
  })
  .catch(() => process.exit(1))

require('esbuild')
  .build({
    define,
    entryPoints: [
      `${EXT_ROOT_DIR}/popup/index.tsx`,
      // `${EXT_ROOT_DIR}/content/index.tsx`,
      `./styles/globals.css`,
    ],
    jsx: 'automatic',
    plugins,
    ...commonOptions,
    outdir: './public/esbuild',
  })
  .then((out) => {
    console.log('Build complete', out)
  })
  .catch(() => process.exit(1))
