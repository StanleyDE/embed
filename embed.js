/* embed.js */
(function() {
  // 1. Sicherheits-Check
  if (typeof window.Consent === 'undefined') {
    console.error("Fehler: window.Consent ist nicht definiert. Stelle sicher, dass 'consent.js' VOR 'embed.js' geladen wird.");
    return;
  }

  const { loadConsent, saveConsent } = window.Consent;

  // HIER DEINE MESS-ID EINTRAGEN
  const GA_ID = 'G-XXXXXXXX'; 

  // 1. HTML Injektion für den Banner
  function injectModal() {
    if (document.getElementById('cookie-modal')) return;

    const html = `
      <div id="cookie-modal" class="cookie-modal" hidden>
        <div class="cookie-content">
          <h3>Datenschutz & Analyse</h3>
          <p>
            Wir verwenden Cookies, um unsere Website sicher zu betreiben (Cloudflare) und die Nutzung unserer Seite zu analysieren (Google Analytics). Helfen Sie uns, die Erfahrung für Sie zu verbessern? 
            Mit Klick auf "Alle akzeptieren" stimmen Sie der Datenverarbeitung zu. Sie können die Analyse unter "Nur Essenzielle" jederzeit untersagen. 
            Weitere Details finden Sie in unserer <a href="/datenschutz">Datenschutzerklärung</a> und im <a href="/impressum">Impressum</a>.
          </p>
          <div class="cookie-actions">
            <button id="btn-reject" class="btn-ghost">Nur Essenzielle</button>
            <button id="btn-accept" class="btn-primary">Alle akzeptieren</button>
          </div>
        </div>
      </div>
      <style>
        .cookie-modal { position: fixed; bottom: 24px; right: 24px; z-index: 10000; max-width: 400px; width: calc(100% - 48px); animation: slideIn 0.4s ease-out; }
        .cookie-content { background: rgba(11, 11, 12, 0.98); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); color: #e8e8ea; font-family: sans-serif; }
        .cookie-content h3 { margin: 0 0 10px; font-size: 18px; font-weight: 600; color: #fff; }
        .cookie-content p { margin: 0 0 20px; font-size: 13px; color: #a1a1aa; line-height: 1.6; }
        .cookie-content a { color: #fff; text-decoration: underline; }
        .cookie-actions { display: flex; gap: 12px; }
        .cookie-actions button { flex: 1; cursor: pointer; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; transition: all 0.2s; }
        .btn-primary { background: #fff; border: none; color: #000; }
        .btn-ghost { background: transparent; border: 1px solid #3f3f46; color: #a1a1aa; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      </style>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // 2. Google Analytics laden
  function loadGA() {
    if (document.getElementById('google-analytics')) return;
    
    const script = document.createElement('script');
    script.id = 'google-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA_ID);
    };
  }

  function init() {
    injectModal();
    
    const modal = document.getElementById('cookie-modal');
    const btnAccept = document.getElementById('btn-accept');
    const btnReject = document.getElementById('btn-reject');
    
    const currentConsent = loadConsent();
    
    // Prüfen, ob bereits eine Entscheidung (timestamp) vorliegt
    if (!currentConsent.timestamp) {
      modal.hidden = false;
    } else if (currentConsent.analytics) {
      loadGA();
    }

    // Event Handler
    btnAccept.onclick = () => {
      saveConsent({ analytics: true, external: true });
      modal.hidden = true;
      loadGA();
    };

    btnReject.onclick = () => {
      saveConsent({ analytics: false, external: false });
      modal.hidden = true;
      // Bei "Nur Essenzielle" wird loadGA() nicht aufgerufen
    };
  }

  // Start der Logik
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
