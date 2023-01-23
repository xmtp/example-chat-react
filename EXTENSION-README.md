# Chrome extension README

The chrome extension is a replica of the existing next app. Where possible the same components are used, but in many cases where the next router is relied upon, we need to branch the logic, because the next router doesn't work inside a chrome extension popup window.

## Codebase structure

The "root" for the extension is `src/popup/index.tsx`.

## Building

We use `esbuild` to build the extension.

To build the extension for production, run `npm run ext:build`. To build it for dev, run `npm run ext:build:dev`.

The build script outputs it's files to `public`.

- The extension manifest lives at `public/manifest.json`.
- The service worker/background script src is at `src/background/index.ts`. This gets output to `public/firebase-messaging-sw.js`. This is what firebase requires and expects by default in order to register a service worker listener for push notifications.
- The rest of the app files end up in `public/esbuild`.

## Development

In development, you'll want to automatically output the build script when anything changes. You can do this via `npm run ext:watch`.

You'll need to load the extension into chrome manually. To do this, go to chrome://extensions, enable developer mode, and click "Load unpacked". Select the public/ directory.

### tsconfig react gotcha

For compiling jsx, some of esbuild's configuration uses the project's tsconfig file.

## Why not plasmo?

I tried using plasmo initially, but was running into odd issues with it's polyfill library. Hence the custom esbuild
