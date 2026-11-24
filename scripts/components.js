function loadComponent(elementId, path, scriptPath) {
  const container = document.getElementById(elementId);
  if (!container) return;

  // Calcular la profundidad de forma robusta para localhost y GitHub Pages
  const pathname = window.location.pathname;

  // Remover trailing / e index.html si existen
  let cleanPath = pathname.replace(/\/$/, '').replace(/\/index\.html$/, '');

  // Obtener segmentos (carpetas)
  const segments = cleanPath.split('/').filter(Boolean);

  // Lógica inteligente:
  // - Si hay 0 segmentos: raíz (/) → depth = 0
  // - Si hay 1 segmento: puede ser /about/ (localhost) o /paginaweb/ (GitHub repo) → depth = 1 o 0
  //   Para distinguir: GitHub Pages siempre tiene el repo como el ÚNICO segmento en la raíz
  //   Solución: asumir que si es un segmento solo, es un subdirectorio (depth=1), EXCEPTO
  //   si el pathname actual NO contiene barras adicionales (entonces es el repo)
  // - Si hay 2+ segmentos: primer es repo (GitHub) o raíz (localhost), resto es contenido → depth = segments.length - 1

  let depth = 0;

  if (segments.length === 0) {
    // Raíz
    depth = 0;
  } else if (segments.length === 1) {
    // Podría ser /about/ (localhost) o /paginaweb/ (GitHub)
    // Verificar si estamos realmente en un subdirectorio o en la raíz del repo
    // Si pathname tiene "/index.html" o termina en "/", probablemente sea un directorio de contenido
    if (pathname.includes('/') && !pathname.endsWith(segments[0] + '/') && !pathname.endsWith(segments[0])) {
      // Hay más rutas después, entonces es un subdirectorio
      depth = 1;
    } else if (pathname !== '/' && pathname !== '/index.html') {
      // Hay algo más que solo /, probablemente /about/ en localhost
      depth = 1;
    } else {
      // Es la raíz
      depth = 0;
    }
  } else {
    // Múltiples segmentos
    // El primero probablemente es repo (GitHub) o raíz (localhost)
    // Los demás son el contenido
    depth = segments.length - 1;
  }

  let basePath = depth > 0 ? '../'.repeat(depth) : '';

  // Construir rutas con el basePath calculado
  const cleanRoute = path.replace(/^\.\//, '');
  const componentPath = basePath + cleanRoute;
  const componentScriptPath = scriptPath ? basePath + scriptPath.replace(/^\.\//, '') : null;

  fetch(componentPath)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((markup) => {
      // Ajustar rutas relativas dentro del markup si estamos en una subcarpeta
      if (basePath) {
        // Reemplazar "./assets/" con basePath + "assets/"
        // Reemplazar "./components/" con basePath + "components/"
        // Pero NO reemplazar "./" a secas (como en enlaces)
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
    .catch((error) => {
      console.error(`Error loading ${elementId}:`, error);
      console.error(`Attempted path: ${componentPath}`);
    });
}

loadComponent('header', './components/layout/header/header.html', './components/layout/header/header.min.js');
loadComponent('footer', './components/layout/footer/footer.html');
