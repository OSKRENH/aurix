const menu=document.querySelector('.menu');const mobile=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobile?.classList.toggle('is-open',!open)});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}));
const toast=document.querySelector('.toast');let toastTimer;
function showToast(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1300)}
document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const value=btn.dataset.copy||'';try{await navigator.clipboard.writeText(value);showToast(`Скопировано: ${value}`)}catch{showToast(value)}}));

const logoGallery=document.querySelector('[data-logo-gallery]');
const logoThemeButtons=document.querySelectorAll('[data-logo-theme]');
function setLogoTheme(theme){
  if(!logoGallery)return;
  logoGallery.dataset.theme=theme;
  logoGallery.querySelectorAll('img[data-purple][data-white]').forEach(img=>{
    img.src=theme==='white'?img.dataset.white:img.dataset.purple;
  });
  logoGallery.querySelectorAll('[data-logo-download]').forEach(link=>{
    link.href=theme==='white'?link.dataset.white:link.dataset.purple;
  });
  logoThemeButtons.forEach(button=>{
    const active=button.dataset.logoTheme===theme;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
  });
}
logoThemeButtons.forEach(button=>button.addEventListener('click',()=>setLogoTheme(button.dataset.logoTheme||'purple')));

const fullLogoArchive='./downloads/AURIX_Logos_All_Formats.zip';
document.querySelectorAll('a[href$="AURIX_Logos.zip"]').forEach(link=>{link.href=fullLogoArchive});
const materialsLogoLink=document.querySelector('.file-list a[href$="AURIX_Logos_All_Formats.zip"]');
if(materialsLogoLink){
  const meta=materialsLogoLink.querySelector('small');
  if(meta)meta.textContent='ZIP · SVG / PNG / EPS / PDF · 3 типа · 4 цветовые версии';
}
