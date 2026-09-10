(() => {
  const menu = document.querySelector('.mobile-menu');
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.open = false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  document.addEventListener('click', event => { if (menu?.open && !menu.contains(event.target)) menu.open = false; });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [...document.querySelectorAll('[data-motion]')];
  let frame = 0;
  function render() {
    frame = 0;
    scenes.forEach(scene => {
      const rect = scene.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) {
        const position = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
        scene.style.setProperty('--motion', reduced.matches ? '0' : String(position));
      }
    });
  }
  function schedule() { if (!frame && !reduced.matches) frame = requestAnimationFrame(render); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', () => { scenes.forEach(scene => scene.style.setProperty('--motion','0')); schedule(); });
  schedule();
})();
