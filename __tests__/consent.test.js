const { loadConsent, saveConsent, resetConsent, DEFAULT, LS_KEY } = require('../consent');

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

  test('loadConsent returns DEFAULT and clears invalid JSON', () => {
    localStorage.setItem(LS_KEY, '{invalid');
    expect(loadConsent()).toEqual(DEFAULT);
    expect(localStorage.getItem(LS_KEY)).toBeNull();
  });
  test('loadConsent returns stored values when valid', () => {
    const timestamp = new Date().toISOString();
    const stored = { essential: false, analytics: true, external: true, timestamp };
    localStorage.setItem(LS_KEY, JSON.stringify(stored));
    expect(loadConsent()).toEqual(stored);
  });

  test('loadConsent returns DEFAULT and clears invalid timestamp', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ analytics: true }));
    expect(loadConsent()).toEqual(DEFAULT);
    expect(localStorage.getItem(LS_KEY)).toBeNull();
  });

  test('loadConsent removes malformed object', () => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ essential: true, analytics: true, external: false, timestamp: 123 })
    );
    expect(loadConsent()).toEqual(DEFAULT);
    expect(localStorage.getItem(LS_KEY)).toBeNull();
  });

  test('mutating loadConsent result does not affect storage', () => {
    const timestamp = new Date().toISOString();
    const stored = { essential: true, analytics: true, external: false, timestamp };
    localStorage.setItem(LS_KEY, JSON.stringify(stored));
    const result = loadConsent();
    result.analytics = false;
    const saved = JSON.parse(localStorage.getItem(LS_KEY));
    expect(saved.analytics).toBe(true);
  });


  test('saveConsent writes to localStorage', () => {
    const result = saveConsent({ analytics: true });
    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(stored).toMatchObject({ analytics: true });
    expect(result.analytics).toBe(true);
  });

  test('resetConsent removes saved consent', () => {
    saveConsent({ analytics: true });
    resetConsent();
    expect(loadConsent()).toEqual(DEFAULT);
  });
});
