(function() {
  var DATA = [
    {nome:'Malen', sq:'ROM', pres:18, mv:'6,72', fmv:'8,97', gol:14, ass:2, best:'Roma-Pisa 3-0 (8,5+9)'},
    {nome:'Martinez L.', sq:'INT', pres:30, mv:'6,42', fmv:'8,25', gol:17, ass:6, best:'Pisa-Inter 0-2 e Inter-Roma 5-2 (7,5+6)'},
    {nome:'Thuram', sq:'INT', pres:29, mv:'6,43', fmv:'7,95', gol:13, ass:6, best:'Inter-Torino 5-0 (7,5+6)'},
    {nome:'Scamacca', sq:'ATA', pres:22, mv:'6,18', fmv:'7,55', gol:10, ass:1, best:'Atalanta-Cagliari 2-1, Atalanta-Udinese 2-2 e Cagliari-Atalanta 3-2 (7,5+6)'},
    {nome:'Hojlund', sq:'NAP', pres:33, mv:'6,21', fmv:'7,44', gol:12, ass:5, best:'Napoli-Juventus 2-1 e Cremonese-Napoli 0-2 (8+6)'}
  ];

  function initFantaSort() {
    var table = document.getElementById('fantaAttaccanti');
    if (!table) return;

    var thead = '<thead><tr>' +
      '<th class="sortable" data-col="0" data-type="text">Calciatore</th>' +
      '<th class="sortable" data-col="1" data-type="text">Sq.</th>' +
      '<th class="sortable" data-col="2" data-type="num">Pres.</th>' +
      '<th class="sortable" data-col="3" data-type="num">MV</th>' +
      '<th class="sortable" data-col="4" data-type="num">FMV</th>' +
      '<th class="sortable" data-col="5" data-type="num">Gol</th>' +
      '<th class="sortable" data-col="6" data-type="num">Assist</th>' +
      '<th class="sortable" data-col="7" data-type="text">Best match</th>' +
      '</tr></thead>';

    var tbodyHTML = '<tbody>';
    for (var i = 0; i < DATA.length; i++) {
      var r = DATA[i];
      tbodyHTML += '<tr>' +
        '<td class="player-name">' + r.nome + '</td>' +
        '<td>' + r.sq + '</td>' +
        '<td>' + r.pres + '</td>' +
        '<td>' + r.mv + '</td>' +
        '<td>' + r.fmv + '</td>' +
        '<td>' + r.gol + '</td>' +
        '<td>' + r.ass + '</td>' +
        '<td class="best-match">' + r.best + '</td>' +
        '</tr>';
    }
    tbodyHTML += '</tbody>';
    table.innerHTML = thead + tbodyHTML;

    var headers = table.querySelectorAll('thead th.sortable');
    var tbody = table.querySelector('tbody');

    headers.forEach(function(header) {
      var icon = document.createElement('span');
      icon.className = 'fanta-sort-icon';
      icon.innerHTML = ' \u21C5';
      icon.style.opacity = '0.55';
      icon.style.fontSize = '11px';
      icon.style.marginLeft = '4px';
      icon.style.pointerEvents = 'none';
      header.appendChild(icon);

      header.addEventListener('click', function() {
        var col = parseInt(this.getAttribute('data-col'), 10);
        var type = this.getAttribute('data-type');
        var currentDir = this.classList.contains('sort-asc') ? 'asc' : (this.classList.contains('sort-desc') ? 'desc' : null);
        var newDir;
        if (type === 'num') {
          newDir = currentDir === 'desc' ? 'asc' : 'desc';
        } else {
          newDir = currentDir === 'asc' ? 'desc' : 'asc';
        }

        headers.forEach(function(h) {
          h.classList.remove('sort-asc', 'sort-desc');
          var ic = h.querySelector('.fanta-sort-icon');
          if (ic) { ic.innerHTML = ' \u21C5'; ic.style.opacity = '0.55'; }
        });
        this.classList.add(newDir === 'asc' ? 'sort-asc' : 'sort-desc');
        var thisIcon = this.querySelector('.fanta-sort-icon');
        if (thisIcon) {
          thisIcon.innerHTML = newDir === 'asc' ? ' \u25B2' : ' \u25BC';
          thisIcon.style.opacity = '1';
        }

        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        rows.sort(function(a, b) {
          var aText = a.children[col].textContent.trim();
          var bText = b.children[col].textContent.trim();
          if (type === 'num') {
            var aNum = parseFloat(aText.replace(',', '.'));
            var bNum = parseFloat(bText.replace(',', '.'));
            return newDir === 'asc' ? aNum - bNum : bNum - aNum;
          } else {
            return newDir === 'asc'
              ? aText.localeCompare(bText, 'it')
              : bText.localeCompare(aText, 'it');
          }
        });
        rows.forEach(function(row) { tbody.appendChild(row); });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFantaSort);
  } else {
    initFantaSort();
  }
})();
