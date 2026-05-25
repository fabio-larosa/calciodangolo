(function() {
  function initFantaSort() {
    var table = document.getElementById('fantaPortieri');
    if (!table) return;
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
          if (ic) {
            ic.innerHTML = ' \u21C5';
            ic.style.opacity = '0.55';
          }
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
