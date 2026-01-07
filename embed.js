/* embed.js */
(function() {
  // Imports simulieren (Browser-safe)
  const { loadConsent, saveConsent, hasConsented } = (typeof window.Consent !== 'undefined') 
    ? window.Consent 
    : require('./consent');

  // Konfiguration für externe Skripte (Beispiel)
  const MANAGED_SCRIPTS = [
    {
      category: 'analytics',
      src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX', // DEINE ID HIER
      id: 'google-analytics'
    }
  ];

  // 1. HTML Injektion für den Banner (Modernes Design)
  function injectModal() {
    if (document.getElementById('cookie-modal')) return;

    const html = `
      <div id="cookie-modal" class="cookie-modal" hidden>
        <div class="cookie-content">
          <h3>Privatsphäre & Transparenz</h3>
          <p>Wir nutzen Cookies, um die UX zu verbessern und Leads zu messen. Entscheide selbst.</p>
          <div class="cookie-actions">
            <button id="btn-reject" class="btn-ghost">Nur Essenzielle</button>
            <button id="btn-accept" class="btn-primary">Alle akzeptieren</button>
          </div>
        </div>
      </div>
      <style>
        .cookie-modal { position: fixed; bottom: 24px; right: 24px; z-index: 10000; max-width: 380px; width: 100%; animation: slideIn 0.4s ease-out; }
        .cookie-content { background: rgba(11, 11, 12, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); color: #e8e8ea; font-family: 'Inter', sans-serif; }
        .cookie-content h3 { margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #fff; }
        .cookie-content p { margin: 0 0 20px; font-size: 14px; color: #a1a1aa; line-height: 1.5; }
        .cookie-actions { display: flex; gap: 12px; }
        .cookie-actions button { flex: 1; cursor: pointer; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 500; transition: all 0.2s; }
        .btn-primary { background: #fff; border: none; color: #000; }
        .btn-primary:hover { background: #e0e0e0; transform: translateY(-1px); }
        .btn-ghost { background: transparent; border: 1px solid #333; color: #a1a1aa; }
        .btn-ghost:hover { border-color: #666; color: #fff; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      </style>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // 2. Skripte nachladen basierend auf Consent
  function applyConsent(consent) {
    if (consent.analytics) {
      MANAGED_SCRIPTS.filter(s => s.category === 'analytics').forEach(script => {
        if (!document.getElementById(script.id)) {
          const el = document.createElement('script');
          el.src = script.src;
          el.id = script.id;
          el.async = true;
          document.head.appendChild(el);
          
          // Google Analytics Init Code (optional)
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXX'); // DEINE ID HIER
        }
      });
    }
  }

  function init() {
    injectModal();
    
    const modal = document.getElementById('cookie-modal');
    const btnAccept = document.getElementById('btn-accept');
    const btnReject = document.getElementById('btn-reject');
    
    // Prüfen, ob bereits entschieden wurde
    const currentConsent = loadConsent();
    if (!currentConsent.timestamp) {
      modal.hidden = false;
    } else {
      applyConsent(currentConsent);
    }

    // Event Listener für Buttons
    const handleSave = (allowAll) => {
      const newConsent = saveConsent({ analytics: allowAll, external: allowAll });
      modal.hidden = true;
      applyConsent(newConsent);
    };

    if (btnAccept) btnAccept.onclick = () => handleSave(true);
    if (btnReject) btnReject.onclick = () => handleSave(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
