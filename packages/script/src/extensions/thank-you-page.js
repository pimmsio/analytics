const initThankYouPage = () => {
  const { n: DOMAINS_CONFIG } = window._pimmsAnalytics;

  const thankYouUrl = DOMAINS_CONFIG['thank-you'];
  if (!thankYouUrl || typeof thankYouUrl !== 'string') return;

  const path = location.pathname;
  if (!path.startsWith('/thanks/') && path !== '/members/thanks') return;

  if (new URLSearchParams(location.search).has('pimms_redirected')) return;

  var key = 'pimms_thanks_fired_' + path;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch (e) {}

  var tyUrl = new URL(thankYouUrl);
  tyUrl.searchParams.set('pimms_redirect', location.href);
  window.location.href = tyUrl.toString();
};

if (window._pimmsAnalytics) {
  initThankYouPage();
} else {
  window.addEventListener('load', initThankYouPage);
}
