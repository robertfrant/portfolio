document.getElementById('year').textContent = new Date().getFullYear();

// --- Macheta DulApp: date demo care imită garderoba din aplicație ---
const IMG = {
  Tricou: 'assets/dulapp/shirt.png',
  Pantaloni: 'assets/dulapp/pants.png',
  Adidași: 'assets/dulapp/shoe.png',
};

const wardrobe = [
  { category: 'Tricou', brand: 'Nike', color: '#ffffff' },
  { category: 'Tricou', brand: 'Zara', color: '#ffd8a8' },
  { category: 'Pantaloni', brand: "Levi's", color: '#a5c8ff' },
  { category: 'Pantaloni', brand: 'H&M', color: '#d9d2c3' },
  { category: 'Adidași', brand: 'Adidas', color: '#c3f0d0' },
  { category: 'Adidași', brand: 'Puma', color: '#ffc9c9' },
];

const screen = document.querySelector('.screen');
const views = screen.querySelectorAll('.view');
const tabs = screen.querySelectorAll('.tab');
const searchGrid = document.getElementById('search-grid');
const searchQ = document.getElementById('search-q');
let activeCategory = null;

const toast = document.createElement('div');
toast.className = 'toast';
screen.appendChild(toast);
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1600);
}

function go(name) {
  views.forEach(v => v.classList.toggle('is-active', v.dataset.view === name));
  tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === name));
}

function itemHTML(item, withSelect) {
  return `
    <div class="item">
      <div class="item__pic" style="background:${item.color}"><img src="${IMG[item.category]}" alt="${item.category}"></div>
      <p class="item__brand">${item.brand}</p>
      <button class="item__btn item__btn--details" data-details="${item.brand} · ${item.category}">Detalii</button>
      ${withSelect ? `<button class="item__btn item__btn--select" data-select="${wardrobe.indexOf(item)}">Selectează</button>` : ''}
    </div>`;
}

function renderSearch() {
  const list = activeCategory ? wardrobe.filter(i => i.category === activeCategory) : wardrobe;
  searchQ.textContent = activeCategory || 'Caută…';
  searchGrid.innerHTML = list.map(i => itemHTML(i, Boolean(activeCategory))).join('');
}

document.getElementById('profile-grid').innerHTML = wardrobe.map(i => itemHTML(i, false)).join('');
document.getElementById('post-count').textContent = wardrobe.length;

tabs.forEach(tab => tab.addEventListener('click', () => {
  if (tab.dataset.tab === 'search') { activeCategory = null; renderSearch(); }
  go(tab.dataset.tab);
}));

// Atingi un slot -> căutare filtrată pe categoria respectivă (ca în aplicație)
screen.querySelectorAll('.slot').forEach(slot => slot.addEventListener('click', () => {
  activeCategory = slot.dataset.slot;
  renderSearch();
  go('search');
}));

screen.addEventListener('click', e => {
  const details = e.target.closest('[data-details]');
  if (details) showToast(details.dataset.details);

  const select = e.target.closest('[data-select]');
  if (select) {
    const item = wardrobe[select.dataset.select];
    const slot = screen.querySelector(`.slot[data-slot="${item.category}"]`);
    slot.style.background = item.color;
    showToast('Imaginea principală a fost actualizată');
    go('home');
  }
});
