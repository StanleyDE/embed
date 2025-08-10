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

describe('embed interactions', () => {
  let fakeModal;
  let fakeAccept;
  let fakeReject;

  beforeEach(() => {
    jest.resetModules();

    fakeModal = { hidden: true, remove: jest.fn() };
    fakeAccept = { addEventListener: jest.fn((_, cb) => { fakeAccept.cb = cb; }) };
    fakeReject = { addEventListener: jest.fn((_, cb) => { fakeReject.cb = cb; }) };

    global.document = {
      readyState: 'complete',
      getElementById: jest.fn((id) => {
        if (id === 'cookie-modal') return fakeModal;
        if (id === 'btn-accept') return fakeAccept;
        if (id === 'btn-reject') return fakeReject;
        return null;
      }),
      addEventListener: jest.fn(),
    };

    global.localStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
    };
  });

  test('accept click saves positive consent and removes modal', () => {
    require('../embed.js');
    fakeAccept.cb();

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    const [key, value] = localStorage.setItem.mock.calls[0];
    expect(key).toBe('consent_v1');
    const data = JSON.parse(value);
    expect(data).toMatchObject({ essential: true, analytics: true, external: true });
    expect(typeof data.timestamp).toBe('string');
    expect(fakeModal.remove).toHaveBeenCalled();
  });

  test('reject click saves negative consent', () => {
    require('../embed.js');
    fakeReject.cb();

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    const [key, value] = localStorage.setItem.mock.calls[0];
    expect(key).toBe('consent_v1');
    const data = JSON.parse(value);
    expect(data).toMatchObject({ essential: true, analytics: false, external: false });
    expect(typeof data.timestamp).toBe('string');
  });
});

describe('localStorage failures', () => {
  let fakeModal;
  let fakeAccept;

  beforeEach(() => {
    jest.resetModules();

    fakeModal = { hidden: true, remove: jest.fn(), focus: jest.fn() };
    fakeAccept = { addEventListener: jest.fn((_, cb) => { fakeAccept.cb = cb; }) };

    global.document = {
      readyState: 'complete',
      getElementById: jest.fn((id) => {
        if (id === 'cookie-modal') return fakeModal;
        if (id === 'btn-accept') return fakeAccept;
        return null;
      }),
      addEventListener: jest.fn(),
    };

    global.console = { warn: jest.fn() };
  });

  test('shows modal when getItem throws', () => {
    global.localStorage = {
      getItem: jest.fn(() => { throw new Error('fail'); }),
      setItem: jest.fn(),
    };

    expect(() => require('../embed.js')).not.toThrow();
    expect(fakeModal.hidden).toBe(false);
    expect(console.warn).toHaveBeenCalled();
  });

  test('keeps modal when setItem throws', () => {
    global.localStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => { throw new Error('fail'); }),
    };

    require('../embed.js');
    fakeAccept.cb();

    expect(console.warn).toHaveBeenCalled();
    expect(fakeModal.remove).not.toHaveBeenCalled();
  });
});
