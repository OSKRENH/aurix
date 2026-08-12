const menu=document.querySelector('.menu');const mobile=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobile?.classList.toggle('is-open',!open)});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}));
const toast=document.querySelector('.toast');let toastTimer;
function showToast(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1300)}
document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const value=btn.dataset.copy||'';try{await navigator.clipboard.writeText(value);showToast(`Скопировано: ${value}`)}catch{showToast(value)}}));

const copyIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
const downloadIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V3zM5 19h14v2H5z"/></svg>';

/* Etalon-style copy control: compact icon to the left of the HEX code. */
document.querySelectorAll('.color-primary').forEach(primary=>{
  const hex=primary.querySelector('.color-hex');
  const button=primary.querySelector('.color-copy');
  if(!hex||!button)return;
  button.classList.remove('color-copy');
  button.classList.add('color-copy-icon');
  button.setAttribute('aria-label',`Скопировать ${hex.textContent.trim()}`);
  button.setAttribute('title',`Скопировать ${hex.textContent.trim()}`);
  button.innerHTML=copyIcon;
  primary.insertBefore(button,hex);
  primary.classList.add('color-primary-etalon');
});

/* Guild A Display sample should demonstrate editorial typography, not repeat the logo. */
const guildSample=document.querySelector('.guild-sample');
if(guildSample)guildSample.textContent='О проекте';

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

function formatFileSize(bytes){
  if(!Number.isFinite(bytes)||bytes<=0)return '—';
  if(bytes<1024*1024)return `${Math.max(1,Math.round(bytes/1024))} КБ`;
  const mb=bytes/(1024*1024);
  return `${mb<10?mb.toFixed(1):Math.round(mb)} МБ`.replace('.0 ',' ');
}

async function resolveFileSize(url){
  try{
    const head=await fetch(url,{method:'HEAD',cache:'no-store'});
    const length=Number(head.headers.get('content-length'));
    if(head.ok&&length>0)return length;
  }catch{}
  try{
    const range=await fetch(url,{headers:{Range:'bytes=0-0'},cache:'no-store'});
    const contentRange=range.headers.get('content-range')||'';
    const total=Number(contentRange.split('/').pop());
    if(Number.isFinite(total)&&total>0)return total;
    const length=Number(range.headers.get('content-length'));
    if(Number.isFinite(length)&&length>0)return length;
  }catch{}
  return 0;
}

const materialDefinitions=[
  {match:'AURIX_Logos_All_Formats.zip',title:'Логотипы',formats:'ZIP · SVG, PNG, EPS, PDF'},
  {match:'AURIX_Fonts.zip',title:'Шрифты',formats:'ZIP · WOFF2, TTF'}
];

document.querySelectorAll('.file-list a').forEach(link=>{
  const definition=materialDefinitions.find(item=>link.href.includes(item.match));
  if(!definition)return;
  link.classList.add('material-download');
  link.innerHTML=`<span class="material-copy"><strong>${definition.title}</strong><small>${definition.formats} · <em data-file-size>—</em></small></span><b class="material-download-icon" aria-hidden="true">${downloadIcon}</b>`;
  const sizeTarget=link.querySelector('[data-file-size]');
  resolveFileSize(link.href).then(bytes=>{if(sizeTarget)sizeTarget.textContent=formatFileSize(bytes)});
});

/* Replace every remaining plain download arrow with the same Etalon pictogram. */
document.querySelectorAll('.logo-variant-meta a b').forEach(icon=>{icon.classList.add('inline-download-icon');icon.innerHTML=downloadIcon});
document.querySelectorAll('.text-link span').forEach(icon=>{icon.classList.add('round-download-icon');icon.innerHTML=downloadIcon});
