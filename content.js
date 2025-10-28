// content.js - minimal floating save button
(function(){
  if (window.__ch_minimal_injected) return;
  window.__ch_minimal_injected = true;

  const btn = document.createElement('button');
  btn.textContent = 'Save this product?';
  Object.assign(btn.style, {
    position: 'fixed',
    right: '12px',
    top: '12px',
    zIndex: 2147483647,
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #0b5fff',
    background: '#0b5fff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '13px'
  });
  document.documentElement.appendChild(btn);

  btn.addEventListener('click', async () => {
    try {
      const title = window.prompt('Enter product title to save', document.title || '');
      if (!title) return;
      const entry = { title: title.trim(), url: location.href, ts: Date.now() };
      chrome.storage.local.get({ ch_saved: [] }, (res) => {
        const list = res.ch_saved || [];
        list.unshift(entry);
        chrome.storage.local.set({ ch_saved: list.slice(0, 500) }, () => {
          // brief visual feedback
          btn.textContent = 'Saved ✓';
          setTimeout(()=> btn.textContent = 'Save', 1200);
        });
      });
    } catch (e) {
      console.error('save failed', e);
      alert('Save failed: ' + (e && e.message ? e.message : e));
    }
  });
})();
