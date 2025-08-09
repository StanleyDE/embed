(function(){
  const LS_KEY = 'consent_v1';

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
    }

    function save(all){
      const data = { essential: true, analytics: all, external: all, timestamp: new Date().toISOString() };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
      modal.remove();
    }

    document.getElementById('btn-accept').addEventListener('click', () => save(true));
    document.getElementById('btn-reject').addEventListener('click', () => save(false));
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

