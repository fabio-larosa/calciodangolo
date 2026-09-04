
/* scadenze-2027.js – generato il 04/09/2026, 20:16:18 */
(function () {
  var wrap = document.getElementById('cda-scadenze-wrap');
  if (!wrap) return;

  var LOGO = {"Atalanta":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/atalanta.png","Bologna":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/bologna.png","Cagliari":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/cagliari.png","Como":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/como.png","Empoli":"https://media.calciodangolo.com/main/2026/07/empoli.png","Fiorentina":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/fiorentina.png","Frosinone":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/frosinone.png","Genoa":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/genoa.png","Inter":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/inter.png","Juventus":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/juventus.png","Lazio":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/lazio.png","Lecce":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/lecce.png","Milan":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/milan.png","Monza":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/monza.png","Napoli":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/napoli.png","Parma":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/parma.png","Roma":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/roma.png","Sassuolo":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/sassuolo.png","Torino":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/torino.png","Udinese":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/udinese.png","Venezia":"https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/venezia.png"};
  var ALL  = [{"nome":"F. Dimarco","squadra":"Inter","valore":50,"opzione":true},{"nome":"C. Pulisic","squadra":"Milan","valore":40,"opzione":true},{"nome":"O. Solet","squadra":"Udinese","valore":23,"opzione":true},{"nome":"F. Tomori","squadra":"Milan","valore":17,"opzione":false},{"nome":"H. Çalhanoğlu","squadra":"Inter","valore":16,"opzione":false},{"nome":"Dodô","squadra":"Fiorentina","valore":16,"opzione":false},{"nome":"A. Bernabé","squadra":"Parma","valore":15,"opzione":false},{"nome":"T. Gabriel","squadra":"Lecce","valore":15,"opzione":true},{"nome":"F. Anguissa","squadra":"Napoli","valore":15,"opzione":false},{"nome":"K. Thorstvedt","squadra":"Sassuolo","valore":12,"opzione":false},{"nome":"N. Vlašić","squadra":"Torino","valore":10,"opzione":true},{"nome":"S. Lobotka","squadra":"Napoli","valore":10,"opzione":true},{"nome":"A. Rrahmani","squadra":"Napoli","valore":10,"opzione":true},{"nome":"R. Loftus-Cheek","squadra":"Milan","valore":8.5,"opzione":false},{"nome":"Lo. Pellegrini","squadra":"Roma","valore":8,"opzione":false},{"nome":"K. De Bruyne","squadra":"Napoli","valore":8,"opzione":true},{"nome":"A. Meret","squadra":"Napoli","valore":8,"opzione":false},{"nome":"M. Hermoso","squadra":"Roma","valore":7,"opzione":false},{"nome":"M. Cancellieri","squadra":"Lazio","valore":7,"opzione":false},{"nome":"N. Moro","squadra":"Bologna","valore":7,"opzione":false},{"nome":"E. İlkhan","squadra":"Torino","valore":6,"opzione":false},{"nome":"P. Dybala","squadra":"Roma","valore":5,"opzione":false},{"nome":"C. Adams","squadra":"Torino","valore":5,"opzione":false},{"nome":"A. Ismajli","squadra":"Empoli","valore":5,"opzione":true},{"nome":"M. Pessina","squadra":"Monza","valore":5,"opzione":false},{"nome":"Lu. Pellegrini","squadra":"Lazio","valore":4.5,"opzione":false},{"nome":"S. Kolasinac","squadra":"Atalanta","valore":4,"opzione":false},{"nome":"S. Pierotti","squadra":"Lecce","valore":4,"opzione":true},{"nome":"M. Nzola","squadra":"Cagliari","valore":4,"opzione":true},{"nome":"L. Modrić","squadra":"Milan","valore":3.5,"opzione":false},{"nome":"V. Sierro","squadra":"Parma","valore":3.5,"opzione":false},{"nome":"D. Cataldi","squadra":"Lazio","valore":3.5,"opzione":false},{"nome":"S. Lovrić","squadra":"Udinese","valore":3.5,"opzione":false},{"nome":"A. Gallo","squadra":"Lecce","valore":3.5,"opzione":false},{"nome":"F. Bernardeschi","squadra":"Bologna","valore":3.5,"opzione":true},{"nome":"H. Mkhitaryan","squadra":"Inter","valore":3,"opzione":false},{"nome":"R. Sottil","squadra":"Fiorentina","valore":3,"opzione":false},{"nome":"K. Gaspar","squadra":"Lecce","valore":3,"opzione":true},{"nome":"E. Ebosse","squadra":"Udinese","valore":2.8,"opzione":false},{"nome":"D. Mota","squadra":"Monza","valore":2.8,"opzione":false},{"nome":"T. Correia","squadra":"Venezia","valore":2.5,"opzione":true},{"nome":"K. Pérez","squadra":"Venezia","valore":2.5,"opzione":false},{"nome":"D. Veiga","squadra":"Lecce","valore":2.5,"opzione":true},{"nome":"M. Kaba","squadra":"Lecce","valore":2.5,"opzione":false},{"nome":"M. Felici","squadra":"Cagliari","valore":2.5,"opzione":true},{"nome":"F. Grillitsch","squadra":"Frosinone","valore":2.5,"opzione":true},{"nome":"I. Monterisi","squadra":"Frosinone","valore":2.5,"opzione":false},{"nome":"S. El Shaarawy","squadra":"Roma","valore":2.4,"opzione":true},{"nome":"L. Coulibaly","squadra":"Lecce","valore":2.2,"opzione":true},{"nome":"L. Valenti","squadra":"Parma","valore":2,"opzione":true},{"nome":"K. Ehizibue","squadra":"Udinese","valore":2,"opzione":true},{"nome":"M. Lazzari","squadra":"Lazio","valore":2,"opzione":false},{"nome":"Ł. Skorupski","squadra":"Bologna","valore":2,"opzione":false},{"nome":"P. Almqvist","squadra":"Parma","valore":1.8,"opzione":true},{"nome":"O. El Azzouzi","squadra":"Bologna","valore":1.8,"opzione":false},{"nome":"N. Matić","squadra":"Sassuolo","valore":1.6,"opzione":false},{"nome":"N. Pierini","squadra":"Sassuolo","valore":1.6,"opzione":false},{"nome":"D. Vásquez","squadra":"Roma","valore":1.5,"opzione":false},{"nome":"Patric","squadra":"Lazio","valore":1.5,"opzione":false},{"nome":"O. Zarraga","squadra":"Udinese","valore":1.5,"opzione":false},{"nome":"A. Milik","squadra":"Juventus","valore":1.5,"opzione":false},{"nome":"J. Jesus","squadra":"Napoli","valore":1.5,"opzione":false},{"nome":"Y. Maleh","squadra":"","valore":1.5,"opzione":false},{"nome":"K. N'Dri","squadra":"Lecce","valore":1.5,"opzione":true},{"nome":"G. Jean","squadra":"Lecce","valore":1.5,"opzione":true},{"nome":"V. Antov","squadra":"Monza","valore":1.5,"opzione":true},{"nome":"A. Oyono","squadra":"Frosinone","valore":1.5,"opzione":false},{"nome":"R. Rodríguez","squadra":"Torino","valore":1.4,"opzione":true},{"nome":"R. Gagliardini","squadra":"Cagliari","valore":1.3,"opzione":true},{"nome":"A. Paleari","squadra":"Torino","valore":1.2,"opzione":false},{"nome":"A. Bakoune","squadra":"Monza","valore":1.2,"opzione":true},{"nome":"C. Odenthal","squadra":"Sassuolo","valore":1.2,"opzione":false},{"nome":"J. Messias","squadra":"Genoa","valore":1.1,"opzione":false},{"nome":"P. Terracciano","squadra":"Milan","valore":0.9,"opzione":false},{"nome":"C. Biraghi","squadra":"Torino","valore":0.9,"opzione":false},{"nome":"P. Gollini","squadra":"Roma","valore":0.8,"opzione":false},{"nome":"K. Baldé","squadra":"Monza","valore":0.8,"opzione":false},{"nome":"C. Kabasele","squadra":"Udinese","valore":0.75,"opzione":false},{"nome":"A. Duncan","squadra":"","valore":0.75,"opzione":false},{"nome":"F. Stolz","squadra":"","valore":0.6,"opzione":false},{"nome":"L. De Silvestri","squadra":"Bologna","valore":0.6,"opzione":false},{"nome":"E. Lulli","squadra":"Roma","valore":0.5,"opzione":false},{"nome":"M. Fares","squadra":"Lazio","valore":0.5,"opzione":false},{"nome":"P. Pellegri","squadra":"Torino","valore":0.5,"opzione":false},{"nome":"S. Cinquegrano","squadra":"Sassuolo","valore":0.5,"opzione":false},{"nome":"E. Scott","squadra":"","valore":0.4,"opzione":true},{"nome":"G. Satalino","squadra":"Sassuolo","valore":0.4,"opzione":false},{"nome":"Y. Paz","squadra":"Sassuolo","valore":0.4,"opzione":false},{"nome":"R. Di Gennaro","squadra":"Inter","valore":0.3,"opzione":false},{"nome":"S. El Haddad","squadra":"","valore":0.3,"opzione":false},{"nome":"N. Grandu","squadra":"Cagliari","valore":0.3,"opzione":true},{"nome":"R. Bordon","squadra":"Lazio","valore":0.2,"opzione":false},{"nome":"C. Pinsoglio","squadra":"Juventus","valore":0.2,"opzione":false},{"nome":"D. Renzetti","squadra":"Lazio","valore":0.15,"opzione":false},{"nome":"D. Padelli","squadra":"Udinese","valore":0.15,"opzione":false},{"nome":"M. Vigorito","squadra":"","valore":0.15,"opzione":false},{"nome":"G. De Marzi","squadra":"Roma","valore":0.1,"opzione":false},{"nome":"E. Lolic","squadra":"","valore":0.05,"opzione":false},{"nome":"P. Penev","squadra":"Lecce","valore":0,"opzione":false}];
  var PER  = 20;
  var fil  = ALL.slice().sort(function(a,b){return b.valore-a.valore;});
  var col  = 'valore', dir = -1, page = 0;

  /* CSS */
  var style = document.createElement('style');
  style.textContent = [
    '#cda-sw *{box-sizing:border-box;}',
    '#cda-sw .cda-btn{padding:4px 10px;border:1px solid #1a3a5c;border-radius:4px;background:#fff;color:#1a3a5c;cursor:pointer;font-size:12px;}',
    '#cda-sw .cda-btn.active{background:#1a3a5c;color:#fff;}',
    '#cda-sw .cda-btn:hover{background:#24527a;color:#fff;}',
    '#cda-sw table{width:100%;border-collapse:collapse;font-size:13px;}',
    '#cda-sw th{background:#1a3a5c;color:#fff;padding:9px 10px;cursor:pointer;user-select:none;white-space:nowrap;text-align:left;}',
    '#cda-sw th:hover{background:#24527a;}',
    '#cda-sw th.sd::after{content:" ↓";}',
    '#cda-sw th.sa::after{content:" ↑";}',
    '#cda-sw td{padding:7px 10px;border-bottom:1px solid #e0e0e0;vertical-align:middle;}',
    '#cda-sw tr.opt{background:#FFF3CD !important;}',
    '#cda-sw tbody tr:not(.opt):nth-child(even){background:#f8f8f8;}',
    '#cda-sw img.logo{height:24px;width:24px;object-fit:contain;vertical-align:middle;}',
    '#cda-pag{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center;}',
    '#cda-pag button{padding:4px 9px;border:1px solid #1a3a5c;border-radius:4px;background:#fff;color:#1a3a5c;cursor:pointer;font-size:12px;}',
    '#cda-pag button.active{background:#1a3a5c;color:#fff;}',
    '#cda-pag button:disabled{opacity:.35;cursor:default;}',
    '.bsi{background:#e8a000;color:#fff;border-radius:3px;padding:2px 7px;font-size:11px;font-weight:bold;}',
    '.bno{color:#aaa;font-size:12px;}',
    '@media(max-width:500px){#cda-sw td:nth-child(3),#cda-sw th:nth-child(3){display:none;}}',
  ].join('');
  document.head.appendChild(style);

  /* Struttura */
  wrap.innerHTML =
    '<div id="cda-sw">' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px;">' +
    '<button onclick="cdaF('tutti')" id="btn-tutti" class="cda-btn active">Tutti</button>' +
    '<button onclick="cdaF('si')"    id="btn-si"    class="cda-btn">Con opzione</button>' +
    '<button onclick="cdaF('no')"    id="btn-no"    class="cda-btn">Senza opzione</button>' +
    '<span style="margin-left:auto;font-size:12px;color:#666;"><strong id="cda-n"></strong> giocatori</span>' +
    '</div>' +
    '<div style="overflow-x:auto;">' +
    '<table id="cda-t"><thead><tr>' +
    '<th onclick="cdaS('nome')"    data-c="nome">Giocatore</th>' +
    '<th onclick="cdaS('squadra')" data-c="squadra">Squadra</th>' +
    '<th onclick="cdaS('valore')"  data-c="valore" class="sd">Valore TM</th>' +
    '<th>Opzione</th>' +
    '</tr></thead><tbody id="cda-b"></tbody></table>' +
    '</div>' +
    '<div id="cda-pag"></div>' +
    '<p style="font-size:11px;color:#999;margin-top:8px;">🟡 Riga arancione = opzione di rinnovo &nbsp;|&nbsp; Valori: <strong>Transfermarkt</strong>, settembre 2026</p>' +
    '</div>';

  function fmt(m) {
    if (m === 0) return '—';
    if (m < 1)   return (m * 1000).toLocaleString('it-IT') + ' mila €';
    return m.toLocaleString('it-IT', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' mln €';
  }

  function ltd(s) {
    if (!s) return '<td>—</td>';
    var u = LOGO[s];
    return u ? '<td><img class="logo" src="' + u + '" alt="' + s + '" title="' + s + '"></td>'
             : '<td>' + s + '</td>';
  }

  function render() {
    var tot = fil.length, pages = Math.max(1, Math.ceil(tot / PER));
    page = Math.min(page, pages - 1);
    var html = '';
    fil.slice(page * PER, (page + 1) * PER).forEach(function(p) {
      var cls   = p.opzione ? ' class="opt"' : '';
      var badge = p.opzione ? '<span class="bsi">SÌ</span>' : '<span class="bno">NO</span>';
      html += '<tr' + cls + '><td><strong>' + p.nome + '</strong></td>' +
              ltd(p.squadra) +
              '<td style="text-align:right;white-space:nowrap">' + fmt(p.valore) + '</td>' +
              '<td style="text-align:center">' + badge + '</td></tr>';
    });
    document.getElementById('cda-b').innerHTML = html;
    document.getElementById('cda-n').textContent = tot;

    var pag = document.getElementById('cda-pag');
    if (pages <= 1) { pag.innerHTML = ''; return; }
    var ph = '<button onclick="cdaG(' + (page-1) + ')" ' + (page===0?'disabled':'') + '>&#8592;</button>';
    for (var i = 0; i < pages; i++)
      ph += '<button onclick="cdaG(' + i + ')" class="' + (i===page?'active':'') + '">' + (i+1) + '</button>';
    ph += '<button onclick="cdaG(' + (page+1) + ')" ' + (page>=pages-1?'disabled':'') + '>&#8594;</button>';
    ph += '<span style="font-size:12px;color:#666;margin-left:4px">Pagina ' + (page+1) + ' di ' + pages + '</span>';
    pag.innerHTML = ph;
  }

  window.cdaG = function(p) {
    page = Math.max(0, Math.min(Math.ceil(fil.length/PER)-1, p));
    render();
    wrap.scrollIntoView({behavior:'smooth', block:'start'});
  };

  window.cdaS = function(c) {
    if (col === c) dir *= -1; else { col = c; dir = c==='valore' ? -1 : 1; }
    fil.sort(function(a,b) {
      var va=a[c], vb=b[c];
      if (typeof va==='string') { va=va.toLowerCase(); vb=vb.toLowerCase(); }
      return va<vb ? -dir : va>vb ? dir : 0;
    });
    document.querySelectorAll('#cda-t th[data-c]').forEach(function(th) {
      th.className = th.getAttribute('data-c')===col ? (dir===-1?'sd':'sa') : '';
    });
    page = 0; render();
  };

  window.cdaF = function(m) {
    fil = m==='si' ? ALL.filter(function(p){return p.opzione;})
        : m==='no' ? ALL.filter(function(p){return !p.opzione;})
        : ALL.slice();
    fil.sort(function(a,b) {
      var va=a[col], vb=b[col];
      if (typeof va==='string') { va=va.toLowerCase(); vb=vb.toLowerCase(); }
      return va<vb ? -dir : va>vb ? dir : 0;
    });
    ['tutti','si','no'].forEach(function(k) {
      var btn = document.getElementById('btn-'+k);
      if (btn) btn.className = 'cda-btn' + (k===m?' active':'');
    });
    page = 0; render();
  };

  render();
})();
