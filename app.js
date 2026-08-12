const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>[...r.querySelectorAll(s)];

const toast=qs('.toast');
let toastTimer;
function showToast(message){
  if(!toast)return;
  toast.textContent=message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),1400);
}

qsa('[data-logo-card]').forEach(card=>{
  const toggle=qs('.stage-toggle',card);
  toggle?.addEventListener('click',()=>{
    const dark=!card.classList.contains('is-dark');
    card.classList.toggle('is-dark',dark);
    toggle.textContent=dark?'На светлом':'Сменить фон';
  });
});

qsa('.swatch[data-copy]').forEach(card=>{
  const copy=async()=>{
    const value=card.dataset.copy;
    try{await navigator.clipboard.writeText(value);showToast(`${value} скопирован`)}
    catch{showToast(value)}
  };
  card.addEventListener('click',e=>{if(e.target.closest('button')) copy()});
});

const toggle=qs('.menu-toggle');
const mobileNav=qs('.mobile-nav');
toggle?.addEventListener('click',()=>{
  const open=!mobileNav.classList.contains('is-open');
  mobileNav.classList.toggle('is-open',open);
  toggle.setAttribute('aria-expanded',String(open));
});
qsa('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{
  mobileNav.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded','false');
}));

const navLinks=qsa('.desktop-nav a');
const sections=navLinks.map(a=>({a,el:qs(a.getAttribute('href'))})).filter(x=>x.el);
function updateNav(){
  const y=window.innerHeight*.32;
  let current=sections[0];
  sections.forEach(item=>{if(item.el.getBoundingClientRect().top<=y)current=item});
  navLinks.forEach(a=>a.classList.toggle('is-active',a===current?.a));
}
addEventListener('scroll',updateNav,{passive:true});
addEventListener('resize',updateNav);
updateNav();
