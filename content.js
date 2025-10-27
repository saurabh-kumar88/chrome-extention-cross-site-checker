(function() {
  if (window.__compare_helper_injected) return;
  window.__compare_helper_injected = true;

  const panel = document.createElement('div');
  panel.id = 'ch-compare-panel';
  Object.assign(panel.style, {
    position: 'fixed',
    right: '16px',
    top: '100px',
    width: '300px',
    background: 'white',
    border: '1px solid rgba(0,0,0,0.15)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
    zIndex: 2147483647,
    padding: '10px',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px'
  });

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <strong>Save product</strong>
      <button id="ch-close" title="Close" style="border:none;background:transparent;cursor:pointer;font-size:14px;">✕</button>
    </div>
    <label>Title</label>
    <input id="ch-title" style="width:100%;padding:6px;margin-bottom:8px;border:1px solid #ddd;border-radius:4px;" />
    <label>Target price (optional)</label>
    <input id="ch-price" placeholder="e.g. 2999" style="width:100%;padding:6px;margin-bottom:8px;border:1px solid #ddd;border-radius:4px;" />
    <label>Notes</label>
    <textarea id="ch-notes" rows="3" style="width:100%;padding:6px;margin-bottom:8px;border:1px solid #ddd;border-radius:4px;"></textarea>
    <button id="ch-save" style="padding:7px 10px;border-radius:6px;border:1px solid #0b5fff;background:#0b5fff;color:white;cursor:pointer;">Save</button>
  `;

  document.body.appendChild(panel);

  document.getElementById('ch-close').addEventListener('click', () => panel.remove());

  document.getElementById('ch-save').addEventListener('click', async () => {
    const title = document.getElementById('ch-title').value.trim();
    const price = document.getElementById('ch-price').value.trim();
    const notes = document.getElementById('ch-notes').value.trim();

    if (!title) {
      alert('Please enter a product title');
      return;
    }

    const entry = { title, price, notes, url: location.href, ts: Date.now() };
    const prev = (await chrome.storage.local.get({ ch_saved: [] })).ch_saved;
    prev.unshift(entry);
    await chrome.storage.local.set({ ch_saved: prev.slice(0, 200) });

    alert('Product saved!');
  });
})();