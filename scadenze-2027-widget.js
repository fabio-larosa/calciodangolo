/* scadenze-2027-widget.js – calciodangolo.com */
(function () {
  var wrap = document.getElementById('cda-scadenze-wrap');
  if (!wrap) return;

  // Aspetta che il file dati sia caricato (max 3 secondi)
  var attempts = 0;
  function init() {
    if (!window.CDA_SCADENZE) {
      attempts++;
      if (attempts < 30) { setTimeout(init, 100); }
      return;
    }
    build(window.CDA_SCADENZE.logo, window.CDA_SCADENZE.players);
  }

  function build(LOGO, ALL) {
    var PER  = 20;
    var fil  = ALL.slice().sort(function (a, b) { return b.valore - a.valore; });
    var col  = 'valore';
    var dir  = -1;
    var page = 0;

    /* CSS */
    var s = document.createElement('style');
    s.textContent =
      '#cda-sw{font-family:Arial,sans-serif;font-size:13px;}' +
      '#cda-sw *{box-sizing:border-box;}' +
      '#cda-sw table{width:100%;border-collapse:collapse;}' +
      '#cda-sw .btn{padding:4px 10px;border:1px solid #1a3a5c;border-radius:4px;' +
        'background:#fff;color:#1a3a5c;cursor:pointer;font-size:12px;}' +
      '#cda-sw .btn.on{background:#1a3a5c;color:#fff;}' +
      '#cda-sw .btn:hover{background:#24527a;color:#fff;}' +
      '#cda-sw .ctrl{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px;}' +
      '#cda-sw th{background:#1a3a5c;color:#fff;padding:9px 10px;cursor:pointer;' +
        'user-select:none;white-space:nowrap;text-align:left;}' +
      '#cda-sw th:hover{background:#24527a;}' +
      '#cda-sw th.sd:after{content:" \u2193";}' +
      '#cda-sw th.sa:after{content:" \u2191";}' +
      '#cda-sw td{padding:7px 10px;border-bottom:1px solid #e0e0e0;vertical-align:middle;}' +
      '#cda-sw tr.opt{background:#FFF3CD!important;}' +
      '#cda-sw tbody tr:not(.opt):nth-child(even){background:#f8f8f8;}' +
      '#cda-sw img.lg{height:24px;width:24px;object-fit:contain;vertical-align:middle;}' +
      '#cda-pg{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center;}' +
      '#cda-pg button{padding:4px 9px;border:1px solid #1a3a5c;border-radius:4px;' +
        'background:#fff;color:#1a3a5c;cursor:pointer;font-size:12px;}' +
      '#cda-pg button.on{background:#1a3a5c;color:#fff;}' +
      '#cda-pg button:disabled{opacity:.35;cursor:default;}' +
      '.bsi{background:#e8a000;color:#fff;border-radius:3px;padding:2px 7px;' +
        'font-size:11px;font-weight:bold;}' +
      '.bno{color:#aaa;font-size:12px;}' +
      '@media(max-width:500px){' +
        '#cda-sw td:nth-child(3),#cda-sw th:nth-child(3){display:none;}' +
      '}';
    document.head.appendChild(s);

    /* Struttura base */
    wrap.innerHTML =
      '<div id="cda-sw">' +
        '<div class="ctrl">' +
          '<button class="btn on" data-m="tutti">Tutti</button>' +
          '<button class="btn" data-m="si">Con opzione</button>' +
          '<button class="btn" data-m="no">Senza opzione</button>' +
          '<span style="margin-left:auto;font-size:12px;color:#666;">' +
            '<strong id="cda-n"></strong> giocatori' +
          '</span>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
          '<table id="cda-t">' +
            '<thead><tr>' +
              '<th data-c="nome">Giocatore</th>' +
              '<th data-c="squadra">Squadra</th>' +
              '<th data-c="valore" class="sd">Valore TM</th>' +
              '<th>Opzione</th>' +
            '</tr></thead>' +
            '<tbody id="cda-b"></tbody>' +
          '</table>' +
        '</div>' +
        '<div id="cda-pg"></div>' +
        '<p style="font-size:11px;color:#999;margin-top:8px;">' +
          '\uD83D\uDFE1 Riga arancione = opzione di rinnovo | ' +
          'Valori: <strong>Transfermarkt</strong>, settembre 2026' +
        '</p>' +
      '</div>';

    /* Event listeners filtro */
    wrap.querySelectorAll('[data-m]').forEach(function (btn) {
      btn.addEventListener('click', function () { cdaF(this.getAttribute('data-m')); });
    });

    /* Event listeners sort */
    wrap.querySelectorAll('th[data-c]').forEach(function (th) {
      th.addEventListener('click', function () { cdaS(this.getAttribute('data-c')); });
    });

    /* Helpers */
    function fmt(m) {
      if (m === 0) return '\u2014';
      if (m < 1)   return (m * 1000).toLocaleString('it-IT') + ' mila \u20AC';
      return m.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' mln \u20AC';
    }

    function ltd(sq) {
      if (!sq) return '<td>\u2014</td>';
      var u = LOGO[sq];
      if (!u) return '<td>' + sq + '</td>';
      return '<td><img class="lg" src="' + u + '" alt="' + sq + '" title="' + sq + '"></td>';
    }

    function doSort() {
      fil.sort(function (a, b) {
        var va = a[col], vb = b[col];
        if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
        return va < vb ? -dir : va > vb ? dir : 0;
      });
    }

    function render() {
      var tot   = fil.length;
      var pages = Math.max(1, Math.ceil(tot / PER));
      page = Math.min(page, pages - 1);

      var h = '';
      fil.slice(page * PER, (page + 1) * PER).forEach(function (p) {
        var cls   = p.opzione ? ' class="opt"' : '';
        var badge = p.opzione
          ? '<span class="bsi">S\u00CC</span>'
          : '<span class="bno">NO</span>';
        h +=
          '<tr' + cls + '>' +
            '<td><strong>' + p.nome + '</strong></td>' +
            ltd(p.squadra) +
            '<td style="text-align:right;white-space:nowrap">' + fmt(p.valore) + '</td>' +
            '<td style="text-align:center">' + badge + '</td>' +
          '</tr>';
      });
      document.getElementById('cda-b').innerHTML = h;
      document.getElementById('cda-n').textContent = tot;

      var pag = document.getElementById('cda-pg');
      if (pages <= 1) { pag.innerHTML = ''; return; }

      var ph = '';
      ph += '<button' + (page === 0 ? ' disabled' : '') + ' data-p="' + (page - 1) + '">\u2190</button>';
      for (var i = 0; i < pages; i++) {
        ph += '<button class="' + (i === page ? 'on' : '') + '" data-p="' + i + '">' + (i + 1) + '</button>';
      }
      ph += '<button' + (page >= pages - 1 ? ' disabled' : '') + ' data-p="' + (page + 1) + '">\u2192</button>';
      ph += '<span style="font-size:12px;color:#666;margin-left:4px">Pagina ' + (page + 1) + ' di ' + pages + '</span>';
      pag.innerHTML = ph;

      pag.querySelectorAll('button[data-p]:not([disabled])').forEach(function (btn) {
        btn.addEventListener('click', function () {
          page = parseInt(this.getAttribute('data-p'), 10);
          render();
          wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    function cdaS(c) {
      if (col === c) { dir *= -1; } else { col = c; dir = c === 'valore' ? -1 : 1; }
      doSort();
      wrap.querySelectorAll('#cda-t th[data-c]').forEach(function (th) {
        th.className = th.getAttribute('data-c') === col ? (dir === -1 ? 'sd' : 'sa') : '';
      });
      page = 0;
      render();
    }

    function cdaF(m) {
      fil = m === 'si' ? ALL.filter(function (p) { return  p.opzione; })
          : m === 'no' ? ALL.filter(function (p) { return !p.opzione; })
          : ALL.slice();
      doSort();
      wrap.querySelectorAll('[data-m]').forEach(function (btn) {
        btn.className = 'btn' + (btn.getAttribute('data-m') === m ? ' on' : '');
      });
      page = 0;
      render();
    }

    render();
  }

  init();
})();
