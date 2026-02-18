const initThankYouPage = () => {
  const { n: DOMAINS_CONFIG } = window._pimmsAnalytics;

  const thankYouUrl = DOMAINS_CONFIG['thank-you'];
  if (!thankYouUrl || typeof thankYouUrl !== 'string') return;

  if (!location.pathname.startsWith('/thanks/')) return;

  var key = 'pimms_thanks_fired_' + location.pathname;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch (e) {}

  fetch(thankYouUrl, {
    method: 'GET',
    mode: 'no-cors',
    credentials: 'include',
    keepalive: true,
  });
};

if (window._pimmsAnalytics) {
  initThankYouPage();
} else {
  window.addEventListener('load', initThankYouPage);
}
