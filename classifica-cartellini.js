/**
 * Classifica Cartellini — Serie A — calciodangolo.com
 * Due widget indipendenti sulla stessa pagina:
 *   #cdaCartelliniSquadreWidget   -> tabella squadre
 *   #cdaCartelliniGiocatoriWidget -> tabella giocatori
 *
 * Entrambi leggono data-proxy e data-league dal proprio div.
 * Stagione corrente auto-rilevata via /leagues/{league}?include=currentSeason
 *
 * Type IDs SportMonks:
 *   84 = ammonizioni (gialli)
 *   85 = espulsioni per doppia ammonizione (secondo giallo)
 *   83 = espulsioni dirette (rosso diretto)
 */
(function () {
  'use strict';

  var POSITION_MAP = { 24: 'P', 25: 'D', 26: 'C', 27: 'A' };

  // Mapping nomi brevi italiani — estendere se compaiono nomi non mappati
  var TEAM_MAP = {
    'AC Milan': 'Milan',
    'ACF Fiorentina': 'Fiorentina',
    'AS Roma': 'Roma',
    'Atalanta BC': 'Atalanta',
    'Bologna FC 1909': 'Bologna',
    'Cagliari Calcio': 'Cagliari',
    'Como 1907': 'Como',
    'Frosinone Calcio': 'Frosinone',
    'Genoa CFC': 'Genoa',
    'FC Internazionale Milano': 'Inter',
    'Inter Milan': 'Inter',
    'Juventus FC': 'Juventus',
    'SS Lazio': 'Lazio',
    'US Lecce': 'Lecce',
    'AC Monza': 'Monza',
    'SSC Napoli': 'Napoli',
    'Parma Calcio 1913': 'Parma',
    'US Sassuolo': 'Sassuolo',
    'Torino FC': 'Torino',
    'Udinese Calcio': 'Udinese',
    'Venezia FC': 'Venezia'
  };

  function shortTeamName(name) {
    return TEAM_MAP[name] || name;
  }

  function svgIcon(type) {
    // type: 'yellow' | 'yellowred' | 'red'
    var w = 14, h = 18, r = 2;
    if (type === 'yellow') {
      return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0.5" y="0.5" width="13" height="17" rx="' + r + '" fill="#f5c518" stroke="#00000022"/></svg>';
    }
    if (type === 'red') {
      return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0.5" y="0.5" width="13" height="17" rx="' + r + '" fill="#e2231a" stroke="#00000022"/></svg>';
    }
    // yellowred: diagonale, metà giallo (in alto-sx) metà rosso (in basso-dx)
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg">' +
      '<clipPath id="cdaClip"><rect x="0.5" y="0.5" width="13" height="17" rx="' + r + '"/></clipPath>' +
      '<g clip-path="url(#cdaClip)">' +
      '<rect x="0" y="0" width="14" height="18" fill="#f5c518"/>' +
      '<polygon points="14,0 14,18 0,18" fill="#e2231a"/>' +
      '</g>' +
      '<rect x="0.5" y="0.5" width="13" height="17" rx="' + r + '" fill="none" stroke="#00000022"/>' +
      '</svg>';
  }

  function fetchJSON(proxy, path) {
    return fetch(proxy + path).then(function (res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status + ' su ' + path); }
      return res.json();
    });
  }

  function getCurrentSeason(proxy, league) {
    return fetchJSON(proxy, '/leagues/' + league + '?include=currentSeason')
      .then(function (json) {
        return json.data.currentseason.id;
      });
  }

  function statTotal(statistics, typeId) {
    if (!statistics) { return 0; }
    for (var i = 0; i < statistics.length; i++) {
      if (statistics[i].type_id === typeId) {
        var v = statistics[i].value;
        if (typeof v === 'number') { return v; }
        if (v && typeof v.total === 'number') { return v.total; }
        // Cartellini (83/84/85): il conteggio è in value.count, non value.total
        // (l'oggetto porta anche il worst-offender: player_id/player_name/coach)
        if (v && typeof v.count === 'number') { return v.count; }
      }
    }
    return 0;
  }

  function computeRow(giallo, doppiaAmm, rosso) {
    var espulsioniTotali = doppiaAmm + rosso;
    return {
      giallo: giallo,
      doppiaAmm: doppiaAmm,
      rosso: rosso,
      espulsioniTotali: espulsioniTotali,
      totale: giallo + espulsioniTotali
    };
  }

  function defaultCompare(nameKeyA, nameKeyB, a, b) {
    if (b.totale !== a.totale) { return b.totale - a.totale; }
    if (b.espulsioniTotali !== a.espulsioniTotali) { return b.espulsioniTotali - a.espulsioniTotali; }
    return nameKeyA.localeCompare(nameKeyB, 'it');
  }

  // ---------------------------------------------------------------------
  // TABELLA SQUADRE
  // ---------------------------------------------------------------------

  function loadSquadre(container) {
    var proxy = container.getAttribute('data-proxy');
    var league = container.getAttribute('data-league');

    container.innerHTML = '<div class="cdaCartelliniLoading">Caricamento classifica cartellini squadre…</div>';

    getCurrentSeason(proxy, league).then(function (seasonId) {
      var path = '/teams/seasons/' + seasonId +
        '?include=statistics.details' +
        '&filters=teamStatisticSeasons:' + seasonId + ';teamStatisticDetailTypes:83,84,85';
      return fetchJSON(proxy, path).then(function (json) {
        var rows = (json.data || []).map(function (team) {
          var details = [];
          (team.statistics || []).forEach(function (stat) {
            if (stat.details) { details = details.concat(stat.details); }
          });
          var giallo = statTotal(details, 84);
          var doppiaAmm = statTotal(details, 85);
          var rosso = statTotal(details, 83);
          var row = computeRow(giallo, doppiaAmm, rosso);
          row.teamId = team.id;
          row.teamName = shortTeamName(team.name);
          row.teamLogo = team.image_path || '';
          return row;
        });
        renderSquadreTable(container, rows);
      });
    }).catch(function (err) {
      container.innerHTML = '<div class="cdaCartelliniError">Errore nel caricamento dati: ' + err.message + '</div>';
    });
  }

  function renderSquadreTable(container, rows) {
    var state = { sortKey: 'totale', sortDir: -1, rows: rows };

    var columns = [
      { key: 'teamName', label: 'Squadra', sortable: true, cell: function (r) {
          return '<span class="cdaTeamCell">' +
            (r.teamLogo ? '<img class="cdaTeamLogo" src="' + r.teamLogo + '" alt="' + r.teamName + '">' : '') +
            r.teamName + '</span>';
        } },
      { key: 'giallo', label: svgIcon('yellow'), title: 'Ammonizioni', sortable: true, cell: function (r) { return r.giallo; } },
      { key: 'doppiaAmm', label: svgIcon('yellowred'), title: 'Espulsioni per doppia ammonizione', sortable: true, cell: function (r) { return r.doppiaAmm; } },
      { key: 'rosso', label: svgIcon('red'), title: 'Espulsioni dirette', sortable: true, cell: function (r) { return r.rosso; } },
      { key: 'totale', label: 'Totale', sortable: true, cell: function (r) { return '<strong>' + r.totale + '</strong>'; } }
    ];

    // Ordinamento di default: totale desc, poi espulsioni desc, poi alfabetico
    state.rows.sort(function (a, b) { return defaultCompare(a.teamName, b.teamName, a, b); });

    function draw() {
      var html = '<div class="cdaCartelliniWrap"><table class="cdaCartelliniTable cdaCartelliniSquadreTable"><thead><tr>';
      columns.forEach(function (col) {
        html += '<th data-key="' + col.key + '"' + (col.title ? ' title="' + col.title + '"' : '') +
          (col.sortable ? ' class="cdaSortable"' : '') + '>' + col.label +
          (col.key === state.sortKey ? (state.sortDir === 1 ? ' ▲' : ' ▼') : '') + '</th>';
      });
      html += '</tr></thead><tbody>';
      state.rows.forEach(function (r) {
        html += '<tr>';
        columns.forEach(function (col) { html += '<td>' + col.cell(r) + '</td>'; });
        html += '</tr>';
      });
      html += '</tbody></table></div>';
      container.innerHTML = html;

      container.querySelectorAll('th.cdaSortable').forEach(function (th) {
        th.addEventListener('click', function () {
          var key = th.getAttribute('data-key');
          if (state.sortKey === key) {
            state.sortDir *= -1;
          } else {
            state.sortKey = key;
            state.sortDir = -1;
          }
          if (key === 'teamName') {
            state.rows.sort(function (a, b) { return state.sortDir * a.teamName.localeCompare(b.teamName, 'it'); });
          } else if (key === 'totale') {
            state.rows.sort(function (a, b) { return state.sortDir * -1 * defaultCompare(a.teamName, b.teamName, a, b); });
          } else {
            state.rows.sort(function (a, b) {
              if (a[key] !== b[key]) { return state.sortDir * -1 * (a[key] - b[key]); }
              return defaultCompare(a.teamName, b.teamName, a, b);
            });
          }
          draw();
        });
      });
    }

    draw();
  }

  // ---------------------------------------------------------------------
  // TABELLA GIOCATORI
  // ---------------------------------------------------------------------

  function loadGiocatori(container) {
    var proxy = container.getAttribute('data-proxy');
    var league = container.getAttribute('data-league');

    container.innerHTML = '<div class="cdaCartelliniLoading">Caricamento classifica cartellini giocatori…</div>';

    var seasonId;

    getCurrentSeason(proxy, league)
      .then(function (sId) {
        seasonId = sId;
        var path = '/teams/seasons/' + seasonId;
        return fetchJSON(proxy, path);
      })
      .then(function (teamsJson) {
        var teams = teamsJson.data || [];
        var requests = teams.map(function (team) {
          var path = '/squads/seasons/' + seasonId + '/teams/' + team.id +
            '?include=player.statistics.details' +
            '&filters=playerStatisticSeasons:' + seasonId + ';playerStatisticDetailTypes:83,84,85';
          return fetchJSON(proxy, path)
            .then(function (json) { return { team: team, squad: json.data || [] }; })
            .catch(function () { return { team: team, squad: [] }; }); // una squadra che fallisce non blocca le altre
        });
        return Promise.all(requests);
      })
      .then(function (results) {
        var rows = [];
        results.forEach(function (res) {
          var teamShort = shortTeamName(res.team.name);
          var teamLogo = res.team.image_path || '';
          res.squad.forEach(function (entry) {
            var player = entry.player;
            if (!player || !player.statistics || !player.statistics.length) { return; }
            var details = [];
            player.statistics.forEach(function (stat) {
              if (stat.details) { details = details.concat(stat.details); }
            });
            var giallo = statTotal(details, 84);
            var doppiaAmm = statTotal(details, 85);
            var rosso = statTotal(details, 83);
            if (giallo === 0 && doppiaAmm === 0 && rosso === 0) { return; } // scarta chi non ha cartellini

            var row = computeRow(giallo, doppiaAmm, rosso);
            row.playerId = player.id;
            row.name = player.name;
            row.role = POSITION_MAP[player.position_id] || '-';
            row.teamName = teamShort;
            row.teamLogo = teamLogo;
            rows.push(row);
          });
        });
        renderGiocatoriTable(container, rows);
      })
      .catch(function (err) {
        container.innerHTML = '<div class="cdaCartelliniError">Errore nel caricamento dati: ' + err.message + '</div>';
      });
  }

  function cognome(fullName) {
    var parts = fullName.trim().split(' ');
    return parts[parts.length - 1];
  }

  function renderGiocatoriTable(container, rows) {
    var state = { sortKey: 'totale', sortDir: -1, rows: rows, roleFilter: '', teamFilter: '' };

    var teams = Array.from(new Set(rows.map(function (r) { return r.teamName; }))).sort(function (a, b) { return a.localeCompare(b, 'it'); });

    var columns = [
      { key: 'name', label: 'Calciatore', sortable: true, cell: function (r) { return r.name; } },
      { key: 'role', label: 'R', sortable: true, cell: function (r) { return r.role; } },
      { key: 'teamName', label: 'Sq.', sortable: false, cell: function (r) {
          return r.teamLogo ? '<img class="cdaTeamLogo" src="' + r.teamLogo + '" alt="' + r.teamName + '">' : r.teamName;
        } },
      { key: 'giallo', label: svgIcon('yellow'), title: 'Ammonizioni', sortable: true, cell: function (r) { return r.giallo; } },
      { key: 'doppiaAmm', label: svgIcon('yellowred'), title: 'Espulsioni per doppia ammonizione', sortable: true, cell: function (r) { return r.doppiaAmm; } },
      { key: 'rosso', label: svgIcon('red'), title: 'Espulsioni dirette', sortable: true, cell: function (r) { return r.rosso; } },
      { key: 'totale', label: 'Totale', sortable: true, cell: function (r) { return '<strong>' + r.totale + '</strong>'; } }
    ];

    function applyFiltersAndSort() {
      var filtered = state.rows.filter(function (r) {
        if (state.roleFilter && r.role !== state.roleFilter) { return false; }
        if (state.teamFilter && r.teamName !== state.teamFilter) { return false; }
        return true;
      });

      var key = state.sortKey, dir = state.sortDir;
      filtered.sort(function (a, b) {
        var ca = cognome(a.name), cb = cognome(b.name);
        if (key === 'totale') { return dir * -1 * defaultCompare(ca, cb, a, b); }
        if (key === 'name') { return dir * ca.localeCompare(cb, 'it'); }
        if (key === 'role') { return dir * a.role.localeCompare(b.role, 'it'); }
        if (a[key] !== b[key]) { return dir * -1 * (a[key] - b[key]); }
        return defaultCompare(ca, cb, a, b);
      });
      return filtered;
    }

    // ordinamento default iniziale
    state.rows.sort(function (a, b) { return defaultCompare(cognome(a.name), cognome(b.name), a, b); });

    function draw() {
      var visible = applyFiltersAndSort();

      var html = '<div class="cdaCartelliniFilters">' +
        '<select class="cdaFilterRole"><option value="">Ruolo</option>' +
        ['P', 'D', 'C', 'A'].map(function (p) { return '<option value="' + p + '"' + (state.roleFilter === p ? ' selected' : '') + '>' + p + '</option>'; }).join('') +
        '</select>' +
        '<select class="cdaFilterTeam"><option value="">Squadra</option>' +
        teams.map(function (t) { return '<option value="' + t + '"' + (state.teamFilter === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') +
        '</select></div>';

      html += '<div class="cdaCartelliniWrap"><table class="cdaCartelliniTable cdaCartelliniGiocatoriTable"><thead><tr>';
      columns.forEach(function (col) {
        html += '<th data-key="' + col.key + '"' + (col.title ? ' title="' + col.title + '"' : '') +
          (col.sortable ? ' class="cdaSortable"' : '') + '>' + col.label +
          (col.sortable && col.key === state.sortKey ? (state.sortDir === 1 ? ' ▲' : ' ▼') : '') + '</th>';
      });
      html += '</tr></thead><tbody>';
      visible.forEach(function (r) {
        html += '<tr>';
        columns.forEach(function (col) { html += '<td>' + col.cell(r) + '</td>'; });
        html += '</tr>';
      });
      html += '</tbody></table></div>';

      container.innerHTML = html;

      container.querySelector('.cdaFilterRole').addEventListener('change', function (e) {
        state.roleFilter = e.target.value;
        draw();
      });
      container.querySelector('.cdaFilterTeam').addEventListener('change', function (e) {
        state.teamFilter = e.target.value;
        draw();
      });

      container.querySelectorAll('th.cdaSortable').forEach(function (th) {
        th.addEventListener('click', function () {
          var key = th.getAttribute('data-key');
          if (state.sortKey === key) {
            state.sortDir *= -1;
          } else {
            state.sortKey = key;
            state.sortDir = key === 'name' || key === 'role' ? 1 : -1;
          }
          draw();
        });
      });
    }

    draw();
  }

  // ---------------------------------------------------------------------
  // INIT
  // ---------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    var squadreEl = document.getElementById('cdaCartelliniSquadreWidget');
    var giocatoriEl = document.getElementById('cdaCartelliniGiocatoriWidget');
    if (squadreEl) { loadSquadre(squadreEl); }
    if (giocatoriEl) { loadGiocatori(giocatoriEl); }
  });
})();
