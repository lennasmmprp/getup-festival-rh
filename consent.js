/* Bandeau de consentement cookies + Google Analytics (GA4)
   - Google Analytics n'est chargé QUE si le visiteur clique sur « Accepter ».
   - « Refuser » est aussi visible et simple qu'« Accepter » (exigence CNIL).
   - Le choix est conservé 6 mois, puis redemandé.
   - window.getupConsent.reset() rouvre le bandeau (lien sur la politique de confidentialité). */
(function () {
  var GA_ID = 'G-QQ1RJ3HLKF';
  var KEY = 'getup-consent';
  var SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;

  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.date || Date.now() - data.date > SIX_MONTHS) return null;
      return data.value;
    } catch (e) {
      return null;
    }
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value: value, date: Date.now() }));
    } catch (e) {}
  }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function clearGACookies() {
    var host = location.hostname;
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + host;
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + host;
      }
    });
  }

  var STYLE =
    '#getup-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
    'background:#fff;color:#111;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.35);padding:20px 22px;' +
    'font-family:"Jost",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5}' +
    '#getup-consent p{margin:0 0 14px}' +
    '#getup-consent a{color:#003C94;text-decoration:underline}' +
    '#getup-consent .gc-actions{display:flex;gap:10px;flex-wrap:wrap}' +
    '#getup-consent button{flex:1 1 140px;font:inherit;font-weight:600;border-radius:999px;padding:11px 18px;cursor:pointer;border:2px solid #003C94}' +
    '#getup-consent .gc-accept{background:#003C94;color:#fff}' +
    '#getup-consent .gc-refuse{background:#fff;color:#003C94}' +
    '#getup-consent button:focus-visible{outline:3px solid #f7d000;outline-offset:2px}';

  function showBanner() {
    if (document.getElementById('getup-consent')) return;
    if (!document.getElementById('getup-consent-style')) {
      var st = document.createElement('style');
      st.id = 'getup-consent-style';
      st.textContent = STYLE;
      document.head.appendChild(st);
    }
    var box = document.createElement('div');
    box.id = 'getup-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Choix des cookies');
    box.innerHTML =
      '<p>Nous aimerions mesurer l\'audience du site avec Google Analytics, pour savoir quels contenus vous sont utiles. ' +
      'Ces cookies ne sont déposés qu\'avec votre accord. ' +
      '<a href="/politique-de-confidentialite">En savoir plus</a></p>' +
      '<div class="gc-actions">' +
      '<button type="button" class="gc-refuse">Refuser</button>' +
      '<button type="button" class="gc-accept">Accepter</button>' +
      '</div>';
    box.querySelector('.gc-accept').addEventListener('click', function () {
      saveChoice('accepted');
      box.remove();
      window['ga-disable-' + GA_ID] = false;
      loadGA();
    });
    box.querySelector('.gc-refuse').addEventListener('click', function () {
      saveChoice('refused');
      box.remove();
      clearGACookies();
    });
    document.body.appendChild(box);
  }

  window.getupConsent = {
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      if (gaLoaded) {
        clearGACookies();
        window['ga-disable-' + GA_ID] = true;
      }
      showBanner();
    }
  };

  function init() {
    var choice = readChoice();
    if (choice === 'accepted') loadGA();
    else if (choice !== 'refused') showBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
