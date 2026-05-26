(function() {
  var DATA = [
    {nome:'Dimarco', sq:'INT', pres:35, mv:'6,60', fmv:'7,64', gol:7, ass:17, best:'Inter-Cremonese 4-1 e Inter-Pisa 6-2 (8+4)'},
    {nome:'Bremer', sq:'JUV', pres:26, mv:'6,33', fmv:'6,81', gol:4, ass:3, best:'Parma-Juventus 1-4 (8+5,5)'},
    {nome:'Bisseck', sq:'INT', pres:23, mv:'6,22', fmv:'6,65', gol:3, ass:2, best:'Cremonese-Inter 0-2 (7,5+3)'},
    {nome:'Pavlovic', sq:'MIL', pres:34, mv:'6,24', fmv:'6,62', gol:5, ass:0, best:'Milan-Roma 1-0 (7,5+3)'},
    {nome:'Dumfries', sq:'INT', pres:19, mv:'6,11', fmv:'6,58', gol:3, ass:1, best:'Como-Inter 3-4 (8+6)'}
  ];

  function initFantaSort() {
    var table = document.getElementById('fantaDifensori');
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
