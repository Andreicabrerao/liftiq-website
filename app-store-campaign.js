(() => {
  'use strict';

  // Public provider token copied from App Store Connect's campaign generator.
  const providerToken = '128606648';
  const campaigns = new Map([
    ['i', 'instagram_organic'],
    ['t', 'tiktok_organic'],
    ['f', 'facebook_organic'],
  ]);
  const current = new URL(window.location.href);
  const channel = current.searchParams.get('utm_source') === 'heycatch'
    ? current.searchParams.get('utm_campaign')
    : null;
  const campaign = campaigns.get(channel) || 'website_organic';
  const store = new URL('https://apps.apple.com/app/apple-store/id6759868402');
  store.searchParams.set('pt', providerToken);
  store.searchParams.set('ct', campaign);
  store.searchParams.set('mt', '8');

  const applyCampaign = () => {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      let target;
      try {
        target = new URL(href, current);
      } catch {
        return;
      }
      if (target.protocol === 'https:' && target.hostname === 'apps.apple.com'
        && /\/id6759868402\/?$/.test(target.pathname)) {
        link.href = store.href;
        return;
      }
      // Carry only a known channel through local navigation, without cookies or
      // browser storage. Do not copy arbitrary query strings or auth parameters.
      if (campaigns.has(channel) && target.origin === current.origin
        && !href.startsWith('#') && !link.hasAttribute('download')
        && /^\/(?:es\/)?(?:(?:index|privacy|terms|support)(?:\.html)?)?$/.test(target.pathname)
        && !target.searchParams.has('utm_source')
        && !target.searchParams.has('utm_campaign')) {
        target.searchParams.set('utm_source', 'heycatch');
        target.searchParams.set('utm_campaign', channel);
        link.href = target.pathname + target.search + target.hash;
      }
    });

    document.querySelectorAll('[data-app-store-qr]').forEach((image) => {
      image.src = `/qr/${campaign}.svg`;
    });

    if (document.body.hasAttribute('data-app-store-redirect')) {
      window.location.replace(store.href);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCampaign, { once: true });
  } else {
    applyCampaign();
  }
})();
