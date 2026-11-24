function initJobFilters() {
  const grid = document.getElementById('jobsGrid');
  if (!grid) return;

  const modeFilter = document.getElementById('workMode');
  const areaFilter = document.getElementById('workArea');
  const typeFilter = document.getElementById('workType');
  const summary = document.getElementById('jobSummary');
  const emptyState = document.getElementById('emptyJobs');
  const jobs = Array.from(grid.querySelectorAll('.job-card'));

  const applyFilters = () => {
    let visibleJobs = 0;

    jobs.forEach((job) => {
      const isVisible =
        (modeFilter.value === 'all' || job.dataset.mode === modeFilter.value) &&
        (areaFilter.value === 'all' || job.dataset.area === areaFilter.value) &&
        (typeFilter.value === 'all' || job.dataset.type === typeFilter.value);

      job.hidden = !isVisible;
      if (isVisible) visibleJobs += 1;
    });

    summary.textContent = `${visibleJobs} ${visibleJobs === 1 ? 'vacante disponible' : 'vacantes disponibles'}`;
    emptyState.hidden = visibleJobs !== 0;
  };

  [modeFilter, areaFilter, typeFilter].forEach((filter) => filter.addEventListener('change', applyFilters));
  applyFilters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initJobFilters);
} else {
  initJobFilters();
}
