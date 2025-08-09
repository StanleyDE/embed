const LS_KEY = "consent_v1";
const DEFAULT = { essential: true, analytics: false, external: false, timestamp: null };
const MAX_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;

function loadConsent(){
  try {
    const c = JSON.parse(localStorage.getItem(LS_KEY));
    if (c && c.timestamp) {
      const age = Date.now() - new Date(c.timestamp).getTime();
      if (age > MAX_VALIDITY_MS) {
        localStorage.removeItem(LS_KEY);
        return { ...DEFAULT };
      }
    }
    return c ? c : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

function saveConsent(next){
  const consent = { ...loadConsent(), ...next, timestamp: new Date().toISOString() };
  localStorage.setItem(LS_KEY, JSON.stringify(consent));
  return consent;
}

if (typeof module !== "undefined") {
  module.exports = { LS_KEY, DEFAULT, loadConsent, saveConsent, MAX_VALIDITY_MS };
}
