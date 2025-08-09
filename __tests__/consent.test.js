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

  test('loadConsent returns DEFAULT when localStorage invalid', () => {
    localStorage.setItem(LS_KEY, '{invalid');
    expect(loadConsent()).toEqual(DEFAULT);
  });

  test('loadConsent fills missing fields', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ analytics: true }));
    expect(loadConsent()).toEqual({ ...DEFAULT, analytics: true });
  });

  test('mutating loadConsent result does not affect storage', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ analytics: true }));
    const result = loadConsent();
    result.analytics = false;
    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    expect(stored.analytics).toBe(true);
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
