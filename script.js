// ============================================================
// PNS Global Foundation v2 — motion layer
// ============================================================

/* ---------- Grain texture (canvas noise) ---------- */
(function grain(){
  const canvas = document.getElementById('grain');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 128;
  canvas.width = size; canvas.height = size;
  canvas.style.width = '100%'; canvas.style.height = '100%';
  const imageData = ctx.createImageData(size, size);
  function paint(){
    const d = imageData.data;
    for(let i=0;i<d.length;i+=4){
      const v = Math.random()*255;
      d[i]=v; d[i+1]=v; d[i+2]=v; d[i+3]=22;
    }
    ctx.putImageData(imageData,0,0);
  }
  paint();
  setInterval(paint, 120);
})();

/* ---------- Custom cursor (difference blend, no contrast issues) ---------- */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (cursorDot && window.matchMedia('(hover:hover)').matches) {
  let rx=innerWidth/2, ry=innerHeight/2, dx=rx, dy=ry;
  window.addEventListener('mousemove', e=>{
    dx = e.clientX; dy = e.clientY;
    cursorDot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
  });
  const ringTick = () => {
    rx += (dx-rx)*0.18; ry += (dy-ry)*0.18;
    cursorRing.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(ringTick);
  };
  ringTick();
  document.querySelectorAll('a,button,.story,.involve-card').forEach(el=>{
    el.addEventListener('mouseenter', ()=>cursorRing.classList.add('grow'));
    el.addEventListener('mouseleave', ()=>cursorRing.classList.remove('grow'));
  });
}

/* ---------- Magnetic buttons ---------- */
document.querySelectorAll('[data-magnetic]').forEach(el=>{
  el.addEventListener('mousemove', (e)=>{
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width/2);
    const my = e.clientY - (r.top + r.height/2);
    el.style.transform = `translate(${mx*0.28}px, ${my*0.32}px)`;
  });
  el.addEventListener('mouseleave', ()=>{ el.style.transform = 'translate(0,0)'; });
});

/* ---------- Hero sun parallax on mousemove ---------- */
const heroSun = document.querySelector('.hero-sun');
if (heroSun) {
  window.addEventListener('mousemove', (e) => {
    const px = (e.clientX / innerWidth - 0.5) * 2;
    const py = (e.clientY / innerHeight - 0.5) * 2;
    heroSun.style.setProperty('--tx', `${px*18}px`);
    heroSun.style.setProperty('--ty', `${py*18}px`);
  }, { passive:true });
}

/* ---------- Nav scroll state (blend-mode handles contrast) ---------- */
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', ()=> links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>links.classList.remove('open')));
}

/* ---------- Reveal on scroll (used sparingly) ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); }
  });
}, { threshold:0.16, rootMargin:'0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- Count-up numbers ---------- */
const fmt = n => n.toLocaleString('en-IN');
const countIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count,10);
    const duration = 1500;
    const t0 = performance.now();
    const step = (now)=>{
      const p = Math.min((now-t0)/duration,1);
      const eased = 1-Math.pow(1-p,3);
      el.textContent = fmt(Math.round(target*eased));
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold:0.5 });
document.querySelectorAll('.num-val').forEach(el=>countIO.observe(el));

/* ---------- Scrollytelling: swap sticky visual icon per program ---------- */
const blocks = document.querySelectorAll('.program-block');
const slots = document.querySelectorAll('.icon-slot');
const label = document.querySelector('.scrolly-visual .label');
const labels = ['Healthcare','Education','Community welfare','Grassroots development'];
if (blocks.length && slots.length) {
  const scrollyIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = [...blocks].indexOf(entry.target);
        slots.forEach((s,i)=>s.classList.toggle('active', i===idx));
        if(label) label.textContent = labels[idx] || '';
      }
    });
  }, { threshold:0.5 });
  blocks.forEach(b=>scrollyIO.observe(b));
}

/* ---------- Smooth in-page nav scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      const target = document.querySelector(id);
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    }
  });
});

/* ---------- Year ---------- */
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();
