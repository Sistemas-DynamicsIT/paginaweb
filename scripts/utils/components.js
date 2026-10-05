function loadComponent(elementId, path, scriptPath) {
  const container = document.getElementById(elementId);
  if (!container) return;

  // Calcular la profundidad de la carpeta actual para ajustar las rutas
  const pathname = window.location.pathname;
  // Contar las barras diagonales, pero no la de cierre final
  let cleanPathname = pathname.replace(/\/$/, ''); // Remover / final
  const slashCount = (cleanPathname.match(/\//g) || []).length;

  // Si estamos en una subcarpeta, ajustar las rutas con ../
  // slashCount = 1 significa raíz (/) → basePath = ""
  // slashCount = 2 significa subcarpeta (/quienes-somos/) → basePath = "../"
  let basePath = '';
  if (slashCount > 1) {
    basePath = '../'.repeat(slashCount - 1);
  }

  // Construir rutas con el basePath calculado
  // Remover el "./" inicial del path antes de concatenar con basePath
  const cleanPath = path.replace(/^\.\//, '');
  const componentPath = basePath + cleanPath;
  const componentScriptPath = scriptPath ? basePath + scriptPath.replace(/^\.\//, '') : null;

  // Debug: mostrar en consola (comentado para producción)
  // console.log('📍 Loading component:', elementId, '| pathname:', pathname, '| basePath:', basePath, '| componentPath:', componentPath);

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
