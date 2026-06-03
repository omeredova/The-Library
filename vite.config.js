// Vite build configuration.
//
// Vite is only a build tool (a dev dependency) — the application itself stays
// pure vanilla JS, with no frameworks or runtime libraries, as required.
//
// The goal of this config is a production build that emits exactly three things:
//   dist/index.html  — the HTML entry
//   dist/app.js      — a single optimized/minified JS bundle (CSS inlined into it)
//   dist/assets/     — the static icons (the SVG favicon)
//
// To get there we:
//   1. Output one JS file (`app.js`) and put every other static asset under
//      `assets/`.
//   2. Inline all CSS into the JS bundle with a small custom plugin, so the
//      build never produces a separate `.css` file.

import { defineConfig } from 'vite';

/**
 * Custom plugin: fold the generated CSS into the JS bundle.
 *
 * Vite normally emits CSS as its own `.css` asset and links it from the HTML.
 * For this assignment the build must boil down to HTML + JS + an icons folder,
 * so we instead:
 *   - collect every emitted CSS asset and remove it from the bundle,
 *   - prepend a tiny snippet to the entry chunk that injects that CSS as a
 *     <style> tag at runtime,
 *   - strip the now-dangling stylesheet <link> from the generated HTML.
 */
function inlineCssIntoJs() {
  return {
    name: 'inline-css-into-js',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      // 1. Pull all CSS out of the bundle.
      let css = '';
      for (const fileName of Object.keys(bundle)) {
        const file = bundle[fileName];
        if (file.type === 'asset' && fileName.endsWith('.css')) {
          css += typeof file.source === 'string' ? file.source : file.source.toString();
          delete bundle[fileName];
        }
      }
      if (!css) return;

      // 2. Inject the collected CSS into the entry JS chunk.
      const injected =
        '(function(){' +
        'var s=document.createElement("style");' +
        's.setAttribute("data-inlined","true");' +
        's.textContent=' +
        JSON.stringify(css) +
        ';document.head.appendChild(s);' +
        '})();\n';

      for (const fileName of Object.keys(bundle)) {
        const file = bundle[fileName];
        if (file.type === 'chunk' && file.isEntry) {
          file.code = injected + file.code;
          break;
        }
      }

      // 3. Remove the leftover <link rel="stylesheet"> from the HTML so it does
      //    not point at a CSS file we just deleted.
      for (const fileName of Object.keys(bundle)) {
        const file = bundle[fileName];
        if (file.type === 'asset' && fileName.endsWith('.html')) {
          const html = typeof file.source === 'string' ? file.source : file.source.toString();
          file.source = html.replace(/\s*<link[^>]+rel="stylesheet"[^>]*>/g, '');
        }
      }
    },
  };
}

export default defineConfig({
  // Relative base so the build runs from any path (e.g. served from a subfolder).
  base: './',
  plugins: [inlineCssIntoJs()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    cssCodeSplit: false, // one CSS bundle, which the plugin above then inlines
    rollupOptions: {
      output: {
        // A single JS file at the root, everything else (icons) under assets/.
        entryFileNames: 'app.js',
        chunkFileNames: 'app.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
