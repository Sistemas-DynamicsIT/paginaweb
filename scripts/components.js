function loadComponent(elementId, path, scriptPath) {
  const container = document.getElementById(elementId);
  if (!container) return;

  // El sitio se sirve desde la raiz (dominio propio), por lo que la profundidad
  // es simplemente el numero de segmentos de la ruta actual.
  const pathname = window.location.pathname;
  let cleanPath = pathname.replace(/\/$/, '').replace(/\/index\.html$/, '');
  const segments = cleanPath.split('/').filter(Boolean);
  const depth = segments.length;
  let basePath = depth > 0 ? '../'.repeat(depth) : '';

  const cleanRoute = path.replace(/^\.\//, '');
  const componentPath = basePath + cleanRoute;
  const componentScriptPath = scriptPath ? basePath + scriptPath.replace(/^\.\//, '') : null;

  fetch(componentPath)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((markup) => {
      if (basePath) {
        markup = markup.replace(/src="\.\/([a-zA-Z])/g, `src="${basePath}$1`);
        markup = markup.replace(/href="\.\/([a-zA-Z])/g, `href="${basePath}$1`);
      }
      container.innerHTML = markup;
      if (componentScriptPath) {
        const script = document.createElement('script');
        script.src = componentScriptPath;
        script.defer = true;
        document.body.appendChild(script);
      }
    })
    .catch(() => {});
}

loadComponent('header', './components/layout/header/header.html', './components/layout/header/header.min.js');
loadComponent('footer', './components/layout/footer/footer.html');