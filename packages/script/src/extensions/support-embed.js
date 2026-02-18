const initSupportEmbed = () => {
  const {
    c: cookieManager,
    i: PIMMS_ID_VAR,
    n: DOMAINS_CONFIG,
  } = window._pimmsAnalytics;

  const COOKIE_PRIORITY = ['pimms_id', 'dclid'];

  const TARGET_ATTRIBUTES =
    DOMAINS_CONFIG.embed &&
    Array.isArray(DOMAINS_CONFIG.embed.attributes) &&
    DOMAINS_CONFIG.embed.attributes.length
      ? DOMAINS_CONFIG.embed.attributes
      : ['data-cal-link', 'data-tally-src'];

  const EMBEDDED_HTML_ATTRIBUTES = ['srcdoc'];

  const outboundDomains = (DOMAINS_CONFIG.outbound || '')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);

  if (!outboundDomains.length) return;

  const outboundUrlRegex = new RegExp(
    'https?:[^"\'\\s>]*(' +
      outboundDomains
        .map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|') +
      ')[^"\'\\s>]*',
    'g',
  );

  let debounceTimer = null;
  const processedElements = new Set();

  function getHighestPriorityCookie() {
    for (const name of COOKIE_PRIORITY) {
      const value = cookieManager.get(name);
      if (value) return value;
    }
    return null;
  }

  function matchesOutboundDomain(val) {
    return outboundDomains.some((d) => val.includes(d));
  }

  function appendPimmsId(val, id) {
    if (/^https?:\/\//.test(val)) {
      try {
        const url = new URL(val);
        if (url.searchParams.get(PIMMS_ID_VAR) === id) return null;
        url.searchParams.set(PIMMS_ID_VAR, id);
        return url.toString();
      } catch (e) {
        return null;
      }
    }

    const encoded = encodeURIComponent(id);
    const existing = val.match(new RegExp(PIMMS_ID_VAR + '=([^&]*)'));

    if (existing) {
      if (existing[1] === encoded) return null;
      return val.replace(
        new RegExp(PIMMS_ID_VAR + '=[^&]*'),
        PIMMS_ID_VAR + '=' + encoded,
      );
    }

    const separator = val.includes('?') ? '&' : '?';
    return val + separator + PIMMS_ID_VAR + '=' + encoded;
  }

  function updateTargetAttributes(id) {
    TARGET_ATTRIBUTES.forEach((attr) => {
      document.querySelectorAll(`[${attr}]`).forEach((el) => {
        if (processedElements.has(el)) return;

        const val = el.getAttribute(attr);
        if (!val || !matchesOutboundDomain(val)) return;

        const updated = appendPimmsId(val, id);
        if (updated) {
          el.setAttribute(attr, updated);
          processedElements.add(el);
          console.log(`[PIMMS] Updated ${attr}:`, el);
        }
      });
    });

    EMBEDDED_HTML_ATTRIBUTES.forEach((attr) => {
      document.querySelectorAll(`[${attr}]`).forEach((el) => {
        if (processedElements.has(el)) return;

        const val = el.getAttribute(attr);
        if (!val || !matchesOutboundDomain(val)) return;

        outboundUrlRegex.lastIndex = 0;
        const updatedVal = val.replace(outboundUrlRegex, (match) => {
          try {
            const url = new URL(match, window.location.origin);
            if (url.searchParams.get(PIMMS_ID_VAR) === id) return match;
            url.searchParams.set(PIMMS_ID_VAR, id);
            return url.toString();
          } catch (e) {
            return match;
          }
        });

        if (updatedVal !== val) {
          el.setAttribute(attr, updatedVal);
          processedElements.add(el);
          console.log(`[PIMMS] Updated ${attr} (embedded HTML)`);
        }
      });
    });
  }

  function debouncedUpdate(id) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => updateTargetAttributes(id), 300);
  }

  function init() {
    const id = getHighestPriorityCookie();
    if (!id) return;

    updateTargetAttributes(id);

    const observer = new MutationObserver(() => debouncedUpdate(id));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
};

if (window._pimmsAnalytics) {
  initSupportEmbed();
} else {
  window.addEventListener('load', initSupportEmbed);
}
