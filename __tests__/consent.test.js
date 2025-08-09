const { loadConsent, saveConsent, DEFAULT, LS_KEY, MAX_VALIDITY_MS } = require('../consent');

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

describe('consent helpers', () => {
  beforeEach(() => localStorage.clear());

  test('loadConsent returns DEFAULT when localStorage empty', () => {
    expect(loadConsent()).toEqual(DEFAULT);
  });

  test('loadConsent returns DEFAULT when localStorage invalid', () => {
    localStorage.setItem(LS_KEY, '{invalid');
    expect(loadConsent()).toEqual(DEFAULT);
  });

  test('saveConsent writes to localStorage', () => {
    const result = saveConsent({ analytics: true });
    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(stored).toMatchObject({ analytics: true });
    expect(result.analytics).toBe(true);
  });

  test('loadConsent returns DEFAULT when consent expired', () => {
    const old = new Date(Date.now() - MAX_VALIDITY_MS - 1000).toISOString();
    const expired = { ...DEFAULT, analytics: true, timestamp: old };
    localStorage.setItem(LS_KEY, JSON.stringify(expired));
    expect(loadConsent()).toEqual(DEFAULT);
    expect(localStorage.getItem(LS_KEY)).toBeNull();
  });
});
