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
  const componentPath = basePath + path;
  const componentScriptPath = scriptPath ? basePath + scriptPath : null;

  // Debug: mostrar en consola (comentado para producción)
  // console.log('📍 Loading component:', elementId, '| pathname:', pathname, '| basePath:', basePath, '| componentPath:', componentPath);

  fetch(componentPath)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((markup) => {
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
