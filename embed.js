(function(){
  const { LS_KEY } = require('./consent');

  function init(){
    const modal = document.getElementById('cookie-modal');
    if(!modal) return;

    let stored = null;
    let raw = null;
    try {
      raw = localStorage.getItem(LS_KEY);
    } catch (err) {
      console.warn && console.warn('localStorage.getItem failed', err);
    }

    if (raw) {
      try {
        stored = JSON.parse(raw);
      } catch {
        // ignore parse errors
      }
    }

    if(!stored || !stored.timestamp){
      modal.hidden = false;
      if (typeof modal.focus === 'function') {
        modal.focus();
      }
    }

    function save(all){
      const data = { essential: true, analytics: all, external: all, timestamp: new Date().toISOString() };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        modal.remove();
      } catch (err) {
        console.warn && console.warn('localStorage.setItem failed', err);
      }
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
})();

