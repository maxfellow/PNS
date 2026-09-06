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

/* ============================================================
   v3 ADDITIONS
   ============================================================ */

/* ---------- cursor glow (ambient, follows with lag) ---------- */
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(hover:hover)').matches) {
  let gx=innerWidth/2, gy=innerHeight/2, tx=gx, ty=gy;
  window.addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; });
  const glowTick = ()=>{
    gx += (tx-gx)*0.08; gy += (ty-gy)*0.08;
    glow.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%)`;
    requestAnimationFrame(glowTick);
  };
  glowTick();
}

/* ---------- 3D tilt on hover ---------- */
document.querySelectorAll('.tilt').forEach(el=>{
  el.addEventListener('mousemove', (e)=>{
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - 0.5;
    const py = (e.clientY - r.top)/r.height - 0.5;
    el.style.setProperty('--ry', `${px*10}deg`);
    el.style.setProperty('--rx', `${-py*10}deg`);
  });
  el.addEventListener('mouseleave', ()=>{
    el.style.setProperty('--ry','0deg'); el.style.setProperty('--rx','0deg');
  });
});

/* ---------- split-reveal: wrap words, animate on view ---------- */
document.querySelectorAll('.split-reveal').forEach(el=>{
  const text = el.textContent;
  el.innerHTML = text.split(' ').map((w,i)=>
    `<span class="sw"><span style="transition-delay:${(i*0.05).toFixed(2)}s">${w}&nbsp;</span></span>`
  ).join('');
});
const splitIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('in-view'); splitIO.unobserve(entry.target); }
  });
}, { threshold:0.3 });
document.querySelectorAll('.split-reveal').forEach(el=>splitIO.observe(el));

/* ---------- page transition on internal navigation ---------- */
const ptOverlay = document.getElementById('page-transition');
if (ptOverlay) {
  requestAnimationFrame(()=>{ ptOverlay.classList.add('enter'); });
  document.querySelectorAll('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank' || a.hasAttribute('data-open-modal')) return;
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      ptOverlay.classList.remove('enter');
      ptOverlay.classList.add('leave');
      setTimeout(()=>{ window.location.href = href; }, 480);
    });
  });
}

/* ---------- gallery lightbox ---------- */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      lightbox.querySelector('.visual').innerHTML = item.querySelector('.bg').innerHTML;
      lightbox.querySelector('.tag').textContent = item.dataset.tag || '';
      lightbox.querySelector('h3').textContent = item.dataset.title || '';
      lightbox.querySelector('.desc').textContent = item.dataset.desc || '';
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', (e)=>{
    if(e.target === lightbox || e.target.classList.contains('close')) lightbox.classList.remove('open');
  });
}

/* ---------- modal forms -> WhatsApp ---------- */
const WHATSAPP_NUMBER = '919686000666';

function openWhatsApp(message){
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

document.querySelectorAll('[data-open-modal]').forEach(trigger=>{
  trigger.addEventListener('click', (e)=>{
    e.preventDefault();
    const id = trigger.dataset.openModal;
    const modal = document.getElementById(id);
    if(modal) modal.classList.add('open');
  });
});
document.querySelectorAll('.modal-overlay').forEach(overlay=>{
  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay || e.target.classList.contains('modal-close')) overlay.classList.remove('open');
  });
});

const donateForm = document.getElementById('form-donate');
if (donateForm) donateForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const f = new FormData(donateForm);
  const msg = `Hi PNS Global Foundation, I would like to make a donation.\n\nName: ${f.get('name')}\nAmount: Rs. ${f.get('amount')}\nContact: ${f.get('contact')}\nMessage: ${f.get('message') || '-'}`;
  openWhatsApp(msg);
  donateForm.closest('.modal-overlay').classList.remove('open');
  donateForm.reset();
});

const volunteerForm = document.getElementById('form-volunteer');
if (volunteerForm) volunteerForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const f = new FormData(volunteerForm);
  const msg = `Hi, I would like to volunteer with PNS Global Foundation.\n\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\nArea of interest: ${f.get('interest')}\nAvailability: ${f.get('availability') || '-'}`;
  openWhatsApp(msg);
  volunteerForm.closest('.modal-overlay').classList.remove('open');
  volunteerForm.reset();
});

const partnerForm = document.getElementById('form-partner');
if (partnerForm) partnerForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const f = new FormData(partnerForm);
  const msg = `Hi, our organisation is interested in partnering with PNS Global Foundation.\n\nOrganisation: ${f.get('org')}\nContact person: ${f.get('name')}\nEmail: ${f.get('email')}\nDetails: ${f.get('details') || '-'}`;
  openWhatsApp(msg);
  partnerForm.closest('.modal-overlay').classList.remove('open');
  partnerForm.reset();
});

/* Escape key closes any open modal/lightbox */
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    document.querySelectorAll('.modal-overlay.open, #lightbox.open').forEach(el=>el.classList.remove('open'));
  }
});
