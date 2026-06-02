(function() {
  var API_URL = 'https://script.google.com/macros/s/AKfycbzosKJNdJWNkO1LyyZLbj1Z5JHvW5FkTl0axkGF9kUHUXV2G-NZf7nzXxSesRsE5PZV7Q/exec';
  var LOGO_BASE = 'https://cdn.jsdelivr.net/gh/fabio-larosa/calciodangolo@main/';

  function slugify(name) {
    return name.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[àáâ]/g, 'a')
      .replace(/[èé]/g, 'e')
      .replace(/[ìí]/g, 'i')
      .replace(/[òó]/g, 'o')
      .replace(/[ùú]/g, 'u');
  }

  function formatTransferList(text, type) {
    if (!text || !text.trim()) {
      return '<p class="tcm-empty">Nessun' + (type === 'acquisti' ? ' acquisto' : 'a cessione') + ' al momento</p>';
    }
    var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
    var symbol = type === 'acquisti' ? '+' : '\u2212';
    var symbolColor = type === 'acquisti' ? '#27a844' : '#dc3545';
    var html = '<ul class="tcm-list tcm-list-' + type + '">';
    for (var i = 0; i < lines.length; i++) {
      html += '<li><span class="tcm-sign" style="color:' + symbolColor + ';font-weight:700;">' + symbol + '</span> ' + escapeHtml(lines[i]) + '</li>';
    }
    html += '</ul>';
    return html;
  }

  function formatReparto(text) {
    var players = text.split(',').map(function(p) { return p.trim(); }).filter(function(p) { return p.length > 0; });
    var html = '';
    for (var i = 0; i < players.length; i++) {
      var name = players[i];
      var isNew = false;
      if (name.charAt(0) === '*') {
        isNew = true;
        name = name.substring(1).trim();
      }
      if (i > 0) html += ', ';
      if (isNew) {
        html += '<span class="tcm-new">' + escapeHtml(name) + '</span>';
      } else {
        html += escapeHtml(name);
      }
    }
    return html;
  }

  function formatFormation(text) {
    if (!text || !text.trim()) {
      return '<p class="tcm-empty">Formazione non ancora definita</p>';
    }
    var lines = text.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
    if (lines.length === 0) {
      return '<p class="tcm-empty">Formazione non ancora definita</p>';
    }
    var modulo = lines[0];
    var reparti = lines.slice(1);
    var html = '<div class="tcm-formation">';
    html += '<div class="tcm-modulo">' + escapeHtml(modulo) + '</div>';
    for (var i = 0; i < reparti.length; i++) {
      html += '<div class="tcm-reparto">' + formatReparto(reparti[i]) + '</div>';
    }
    html += '</div>';
    return html;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderTabellone(data) {
    var container = document.getElementById('tabelloneCalciomercato');
    if (!container) return;

    var menuHTML = '<div class="tcm-menu"><div class="tcm-menu-label">Salta alla squadra:</div><div class="tcm-menu-grid">';
    for (var i = 0; i < data.length; i++) {
      var slug = slugify(data[i].squadra);
      menuHTML += '<a href="#tcm-' + slug + '" class="tcm-menu-item">';
      menuHTML += '<img src="' + LOGO_BASE + slug + '.png" alt="' + escapeHtml(data[i].squadra) + '" loading="lazy">';
      menuHTML += '<span>' + escapeHtml(data[i].squadra) + '</span>';
      menuHTML += '</a>';
    }
    menuHTML += '</div></div>';

    var teamsHTML = '<div class="tcm-teams">';
    for (var j = 0; j < data.length; j++) {
      var t = data[j];
      var sl = slugify(t.squadra);
      teamsHTML += '<section class="tcm-team" id="tcm-' + sl + '">';
      teamsHTML += '<header class="tcm-team-header">';
      teamsHTML += '<img src="' + LOGO_BASE + sl + '.png" alt="' + escapeHtml(t.squadra) + '" class="tcm-team-logo" loading="lazy">';
      teamsHTML += '<h3 class="tcm-team-name">' + escapeHtml(t.squadra) + '</h3>';
      teamsHTML += '</header>';
      teamsHTML += '<div class="tcm-team-body">';
      teamsHTML += '<div class="tcm-col tcm-col-acquisti"><h4>Acquisti</h4>' + formatTransferList(t.acquisti, 'acquisti') + '</div>';
      teamsHTML += '<div class="tcm-col tcm-col-cessioni"><h4>Cessioni</h4>' + formatTransferList(t.cessioni, 'cessioni') + '</div>';
      teamsHTML += '<div class="tcm-col tcm-col-formazione"><h4>Oggi giocherebbe così</h4>' + formatFormation(t.formazione) + '</div>';
      teamsHTML += '</div>';
      teamsHTML += '</section>';
    }
    teamsHTML += '</div>';

    container.innerHTML = menuHTML + teamsHTML;
  }

  function loadData() {
    var container = document.getElementById('tabelloneCalciomercato');
    if (!container) return;
    container.innerHTML = '<div class="tcm-loading">Caricamento tabellone in corso...</div>';
    
    fetch(API_URL)
      .then(function(r) { return r.json(); })
      .then(function(data) { renderTabellone(data); })
      .catch(function(err) {
        container.innerHTML = '<div class="tcm-error">Errore nel caricamento del tabellone. Ricarica la pagina tra qualche istante.</div>';
        console.error('Tabellone error:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }
})();
