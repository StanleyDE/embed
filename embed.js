(function(){
  // Support both CommonJS (Node/tests) and browser globals
  let loadConsent, saveConsent;
  if (typeof require === 'function') {
    ({ loadConsent, saveConsent } = require('./consent'));
  } else if (typeof window !== 'undefined') {
    ({ loadConsent, saveConsent } = window);
  }

  function init(){
    const modal = document.getElementById('cookie-modal');
    if(!modal) return;

    const consent = loadConsent();

    if(!consent.timestamp){
      modal.hidden = false;
      if (typeof modal.focus === 'function') {
        modal.focus();
      }
    }

    function save(all){
      saveConsent({ analytics: all, external: all });
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
})();

