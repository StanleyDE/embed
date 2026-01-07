const LS_KEY = "consent_v1";
const DEFAULT = { essential: true, analytics: false, external: false, timestamp: null };

function loadConsent() {
  try {
    const c = JSON.parse(localStorage.getItem(LS_KEY));
    if (c && typeof c === "object" && !Array.isArray(c)) {
      const hasKeys = ["essential", "analytics", "external", "timestamp"].every((k) =>
        Object.prototype.hasOwnProperty.call(c, k)
      );
      // Validierung etwas lockerer machen, falls Typen durch JSON-Serialisierung abweichen,
      // aber im Kern prüfen wir auf Existenz.
      return { ...DEFAULT, ...c };
    }
    // Falls ungültig, Reset
    localStorage.removeItem(LS_KEY);
    return { ...DEFAULT };
  } catch {
    // Falls localStorage deaktiviert ist oder Fehler wirft
    return { ...DEFAULT };
  }
}

function saveConsent(next) {
  const consent = { ...loadConsent() };

  if (next && typeof next === "object") {
    if (typeof next.analytics === "boolean") {
      consent.analytics = next.analytics;
    }
    if (typeof next.external === "boolean") {
      consent.external = next.external;
    }
  }

  consent.timestamp = new Date().toISOString();
  
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(consent));
  } catch (e) {
    console.warn("Consent konnte nicht gespeichert werden (Private Mode?)", e);
  }
  
  return consent;
}

function resetConsent() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch(e) {}
}

// Export Logik: Node vs. Browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = { LS_KEY, DEFAULT, loadConsent, saveConsent, resetConsent };
} else {
  // FIX: Wir erstellen das Objekt 'Consent', nach dem embed.js sucht
  window.Consent = {
    loadConsent: loadConsent,
    saveConsent: saveConsent,
    resetConsent: resetConsent
  };
}
