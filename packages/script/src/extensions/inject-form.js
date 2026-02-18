(function () {
  const COOKIE_PRIORITY = ['pimms_id', 'dclid'];
  const FIELD_NAME = 'pimms_id';
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

  function injectFieldIntoForms(id) {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      const existing = form.querySelector(`input[name="${FIELD_NAME}"]`);
      if (existing) {
        if (existing.value !== id) {
          existing.value = id;
          console.log(`[PIMMS] Updated ${FIELD_NAME} in form:`, form);
        }
        return;
      }
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = FIELD_NAME;
      hiddenInput.value = id;
      form.appendChild(hiddenInput);
      console.log(`[PIMMS] Injected ${FIELD_NAME} into form:`, form);
    });
  }

  function debouncedInject(id) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => injectFieldIntoForms(id), 300);
  }

  function init() {
    const cookie = getHighestPriorityCookie(COOKIE_PRIORITY);
    if (!cookie) {
      return;
    }

    console.log(`[PIMMS] [form] Using ${cookie.name}:`, cookie.value);
    injectFieldIntoForms(cookie.value);

    const observer = new MutationObserver(() => debouncedInject(cookie.value));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
