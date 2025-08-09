const LS_KEY = "consent_v1";
const DEFAULT = { essential: true, analytics: false, external: false, timestamp: null };

function loadConsent(){
  try {
    const c = JSON.parse(localStorage.getItem(LS_KEY));
    if (c && typeof c === "object" && !Array.isArray(c)) {
      const keys = ["essential", "analytics", "external", "timestamp"];
      const hasAllKeys = keys.every((k) =>
        Object.prototype.hasOwnProperty.call(c, k)
      );
      const noExtraKeys = Object.keys(c).every((k) => keys.includes(k));
      const validTypes =
        typeof c.essential === "boolean" &&
        typeof c.analytics === "boolean" &&
        typeof c.external === "boolean" &&
        (typeof c.timestamp === "string" || c.timestamp === null);
      if (hasAllKeys && noExtraKeys && validTypes) {
        const cleaned = keys.reduce((acc, k) => ({ ...acc, [k]: c[k] }), {});
        return { ...DEFAULT, ...cleaned };
      }
    }
    return { ...DEFAULT };
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
