const { loadConsent, saveConsent, DEFAULT, LS_KEY } = require('../consent');

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
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
});
