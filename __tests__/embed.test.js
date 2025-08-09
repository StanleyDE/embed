describe('embed init', () => {
  beforeEach(() => {
    jest.resetModules();

    const fakeModal = { hidden: true, remove: jest.fn() };
    global.document = {
      readyState: 'complete',
      getElementById: jest.fn((id) => {
        if (id === 'cookie-modal') return fakeModal;
        return null;
      }),
      addEventListener: jest.fn(),
    };

    global.localStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
    };
  });

  test('does not throw when buttons are missing', () => {
    expect(() => require('../embed.js')).not.toThrow();
  });
});
