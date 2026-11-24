// Script que debe ir INMEDIATAMENTE despues de <head> en cada HTML
// Inyecta <base href> apuntando al directorio del documento actual.

(function () {
  // El sitio se sirve desde la raiz (dominio propio), por lo que el <base>
  // apunta al directorio del documento. Las rutas relativas usan la
  // profundidad correcta (../, ../../) segun la ubicacion del archivo.
  const baseTag = document.createElement('base');
  baseTag.href = './';
  document.head.insertBefore(baseTag, document.head.firstChild);
})();