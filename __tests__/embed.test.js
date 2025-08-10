describe('embed init', () => {
  let fakeModal;

  beforeEach(() => {
    jest.resetModules();

    fakeModal = { hidden: true, remove: jest.fn(), focus: jest.fn() };
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

  test('shows and focuses modal without buttons', () => {
    expect(() => require('../embed.js')).not.toThrow();
    expect(fakeModal.hidden).toBe(false);
    expect(fakeModal.focus).toHaveBeenCalled();
  });
});
