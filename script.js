document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Bară de progres + link activ în meniu ---
const progress = document.querySelector('.progress');
const navLinks = [...document.querySelectorAll('.nav__links a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty('--p', max > 0 ? scrollY / max : 0);
  let current = -1;
  sections.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = i; });
  navLinks.forEach((a, i) => a.classList.toggle('is-active', i === current));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- Lumina de pe carduri urmărește cursorul ---
document.querySelectorAll('.project, .skill-group').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// --- Elementele apar treptat la scroll ---
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.section__title, .project, .about, .skill-group, .contact__lead, .more')
    .forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = el.classList.contains('skill-group') ? `${(i % 3) * 90}ms` : ''; io.observe(el); });
}

// --- Rolul din hero se scrie singur ---
const typed = document.getElementById('typed');
const roles = ['aplicații mobile & web', 'React Native', 'ASP.NET & C#', 'interfețe atente la detalii'];
if (!reduceMotion) {
  let r = 0, c = roles[0].length, deleting = true;
  setTimeout(function tick() {
    const word = roles[r];
    c += deleting ? -1 : 1;
    typed.textContent = word.slice(0, c);
    let delay = deleting ? 35 : 70;
    if (!deleting && c === word.length) { deleting = true; delay = 2200; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    setTimeout(tick, delay);
  }, 2200);
}

// --- Macheta aplicației de salarizare: stat de plată recalculat la schimbarea procentelor ---
const employees = [
  { name: 'Popescu Ana', base: 6500, spor: 10, premii: 500, retineri: 0 },
  { name: 'Ionescu Mihai', base: 8200, spor: 5, premii: 0, retineri: 300 },
  { name: 'Radu Elena', base: 5400, spor: 15, premii: 250, retineri: 0 },
  { name: 'Stan Andrei', base: 9800, spor: 0, premii: 1000, retineri: 450 },
];
const fmt = n => Math.round(n).toLocaleString('ro-RO');
const rate = id => Math.max(0, Number(document.getElementById(id).value) || 0) / 100;

function renderPayroll() {
  const cas = rate('r-cas'), cass = rate('r-cass'), imp = rate('r-imp');
  let tBrut = 0, tNet = 0, tCard = 0;
  document.getElementById('payroll-body').innerHTML = employees.map(e => {
    const brut = e.base * (1 + e.spor / 100) + e.premii;
    const contrib = brut * (cas + cass);
    const net = brut - contrib - (brut - contrib) * imp;
    const card = net - e.retineri;
    tBrut += brut; tNet += net; tCard += card;
    return `<tr><td>${e.name}</td><td>${fmt(brut)}</td><td class="flash">${fmt(net)}</td><td class="flash">${fmt(card)}</td></tr>`;
  }).join('');
  document.getElementById('t-brut').textContent = fmt(tBrut);
  document.getElementById('t-net').textContent = fmt(tNet);
  document.getElementById('t-card').textContent = fmt(tCard);
}
['r-cas', 'r-cass', 'r-imp'].forEach(id => document.getElementById(id).addEventListener('input', renderPayroll));
renderPayroll();

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
