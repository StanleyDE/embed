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

  test('loadConsent returns DEFAULT when value is a number', () => {
    localStorage.setItem(LS_KEY, JSON.stringify(42));
    expect(loadConsent()).toEqual(DEFAULT);
  });

  test('loadConsent returns DEFAULT when value is an array', () => {
    localStorage.setItem(LS_KEY, JSON.stringify([true, false]));
    expect(loadConsent()).toEqual(DEFAULT);
  });

  test('loadConsent returns DEFAULT when keys are missing', () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ analytics: true }));
    expect(loadConsent()).toEqual(DEFAULT);
  });

  test('loadConsent returns DEFAULT when key types are invalid', () => {
    const malformed = { essential: "yes", analytics: false, external: false, timestamp: null };
    localStorage.setItem(LS_KEY, JSON.stringify(malformed));
    expect(loadConsent()).toEqual(DEFAULT);
  });

  test('loadConsent returns DEFAULT when extra keys are present', () => {
    const extra = { ...DEFAULT, foo: 'bar' };
    localStorage.setItem(LS_KEY, JSON.stringify(extra));
    expect(loadConsent()).toEqual(DEFAULT);
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
