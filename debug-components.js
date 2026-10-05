// Script de debugging - Agrégalo temporalmente antes de components.min.js
console.clear();
console.log('%c🔍 DEBUG: Cargando componentes...', 'color: blue; font-weight: bold; font-size: 14px');

const originalFetch = window.fetch;
window.fetch = function (...args) {
  console.log(`📡 Fetching: ${args[0]}`);
  return originalFetch
    .apply(this, args)
    .then((response) => {
      if (!response.ok) {
        console.error(`❌ Error: ${response.status} para ${args[0]}`);
      } else {
        console.log(`✅ OK: ${args[0]}`);
      }
      return response;
    })
    .catch((error) => {
      console.error(`❌ Error fetching ${args[0]}:`, error);
      throw error;
    });
};

// Debug de pathname
console.log('%c📍 Información de la página:', 'color: green; font-weight: bold');
console.log('pathname:', window.location.pathname);
console.log('href:', window.location.href);
console.log('origin:', window.location.origin);

// Calcular basePath con la misma lógica que components.js
const pathname = window.location.pathname;
let cleanPath = pathname.replace(/\/$/, '').replace(/\/index\.html$/, '');
const segments = cleanPath.split('/').filter(Boolean);

console.log('cleanPath:', cleanPath);
console.log('segments:', segments);

let depth = 0;
if (segments.length === 0) {
  depth = 0;
} else if (segments.length === 1) {
  if (pathname.includes('/') && !pathname.endsWith(segments[0] + '/') && !pathname.endsWith(segments[0])) {
    depth = 1;
  } else if (pathname !== '/' && pathname !== '/index.html') {
    depth = 1;
  } else {
    depth = 0;
  }
} else {
  depth = segments.length - 1;
}

let basePath = depth > 0 ? '../'.repeat(depth) : '';

console.log('depth calculado:', depth);
console.log('basePath calculado:', basePath);
console.log('%c✅ Debugging listo', 'color: green; font-weight: bold');
