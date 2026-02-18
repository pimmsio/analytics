const initOutboundDomains = () => {
  const {
    c: cookieManager,
    i: PIMMS_ID_VAR,
    h: HOSTNAME,
    n: DOMAINS_CONFIG,
  } = window._pimmsAnalytics;

  const currentDomain = HOSTNAME.replace(/^www\./, '');
  const outboundDomains = (DOMAINS_CONFIG.outbound || '')
    .split(',')
    .map((d) => d.trim())
    .filter((d) => d && d !== currentDomain);

  if (!outboundDomains.length) return;

  const selector = outboundDomains
    .map((domain) => `a[href*="${domain}"]`)
    .join(',');

  const outboundLinksUpdated = new Set();

  function addOutboundTracking(clickId) {
    const existingCookie = clickId || cookieManager.get(PIMMS_ID_VAR);
    if (!existingCookie) return;

    const links = document.querySelectorAll(selector);
    if (!links.length) return;

    links.forEach((link) => {
      if (outboundLinksUpdated.has(link)) return;

      try {
        const url = new URL(link.href);
        url.searchParams.set(PIMMS_ID_VAR, existingCookie);
        link.href = url.toString();
        outboundLinksUpdated.add(link);
      } catch (e) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => addOutboundTracking());
  } else {
    addOutboundTracking();
  }

  setInterval(addOutboundTracking, 2000);

  window.addEventListener('popstate', () => addOutboundTracking());

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    originalPushState.apply(this, arguments);
    addOutboundTracking();
  };

  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    addOutboundTracking();
  };
};

if (window._pimmsAnalytics) {
  initOutboundDomains();
} else {
  window.addEventListener('load', initOutboundDomains);
}
