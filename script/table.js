// ==UserScript==
// @name         GitHub JSON Table Preview (centered)
// @namespace    https://example.com/
// @match        https://github.com/*/blob/*/*.json
// @run-at       document-end
// @grant        none
// ==/UserScript==

(async () => {
  'use strict';

  /* ---------- JSON 取得 ---------- */
  const rawUrl = location.href
    .replace('://github.com/', '://raw.githubusercontent.com/')
    .replace('/blob/', '/');

  let data;
  try {
    const res  = await fetch(rawUrl);
    data = await res.json();
  } catch (e) {
    console.error(e);
    return;
  }

  /* ---------- データ整形 ---------- */
  if (!Array.isArray(data)) {
    data = Object.entries(data).map(([k, v]) => ({ key: k, value: v }));
  } else if (data.length && typeof data[0] !== 'object') {
    data = data.map(v => ({ value: v }));
  }
  if (!data.length) return;

  /* ---------- テーブル生成 ---------- */
  const keys = Object.keys(data[0]);
  const table = document.createElement('table');
  table.style.cssText =
    'border-collapse:collapse;font-family:sans-serif;font-size:14px;' +
    'margin:32px auto;width:auto;max-width:100%';              // 中央寄せ

  const mk = (tag, txt) => {
    const el = document.createElement(tag);
    el.textContent = txt == null ? '' : txt;
    el.style.cssText = 'border:1px solid #888;padding:4px 8px;text-align:left';
    if (tag === 'th') el.style.background = '#f6f8fa';
    return el;
  };

  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  keys.forEach(k => hr.appendChild(mk('th', k)));
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach((row, i) => {
    const tr = document.createElement('tr');
    if (i % 2) tr.style.background = '#fbfbfb';
    keys.forEach(k => tr.appendChild(mk('td', row[k])));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  /* ---------- ページ末尾へ挿入 ---------- */
  document.body.appendChild(table);
})();
