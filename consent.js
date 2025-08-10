export const LS_KEY = "consent_v1";
export const DEFAULT = { essential: true, analytics: false, external: false, timestamp: null };

export function loadConsent() {
  try {
    const c = JSON.parse(localStorage.getItem(LS_KEY));
    if (c && typeof c === "object" && !Array.isArray(c)) {
      const hasKeys = ["essential", "analytics", "external", "timestamp"].every((k) =>
        Object.prototype.hasOwnProperty.call(c, k)
      );
      const validTypes =
        typeof c.essential === "boolean" &&
        typeof c.analytics === "boolean" &&
        typeof c.external === "boolean" &&
        (c.timestamp === null ||
          (typeof c.timestamp === "string" &&
            !Number.isNaN(Date.parse(c.timestamp))));

      if (hasKeys && validTypes) {
        return { ...DEFAULT, ...c };
      }
    }
    localStorage.removeItem(LS_KEY);
    return { ...DEFAULT };
  } catch {
    localStorage.removeItem(LS_KEY);
    return { ...DEFAULT };
  }
}

export function saveConsent(next) {
  const consent = { ...loadConsent(), ...next, timestamp: new Date().toISOString() };
  localStorage.setItem(LS_KEY, JSON.stringify(consent));
  return consent;
}

export function resetConsent() {
  localStorage.removeItem(LS_KEY);
}

