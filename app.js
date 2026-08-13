const menu=document.querySelector('.menu');
const mobile=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobile?.classList.toggle('is-open',!open)});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}));

const refinements=document.createElement('style');
refinements.textContent=`
  body{font-synthesis:none}

  .topbar{
    background:rgba(31,0,72,.70)!important;
    -webkit-backdrop-filter:blur(22px) saturate(145%);
    backdrop-filter:blur(22px) saturate(145%);
    border-bottom:1px solid rgba(255,255,255,.22)!important;
  }
  .mobile-nav{
    background:rgba(31,0,72,.88)!important;
    -webkit-backdrop-filter:blur(22px) saturate(145%);
    backdrop-filter:blur(22px) saturate(145%);
  }

  .hero h1,.section-heading h2,.guild-sample,.guild-block .alphabet{text-transform:uppercase}
  .section-heading h2{font-size:70px!important;text-wrap:balance}

  .hero-note,.section-intro,.logo-rule p,.hoves-sample,.font-download strong,.material-copy small,.logo-variant-meta strong{
    text-wrap:pretty;
    orphans:3;
    widows:3;
    hyphens:none;
  }
  .hero h1,.hoves-sample{text-wrap:balance}

  .hero{position:relative;overflow:hidden}
  .hero::after{
    content:"";
    position:absolute;
    z-index:3;
    right:-8vw;
    top:-6%;
    width:72vw;
    height:112%;
    background:var(--lilac);
    -webkit-mask:url("./assets/logos/symbol-purple.svg") right center/auto 100% no-repeat;
    mask:url("./assets/logos/symbol-purple.svg") right center/auto 100% no-repeat;
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
  .hero-foot{grid-column:1/11}

  .footer{align-items:center!important}
  .footer img,.footer span,.footer a{align-self:center}

  .guild-block .alphabet{font-family:"Guild A Display",Arial,sans-serif;font-weight:400}
  .hoves-block .alphabet{line-height:1.8;letter-spacing:.015em}
  .font-download{border-top:0!important;padding-top:0!important}

  .logo-color-switch{display:none!important}
  .logo-canvas{overflow:hidden;transition:background var(--transition)}
  .logo-art{display:block!important;transition:opacity var(--transition)}
  .logo-card-tones{
    position:absolute;
    z-index:5;
    top:14px;
    right:14px;
    display:flex;
    gap:6px;
    align-items:center;
  }
  .logo-tone-button{
    width:20px;
    height:20px;
    display:grid;
    place-items:center;
    padding:0;
    border:1px solid rgba(31,0,72,.58);
    border-radius:999px;
    background:transparent;
    color:var(--purple);
    cursor:pointer;
    transition:transform var(--transition),background var(--transition),border-color var(--transition);
  }
  .logo-tone-button::before{
    content:"";
    width:9px;
    height:9px;
    border-radius:50%;
    background:var(--tone);
    border:1px solid rgba(31,0,72,.22);
    box-sizing:border-box;
  }
  .logo-tone-button:hover,.logo-tone-button:focus-visible{transform:scale(1.08)}
  .logo-tone-button.is-active{background:rgba(255,255,255,.84);box-shadow:0 0 0 1px currentColor inset}
  .logo-canvas.is-dark-preview .logo-tone-button{color:var(--white);border-color:rgba(255,255,255,.68)}
  .logo-canvas.is-dark-preview .logo-tone-button.is-active{background:rgba(255,255,255,.18)}
  .logo-canvas.is-dark-preview .logo-tone-button::before{border-color:rgba(255,255,255,.4)}

  .compact-zip-link{
    min-width:0!important;
    min-height:0!important;
    width:auto!important;
    display:inline-flex!important;
    justify-content:flex-start!important;
    align-items:center!important;
    gap:9px!important;
    padding:8px 0!important;
    border-bottom:1px solid currentColor!important;
    font-size:var(--fs-small)!important;
    letter-spacing:var(--tracking-caps)!important;
    text-transform:uppercase!important;
  }
  .compact-zip-link .inline-download-icon{display:inline-grid!important;place-items:center}
  .compact-zip-link .inline-download-icon svg{width:14px;height:14px;fill:currentColor}
  .compact-zip-link:hover{opacity:.62!important}
  .font-download .compact-zip-link{justify-self:end}

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

  .material-download:hover .material-download-icon{background:var(--white)!important;color:var(--purple)!important;opacity:1!important}

  .desktop-break{display:none}
  @media(min-width:769px){.desktop-break{display:block}}

  @media(max-width:1024px){
    .section-heading h2{font-size:58px!important}
  }
  @media(max-width:900px){
    .hero::after{right:-42vw;top:-8%;width:118vw;height:116%;opacity:.34;-webkit-mask-size:auto 100%;mask-size:auto 100%}
    .hero h1{grid-column:1/5;margin-top:64px;font-size:clamp(58px,17vw,88px)}
    .hero-note{grid-column:1/5;align-self:start;margin:28px 0 0;max-width:300px}
    .hero-foot{grid-column:1/5;margin-top:72px}
    .logo-card-tones{top:11px;right:11px;gap:5px}
    .logo-tone-button{width:19px;height:19px}
    .logo-tone-button::before{width:8px;height:8px}
    .font-download .compact-zip-link{justify-self:start}
  }
  @media(max-width:768px){.section-heading h2{font-size:45px!important}}
  @media(max-width:375px){.section-heading h2{font-size:38px!important}}
`;
document.head.appendChild(refinements);

const heroEyebrow=document.querySelector('.hero .eyebrow');
if(heroEyebrow)heroEyebrow.textContent=heroEyebrow.textContent.replace(/^\s*0+\s*\/\s*/, '').trim();
document.querySelectorAll('.hero .page-no').forEach(node=>node.remove());

const copyIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
const checkIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
const downloadIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V3zM5 19h14v2H5z"/></svg>';

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
  }catch{showToast(value)}
}));

const guildSample=document.querySelector('.guild-sample');
if(guildSample)guildSample.textContent='О ПРОЕКТЕ';
const guildAlphabet=document.querySelector('.guild-block .alphabet');
if(guildAlphabet)guildAlphabet.textContent='АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const hovesAlphabet=document.querySelector('.hoves-block .alphabet');
if(hovesAlphabet)hovesAlphabet.textContent='Аа Бб Вв Гг Дд Ее Ёё Жж Зз Ии Йй Кк Лл Мм Нн Оо Пп Рр Сс Тт Уу Фф Хх Цц Чч Шш Щщ Ъъ Ыы Ьь Ээ Юю Яя';

const colorIntro=document.querySelector('.section-colors .section-intro');
if(colorIntro){
  colorIntro.innerHTML='Сине-фиолетовый оттенок — доминирующий.<span class="desktop-break"></span>Сиреневый и светло-сиреневый дополняют основную палитру.';
}

const hangingWords=/((?:^|[\s(«„“—–-]))(а|и|в|во|к|ко|с|со|у|о|об|обо|от|до|по|на|за|из|без|для|при|над|под|перед|через|не|ни|но|же|бы|ли)\s+/giu;
function fixHangingWords(element){
  if(!element)return;
  const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{node.nodeValue=node.nodeValue.replace(hangingWords,(_,lead,word)=>`${lead}${word}\u00A0`)});
}
document.querySelectorAll('.hero-note,.section-intro,.logo-rule p,.hoves-sample,.font-download strong,.logo-variant-meta strong').forEach(fixHangingWords);

const logoTones=[
  {key:'Deep_Purple',label:'Фиолетовый',preview:'#E9E9F5',dark:false},
  {key:'White',label:'Белый',preview:'#1F0048',dark:true}
];
const logoTypes=['AURIX_With_Descriptor','AURIX_Wordmark','AURIX_Symbol'];

document.querySelectorAll('.logo-variant').forEach((card,index)=>{
  const canvas=card.querySelector('.logo-canvas');
  const img=canvas?.querySelector('.logo-art');
  const download=card.querySelector('[data-logo-download]');
  if(!canvas||!img||!download)return;

  const controls=document.createElement('div');
  controls.className='logo-card-tones';
  controls.setAttribute('role','group');
  controls.setAttribute('aria-label','Цвет этой версии логотипа');

  function applyTone(tone,button){
    const isWhite=tone.key==='White';
    img.src=isWhite?(img.dataset.white||img.src):(img.dataset.purple||img.src);
    canvas.style.background=tone.preview;
    canvas.classList.toggle('is-dark-preview',tone.dark);
    controls.querySelectorAll('.logo-tone-button').forEach(b=>{
      const active=b===button;
      b.classList.toggle('is-active',active);
      b.setAttribute('aria-pressed',String(active));
    });
    const type=logoTypes[index]||logoTypes[0];
    const archive=`${type}_${tone.key}.zip`;
    download.href=`./downloads/${archive}`;
    download.setAttribute('download',archive);
    download.setAttribute('aria-label',`Скачать ${tone.label}: SVG, PNG и PDF`);
    download.setAttribute('title',`Скачать ${tone.label}: SVG, PNG и PDF`);
  }

  logoTones.forEach((tone,toneIndex)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='logo-tone-button';
    button.style.setProperty('--tone',tone.key==='White'?'#FFFFFF':'#1F0048');
    button.setAttribute('aria-label',tone.label);
    button.setAttribute('title',tone.label);
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>applyTone(tone,button));
    controls.appendChild(button);
    if(toneIndex===0)requestAnimationFrame(()=>applyTone(tone,button));
  });

  canvas.appendChild(controls);
  download.innerHTML=`ZIP <b class="inline-download-icon" aria-hidden="true">${downloadIcon}</b>`;
});

document.querySelector('.logo-color-switch')?.remove();
/* The global “all logo versions” ZIP is intentionally removed; downloads stay per card. */
document.querySelector('.logo-download')?.remove();

const fontZipLink=document.querySelector('.font-download .text-link');
if(fontZipLink){
  fontZipLink.classList.add('compact-zip-link');
  fontZipLink.innerHTML=`ZIP <span class="inline-download-icon" aria-hidden="true">${downloadIcon}</span>`;
  fontZipLink.setAttribute('aria-label','Скачать шрифты ZIP');
}

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
  {match:'AURIX_Logos',title:'Логотипы',formats:'ZIP · SVG, PNG, EPS, PDF · фиолетовый / белый'},
  {match:'AURIX_Fonts.zip',title:'Шрифты',formats:'ZIP · OTF, TTF · Regular'}
];
document.querySelectorAll('.file-list a').forEach(link=>{
  const definition=materialDefinitions.find(item=>link.href.includes(item.match));
  if(!definition)return;
  link.classList.add('material-download');
  link.innerHTML=`<span class="material-copy"><strong>${definition.title}</strong><small>${definition.formats} · <em data-file-size>—</em></small></span><b class="material-download-icon" aria-hidden="true">${downloadIcon}</b>`;
  fixHangingWords(link.querySelector('small'));
  const sizeTarget=link.querySelector('[data-file-size]');
  resolveFileSize(link.href).then(bytes=>{if(sizeTarget)sizeTarget.textContent=formatFileSize(bytes)});
});
