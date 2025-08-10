import { LS_KEY } from './consent.js';

function init(){
  const modal = document.getElementById('cookie-modal');
  if(!modal) return;

  let stored = null;
  try {
    stored = JSON.parse(localStorage.getItem(LS_KEY));
  } catch {
    // ignore parse errors
  }

  if(!stored || !stored.timestamp){
    modal.hidden = false;
    if (typeof modal.focus === 'function') {
      modal.focus();
    }
  }

  function save(all){
    const data = { essential: true, analytics: all, external: all, timestamp: new Date().toISOString() };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    modal.remove();
  }

  const accept = document.getElementById('btn-accept');
  const reject = document.getElementById('btn-reject');

  if (accept) {
    accept.addEventListener('click', () => save(true));
  }

  if (reject) {
    reject.addEventListener('click', () => save(false));
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


