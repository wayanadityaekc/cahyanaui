const path = require('node:path');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const ROOT = path.join(__dirname, '..');
let registered = false;

const HOOKS = `
const root = ${JSON.stringify(pathToFileURL(`${ROOT}/`).href)};
export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) return next(new URL(specifier.slice(2).replace(/(\\.js)?$/, '.js'), root).href, context);
  return next(specifier, context);
}
export async function load(url, context, next) {
  if (url.startsWith(root) && url.endsWith('.js') && !url.includes('/node_modules/')) return next(url, { ...context, format: 'module' });
  return next(url, context);
}`;

async function importApp(relativePath) {
  if (!registered) {
    register(`data:text/javascript,${encodeURIComponent(HOOKS)}`);
    registered = true;
  }
  return import(pathToFileURL(path.join(ROOT, relativePath)).href);
}

module.exports = { importApp };
