import { expect, test } from '@jest/globals';
import { JSDOM } from 'jsdom';

const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

test('index page loads consent banner without errors', async () => {
  const dom = await JSDOM.fromFile('index.html', {
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(window) {
      window.localStorage = localStorageMock;
    },
  });

  await new Promise((resolve, reject) => {
    dom.window.addEventListener('error', (e) => reject(e.error || e.message));
    const timeout = setTimeout(() => reject(new Error('timeout')), 5000);
    dom.window.addEventListener('load', () => {
      clearTimeout(timeout);
      resolve();
    });
  });

  const modal = dom.window.document.getElementById('cookie-modal');
  expect(modal.hidden).toBe(false);
  dom.window.close();
});
