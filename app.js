const menu=document.querySelector('.menu');
const mobile=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobile?.classList.toggle('is-open',!open)});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}));

const refinements=document.createElement('style');
refinements.textContent=`
  body{font-synthesis:none}

  /* Hero: compact 88px title, copy on the left, oversized brand symbol on the right. */
  .hero{position:relative;overflow:hidden}
  .hero::after{
    content:"";
    position:absolute;
    z-index:0;
    right:-10vw;
    top:-4%;
    width:min(58vw,980px);
    height:112%;
    background:var(--lilac);
    -webkit-mask:url("./assets/logos/symbol-purple.svg") center/contain no-repeat;
    mask:url("./assets/logos/symbol-purple.svg") center/contain no-repeat;
    pointer-events:none;
  }
  .hero-inner{position:relative;z-index:1}
  .hero .eyebrow{grid-column:1/5}
  .hero h1{
    grid-column:1/5;
    align-self:start;
    margin-top:clamp(110px,13vh,150px);
    font-family:"Guild A Display",Arial,sans-serif;
    font-size:88px;
    line-height:.94;
    font-weight:400;
    letter-spacing:-.035em;
  }
  .hero-note{
    grid-column:1/5;
    align-self:end;
    margin:0 0 clamp(78px,9vh,116px);
    max-width:360px;
  }
  .hero-foot{grid-column:1/8}

  /* Guild specimen: the whole left card demonstrates Guild, including the alphabet. */
  .guild-block .alphabet{font-family:"Guild A Display",Arial,sans-serif;font-weight:400}

  /* Typography download area: no divider and a smaller download control. */
  .font-download{border-top:0!important;padding-top:0!important}
  .font-download .text-link{min-width:184px;min-height:48px;gap:14px}
  .font-download .round-download-icon{width:40px!important;height:40px!important;flex-basis:40px!important}
  .font-download .round-download-icon svg{width:18px;height:18px}

  /* Etalon-style HEX copy circles. */
  .color-copy-icon{
    width:42px!important;
    height:42px!important;
    flex:0 0 42px;
    display:grid!important;
    place-items:center!important;
    border:1px solid currentColor!important;
    border-radius:999px!important;
    background:transparent!important;
    color:inherit!important;
    opacity:1!important;
    transition:background var(--transition),color var(--transition),transform var(--transition)!important;
  }
  .color-copy-icon svg{width:18px!important;height:18px!important;fill:currentColor!important}
  .color-copy-icon:hover,.color-copy-icon:focus-visible{transform:translateY(-1px)}
  .color-deep .color-copy-icon:hover,.color-deep .color-copy-icon:focus-visible{background:var(--white)!important;color:var(--purple)!important}
  .color-lilac .color-copy-icon:hover,.color-lilac .color-copy-icon:focus-visible,
  .color-mist .color-copy-icon:hover,.color-mist .color-copy-icon:focus-visible{background:var(--purple)!important;color:var(--white)!important}

  /* Download-circle hover fix: explicit contrasting colors, never currentColor-on-currentColor. */
  .text-link:hover{opacity:1!important}
  .material-download:hover .material-download-icon{background:var(--white)!important;color:var(--purple)!important;opacity:1!important}
  .section-type .text-link:hover .round-download-icon,
  .theme-white .text-link:hover .round-download-icon,
  .logo-download:hover .round-download-icon{background:var(--purple)!important;color:var(--white)!important;opacity:1!important}
  .theme-dark .text-link:hover .round-download-icon{background:var(--white)!important;color:var(--purple)!important;opacity:1!important}

  @media(max-width:900px){
    .hero::after{right:-30vw;top:12%;width:92vw;height:78%;opacity:.38}
    .hero h1{grid-column:1/5;margin-top:64px;font-size:clamp(58px,17vw,88px)}
    .hero-note{grid-column:1/5;align-self:start;margin:28px 0 0;max-width:300px}
    .hero-foot{grid-column:1/5;margin-top:72px}
    .font-download .text-link{min-width:0;width:auto!important;justify-self:start}
  }
`;
document.head.appendChild(refinements);

/* Remove the leading 00 marker from the first screen. */
const heroEyebrow=document.querySelector('.hero .eyebrow');
if(heroEyebrow)heroEyebrow.textContent=heroEyebrow.textContent.replace(/^\s*0+\s*\/\s*/, '').trim();
document.querySelectorAll('.hero .page-no').forEach(node=>node.remove());

const copyIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
const checkIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
const downloadIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V3zM5 19h14v2H5z"/></svg>';

/* Etalon-style copy controls beside HEX values. */
document.querySelectorAll('.color-primary').forEach(primary=>{
  const hex=primary.querySelector('.color-hex');
  const button=primary.querySelector('[data-copy]');
  if(!hex||!button)return;
  button.className='color-copy-icon';
  button.setAttribute('aria-label',`Скопировать ${hex.textContent.trim()}`);
  button.setAttribute('title',`Скопировать ${hex.textContent.trim()}`);
  button.innerHTML=copyIcon;
  primary.insertBefore(button,hex);
  primary.classList.add('color-primary-etalon');
});

const toast=document.querySelector('.toast');
let toastTimer;
function showToast(text){
  if(!toast)return;
  toast.textContent=text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),1300);
}

document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{
  const value=btn.dataset.copy||'';
  try{
    await navigator.clipboard.writeText(value);
    if(btn.classList.contains('color-copy-icon')){
      btn.innerHTML=checkIcon;
      btn.classList.add('is-copied');
      clearTimeout(btn._copyTimer);
      btn._copyTimer=setTimeout(()=>{btn.innerHTML=copyIcon;btn.classList.remove('is-copied')},1200);
    }
    showToast(`Скопировано: ${value}`);
  }catch{
    showToast(value);
  }
}));

/* Keep the editorial Guild specimen. */
const guildSample=document.querySelector('.guild-sample');
if(guildSample)guildSample.textContent='О проекте';

const logoGallery=document.querySelector('[data-logo-gallery]');
const logoThemeButtons=document.querySelectorAll('[data-logo-theme]');
function setLogoTheme(theme){
  if(!logoGallery)return;
  logoGallery.dataset.theme=theme;
  logoGallery.querySelectorAll('img[data-purple][data-white]').forEach(img=>{img.src=theme==='white'?img.dataset.white:img.dataset.purple});
  logoGallery.querySelectorAll('[data-logo-download]').forEach(link=>{link.href=theme==='white'?link.dataset.white:link.dataset.purple});
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
  try{const head=await fetch(url,{method:'HEAD',cache:'no-store'});const length=Number(head.headers.get('content-length'));if(head.ok&&length>0)return length}catch{}
  try{const range=await fetch(url,{headers:{Range:'bytes=0-0'},cache:'no-store'});const contentRange=range.headers.get('content-range')||'';const total=Number(contentRange.split('/').pop());if(Number.isFinite(total)&&total>0)return total;const length=Number(range.headers.get('content-length'));if(Number.isFinite(length)&&length>0)return length}catch{}
  return 0;
}

const materialDefinitions=[
  {match:'AURIX_Logos_All_Formats.zip',title:'Логотипы',formats:'ZIP · SVG, PNG, EPS, PDF'},
  {match:'AURIX_Fonts.zip',title:'Шрифты',formats:'ZIP · OTF, TTF · Regular'}
];
document.querySelectorAll('.file-list a').forEach(link=>{
  const definition=materialDefinitions.find(item=>link.href.includes(item.match));
  if(!definition)return;
  link.classList.add('material-download');
  link.innerHTML=`<span class="material-copy"><strong>${definition.title}</strong><small>${definition.formats} · <em data-file-size>—</em></small></span><b class="material-download-icon" aria-hidden="true">${downloadIcon}</b>`;
  const sizeTarget=link.querySelector('[data-file-size]');
  resolveFileSize(link.href).then(bytes=>{if(sizeTarget)sizeTarget.textContent=formatFileSize(bytes)});
});

/* Replace plain download arrows with a stable icon. */
document.querySelectorAll('.logo-variant-meta a b').forEach(icon=>{icon.classList.add('inline-download-icon');icon.innerHTML=downloadIcon});
document.querySelectorAll('.text-link span').forEach(icon=>{icon.classList.add('round-download-icon');icon.innerHTML=downloadIcon});
