// Script que debe ir INMEDIATAMENTE después de <head> en cada HTML
// Esto calcula y inyecta el <base href> correcto

(function () {
  // Calcular el basePath correcto basándose en la profundidad de directorios
  const pathname = window.location.pathname;

  // Estrategia simple y confiable:
  // 1. Contar cuántos "/" hay en la ruta
  // 2. Restar 1 por la raíz
  // 3. Si termina en /, restar 1 más (porque es un directorio)

  let baseHref = './';

  // Limpiar pathname
  let cleanPath = pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');

  // Contar "/" en la ruta limpia
  const slashCount = (cleanPath.match(/\//g) || []).length;

  // En localhost:
  // - "/" → 1 slash → baseHref = "./"
  // - "/about" → 2 slashes → baseHref = "../"
  // En GitHub Pages:
  // - "/paginaweb/" → 2 slashes → queremos que sea "./" (repo root)
  // - "/paginaweb/about" → 3 slashes → queremos que sea "../"

  // Solución: contar "/" y restar 1
  if (slashCount > 1) {
    const depth = slashCount - 1;
    baseHref = '../'.repeat(depth);
  }

  // Inyectar <base> en el head
  const baseTag = document.createElement('base');
  baseTag.href = baseHref;
  document.head.insertBefore(baseTag, document.head.firstChild);

  // Debug (comentar para producción)
  console.log(`[BASE-HREF] pathname: ${pathname}`);
  console.log(`[BASE-HREF] slashCount: ${slashCount}`);
  console.log(`[BASE-HREF] baseHref inyectado: ${baseHref}`);
})();
