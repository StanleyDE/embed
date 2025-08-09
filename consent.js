const LS_KEY = "consent_v1";
const DEFAULT = { essential: true, analytics: false, external: false, timestamp: null };

function loadConsent(){
  try {
    const c = JSON.parse(localStorage.getItem(LS_KEY));
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

function resetConsent(){
  localStorage.removeItem(LS_KEY);
}

if (typeof module !== "undefined") {
  module.exports = { LS_KEY, DEFAULT, loadConsent, saveConsent, resetConsent };
}
