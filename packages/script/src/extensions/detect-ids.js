const initDetectIds = () => {
  const { c: cookieManager, f: FORWARD_ALL } = window._pimmsAnalytics;

  const COOKIE_PRIORITY = ['pimms_id', 'dclid'];
  const TARGET_PATTERNS = [
    {
      match: 'pimms_client_reference_id=1',
      replace: (id) => `client_reference_id=pimms_id_${id}`,
    },
    {
      match: 'pimms_id=1',
      replace: (id) => `pimms_id=${id}`,
    },
    {
      match: 'utm_term=1',
      replace: (id) => `utm_term=${id}`,
    },
  ];

  const OFFICIAL_INTEGRATIONS = [
    {
      pattern: /\.cal\.com$/,
      param: 'pimms_id',
      value: '1',
    },
    {
      pattern: /^buy\.stripe\.com$/,
      param: 'pimms_client_reference_id',
      value: '1',
    },
    {
      pattern: /\.iclosed\.io$/,
      param: 'utm_term',
      value: '1',
    },
  ];

  let debounceTimer = null;
  const processedLinks = new Set();

  function getHighestPriorityCookie() {
    for (const name of COOKIE_PRIORITY) {
      const value = cookieManager.get(name);
      if (value) return { name, value };
    }
    return null;
  }

  function getCurrentDomain() {
    return window.location.hostname.replace(/^www\./, '');
  }

  function updateLinks(id) {
    const currentDomain = getCurrentDomain();
    const links = document.querySelectorAll('a[href]');

    links.forEach((link) => {
      if (processedLinks.has(link)) return;

      let updated = false;
      let href = link.href;

      try {
        const url = new URL(link.href);

        for (const integration of OFFICIAL_INTEGRATIONS) {
          if (integration.pattern.test(url.hostname)) {
            if (!url.searchParams.has(integration.param)) {
              url.searchParams.set(integration.param, integration.value);
              link.href = url.toString();
              href = link.href;
              updated = true;
              break;
            }
          }
        }

        if (
          FORWARD_ALL &&
          url.hostname.replace(/^www\./, '') === currentDomain &&
          !url.searchParams.has('pimms_id')
        ) {
          url.searchParams.set('pimms_id', '1');
          link.href = url.toString();
          href = link.href;
          updated = true;
        }
      } catch (e) {}

      TARGET_PATTERNS.forEach(({ match, replace }) => {
        if (href.includes(match)) {
          const newHref = href.replace(match, replace(id));
          if (href !== newHref) {
            link.href = newHref;
            href = newHref;
            updated = true;
          }
        }
      });

      if (updated) {
        processedLinks.add(link);
        console.log(`[PIMMS] Updated link: ${link.href}`);
      }
    });
  }

  function debouncedUpdate(id) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => updateLinks(id), 300);
  }

  function init() {
    const cookie = getHighestPriorityCookie();
    if (!cookie) return;

    console.log(`[PIMMS] [links] Using ${cookie.name}:`, cookie.value);
    updateLinks(cookie.value);

    const observer = new MutationObserver(() => debouncedUpdate(cookie.value));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
};

if (window._pimmsAnalytics) {
  initDetectIds();
} else {
  window.addEventListener('load', initDetectIds);
}
