(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Progressive enhancement: all feature panels remain readable without JavaScript.
  const explorer = document.querySelector('.feature-explorer');
  const tabs = [...document.querySelectorAll('[data-feature]')];
  const panels = tabs.map(tab => document.getElementById(`feature-${tab.dataset.feature}`));
  if (explorer && tabs.length && panels.every(Boolean)) {
    explorer.classList.add('feature-interactive');
    explorer.querySelector('.feature-tabs').setAttribute('role', 'tablist');
    const select = (index, focus = false, animate = false) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) tabs[index].focus();
      if (animate && !media.matches) panels[index].animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 300, easing: 'ease-out' }
      );
    };
    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', tab.id);
      panels[i].removeAttribute('aria-label');
      tab.addEventListener('click', () => select(i, false, true));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next, true, true); }
      });
    });
    select(0);
  }
  let dispose = () => {};
  const setup = () => {
    dispose();
    if (media.matches || !('IntersectionObserver' in window)) return;
    const items = [...document.querySelectorAll('.section-head,.feature-explorer,.coach-panel,.science-heading,.science-grid article,.center-head,.plan,.faq-item,.finale .container')];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('shown');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
    for (const item of items) if (item.getBoundingClientRect().top > innerHeight) {
      item.classList.add('reveal');
      observer.observe(item);
    }
    const focus = event => event.target.closest('.reveal')?.classList.add('shown');
    document.addEventListener('focusin', focus);
    dispose = () => {
      observer.disconnect();
      document.removeEventListener('focusin', focus);
      items.forEach(item => item.classList.remove('reveal', 'shown'));
    };
  };
  setup();
  media.addEventListener('change', setup);
  // The FAQ stays native and usable without JavaScript.
})();
