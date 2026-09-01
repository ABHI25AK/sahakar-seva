// ===========================================================
// SahakarSeva — shared interactivity
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Screen 2: time slot tabs ---------- */
  document.querySelectorAll('.time-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.time-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* ---------- Screen 2: hourly rate slider ---------- */
  const slider = document.getElementById('rateSlider');
  const rateVal = document.getElementById('rateVal');
  if (slider && rateVal) {
    slider.addEventListener('input', () => {
      rateVal.textContent = `₹${slider.value}/hr`;
    });
  }

  /* ---------- Screen 2: rating radio highlight ---------- */
  document.querySelectorAll('.radio-row input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.radio-row').forEach(row => row.classList.remove('checked'));
      radio.closest('.radio-row').classList.add('checked');
    });
  });

  /* ---------- Screen 2: Category filter & URL param parsing ---------- */
  const categorySelect = document.getElementById('categorySelect');
  const workerCards = document.querySelectorAll('.worker-card');
  const pageTitle = document.getElementById('pageTitle');
  const pageBreadcrumb = document.getElementById('pageBreadcrumb');

  function filterByCategory(selectedCategory) {
    if (!categorySelect || workerCards.length === 0) return;
    const cat = (selectedCategory || categorySelect.value || 'all').toLowerCase();
    
    workerCards.forEach(card => {
      const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
      if (cat === 'all' || cardCat.includes(cat) || cat.includes(cardCat)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // Update labels
    if (pageTitle && pageBreadcrumb) {
      if (cat === 'all') {
        pageTitle.textContent = 'Verified Cooperative Professionals';
        pageBreadcrumb.innerHTML = 'Home &gt; Services &gt; <b>All Services</b>';
      } else {
        const readable = cat.charAt(0).toUpperCase() + cat.slice(1);
        pageTitle.textContent = `Verified Cooperative ${readable}`;
        pageBreadcrumb.innerHTML = `Home &gt; Services &gt; <b>${readable}</b>`;
      }
    }
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      filterByCategory(categorySelect.value);
    });

    // Check if URL has ?cat=... parameter (e.g. from landing page cards)
    const urlParams = new URLSearchParams(window.location.search);
    const initialCat = urlParams.get('cat');
    if (initialCat) {
      categorySelect.value = initialCat;
      filterByCategory(initialCat);
    }
  }

  /* ---------- Screen 3: demand forecast chart ---------- */
  const chart = document.getElementById('demandChart');
  if (chart) {
    const data = [
      { day: 'Mon', actual: 62, predicted: 58 },
      { day: 'Tue', actual: 70, predicted: 66 },
      { day: 'Wed', actual: 58, predicted: 60 },
      { day: 'Thu', actual: 75, predicted: 72 },
      { day: 'Fri', actual: 88, predicted: 84 },
      { day: 'Sat', actual: 95, predicted: 110 }, // predicted surge
      { day: 'Sun', actual: 80, predicted: 78 },
    ];
    const maxVal = 120;
    chart.innerHTML = data.map(d => `
      <div class="col">
        <div class="bars">
          <div class="bar" style="height:${(d.actual / maxVal) * 100}%"></div>
          <div class="bar predicted" style="height:${(d.predicted / maxVal) * 100}%"></div>
        </div>
        <div class="day">${d.day}</div>
      </div>
    `).join('');
  }

});

/* ---------- Screen 3: worker verification approve/reject ---------- */
function handleVerify(btn, action) {
  const row = btn.closest('.verify-row');
  row.style.opacity = '0.4';
  row.style.pointerEvents = 'none';
  setTimeout(() => {
    row.classList.add('removed');
    updatePendingCount();
  }, 350);
}

function updatePendingCount() {
  const remaining = document.querySelectorAll('#verifyQueue .verify-row:not(.removed)').length;
  const label = document.querySelector('.panel-head span');
  if (label) label.textContent = `· ${remaining} Pending Application${remaining === 1 ? '' : 's'}`;
}
