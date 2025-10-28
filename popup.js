// popup.js - minimal list + open + delete
document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('list');
  const emptyEl = document.getElementById('empty');

  function render(items) {
    listEl.innerHTML = '';
    if (!items || items.length === 0) {
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';
    items.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'item';

      const meta = document.createElement('div');
      meta.className = 'meta';
      const a = document.createElement('a');
      a.href = it.url;
      a.textContent = it.title || it.url;
      a.target = '_blank';
      meta.appendChild(a);
      const info = document.createElement('div');
      info.style.color = '#666';
      info.style.fontSize = '12px';
      info.textContent = new Date(it.ts).toLocaleString();
      meta.appendChild(info);

      const btns = document.createElement('div');
      const openBtn = document.createElement('button');
      openBtn.textContent = 'Open';
      openBtn.addEventListener('click', () => chrome.tabs.create({ url: it.url }));

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.style.marginLeft = '6px';
      delBtn.addEventListener('click', () => {
        if (!confirm('Delete this saved item?')) return;
        chrome.storage.local.get({ ch_saved: [] }, (res) => {
          const arr = (res.ch_saved||[]).filter((x,i)=> i !== idx);
          chrome.storage.local.set({ ch_saved: arr }, () => render(arr));
        });
      });

      btns.appendChild(openBtn);
      btns.appendChild(delBtn);
      row.appendChild(meta);
      row.appendChild(btns);
      listEl.appendChild(row);
    });
  }

  chrome.storage.local.get({ ch_saved: [] }, (res) => render(res.ch_saved || []));
});
