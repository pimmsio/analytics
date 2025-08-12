// Wait for base script to initialize
const initDetectIds = () => {
  const { f: FORWARD_ALL } = window._pimmsAnalytics;

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

  // Official integrations with their parameter patterns
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

  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  }

  function getHighestPriorityCookie(names) {
    for (const name of names) {
      const value = getCookieValue(name);
      if (value) return { name, value };
    }
    return null;
  }

  function matchesDomain(hostname, pattern) {
    return pattern.test(hostname);
  }

  function getCurrentDomain() {
    return window.location.hostname.replace(/^www\./, '');
  }

  function updateLinks(id) {
    const currentDomain = getCurrentDomain();
    const links = document.querySelectorAll('a[href]');

    links.forEach((link) => {
      let updated = false;
      let href = link.href;

      try {
        const url = new URL(link.href);

        // FIRST: Official integrations tracking - add placeholder values
        for (const integration of OFFICIAL_INTEGRATIONS) {
          if (matchesDomain(url.hostname, integration.pattern)) {
            if (!url.searchParams.has(integration.param)) {
              url.searchParams.set(integration.param, integration.value);
              link.href = url.toString();
              href = link.href; // Update href for TARGET_PATTERNS
              updated = true;
              break; // Only apply one integration per link
            }
          }
        }

        // SECOND: ForwardAll functionality - add pimms_id=1 to current domain links
        if (
          FORWARD_ALL &&
          url.hostname.replace(/^www\./, '') === currentDomain &&
          !url.searchParams.has('pimms_id')
        ) {
          url.searchParams.set('pimms_id', '1');
          link.href = url.toString();
          href = link.href; // Update href for TARGET_PATTERNS
          updated = true;
        }
      } catch (e) {
        // Ignore invalid URLs
      }

      // THIRD: TARGET_PATTERNS functionality - replace =1 with actual ID
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
        console.log(`[PIMMS] Updated link: ${link.href}`);
      }
    });
  }

  function debouncedUpdate(id) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => updateLinks(id), 300);
  }

  function init() {
    const cookie = getHighestPriorityCookie(COOKIE_PRIORITY);
    if (!cookie) {
      return;
    }

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

// Run when base script is ready
if (window._pimmsAnalytics) {
  initDetectIds();
} else {
  window.addEventListener('load', initDetectIds);
}
