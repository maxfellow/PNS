// ============================================================
// PNS Global Foundation — interaction layer
// ============================================================

// --- Nav scroll state ---
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- Mobile nav toggle ---
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// --- Custom cursor ---
const cursor = document.querySelector('.cursor');
if (cursor && window.matchMedia('(hover:hover)').matches) {
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let x = cx, y = cy;
  window.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
  const tick = () => {
    x += (cx - x) * 0.22;
    y += (cy - y) * 0.22;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  const growEls = document.querySelectorAll('a, button, .program, .involve-card, .story-card');
  growEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
  const darkSections = document.querySelectorAll('.on-ink');
  const darkObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      // no-op placeholder for future contrast switching
    });
  });
}

// --- Scroll reveal ---
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => io.observe(el));

// --- Count-up numbers ---
const counters = document.querySelectorAll('.num-val');
const formatNum = (n) => n.toLocaleString('en-IN');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = formatNum(val);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => countObserver.observe(el));

// --- Smooth in-page nav ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// --- Current year ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
