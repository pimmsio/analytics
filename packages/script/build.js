const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const watchMode = process.argv.includes('--watch');

const baseConfig = {
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2015',
};

// Helper to read and combine files
const combineFiles = (files) => {
  // Just concatenate the files, esbuild will handle the IIFE wrapping
  return files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
};

// Ensure dist/analytics exists
fs.mkdirSync(path.join(__dirname, 'dist/analytics'), { recursive: true });

// Copy _redirects to dist folder
fs.copyFileSync(
  path.join(__dirname, 'public/_redirects'),
  path.join(__dirname, 'dist/_redirects'),
);

const builds = [
  {
    label: 'script.js',
    stdin: {
      contents: () => fs.readFileSync('src/base.js', 'utf8'),
      sourcefile: 'base.js',
    },
    outfile: 'dist/analytics/script.js',
  },
  {
    label: 'script.site-visit.js',
    stdin: {
      contents: () =>
        combineFiles(['src/base.js', 'src/extensions/site-visit.js']),
      sourcefile: 'combined.js',
    },
    outfile: 'dist/analytics/script.site-visit.js',
  },
  {
    label: 'script.outbound-domains.js',
    stdin: {
      contents: () =>
        combineFiles(['src/base.js', 'src/extensions/outbound-domains.js']),
      sourcefile: 'combined.js',
    },
    outfile: 'dist/analytics/script.outbound-domains.js',
  },
  {
    label: 'script.site-visit.outbound-domains.js',
    stdin: {
      contents: () =>
        combineFiles([
          'src/base.js',
          'src/extensions/site-visit.js',
          'src/extensions/outbound-domains.js',
        ]),
      sourcefile: 'combined.js',
    },
    outfile: 'dist/analytics/script.site-visit.outbound-domains.js',
  },
  {
    label: 'script.detection.js',
    stdin: {
      contents: () =>
        combineFiles([
          'src/base.js',
          'src/extensions/outbound-domains.js',
          'src/extensions/detect-ids.js',
          'src/extensions/support-embed.js',
          'src/extensions/thank-you-page.js',
        ]),
      sourcefile: 'combined.js',
    },
    outfile: 'dist/analytics/script.detection.js',
  },
  {
    label: 'script.expose.js',
    stdin: {
      contents: () => fs.readFileSync('src/extensions/expose-ids.js', 'utf8'),
      sourcefile: 'base.js',
    },
    outfile: 'dist/analytics/script.expose.js',
  },
  {
    label: 'script.inject-form.js',
    stdin: {
      contents: () => fs.readFileSync('src/extensions/inject-form.js', 'utf8'),
      sourcefile: 'base.js',
    },
    outfile: 'dist/analytics/script.inject-form.js',
  },
];

function runBuild() {
  return Promise.all(
    builds.map(({ stdin, outfile }) =>
      esbuild.build({
        ...baseConfig,
        stdin: {
          contents: stdin.contents(),
          resolveDir: __dirname,
          sourcefile: stdin.sourcefile,
        },
        outfile,
      }),
    ),
  );
}

if (watchMode) {
  runBuild().then(() => {
    console.log('[watch] Initial build complete');
    fs.watch('src', { recursive: true }, (event, filename) => {
      if (!filename || !filename.endsWith('.js')) return;
      console.log(`[watch] ${filename} changed, rebuilding...`);
      runBuild()
        .then(() => console.log('[watch] Rebuild complete'))
        .catch((err) => console.error('[watch] Build error:', err.message));
    });
    console.log('[watch] Watching src/ for changes...');
  });
} else {
  runBuild().catch(() => process.exit(1));
}
