const menu=document.querySelector('.menu');
const mobile=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobile?.classList.toggle('is-open',!open)});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}));

const EASE='cubic-bezier(.2,.7,.3,1)';
const copyIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
const checkIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
const downloadIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V3zM5 19h14v2H5z"/></svg>';

const refinements=document.createElement('style');
refinements.textContent=`
  body{font-synthesis:none}

  /* The header is fixed, so its backdrop is re-filtered on every scrolled
     frame across the full width of the window: keep the radius small, skip
     saturate(), and carry the tint with the background instead. */
  .topbar{
    background:rgba(31,0,72,.82)!important;
    -webkit-backdrop-filter:blur(8px);
    backdrop-filter:blur(8px);
    border-bottom:1px solid rgba(255,255,255,.22)!important;
  }
  .mobile-nav{
    background:rgba(31,0,72,.96)!important;
  }

  .hero h1,.section-heading h2,.guild-sample,.guild-block .alphabet{text-transform:uppercase}
  .section-heading h2{text-wrap:balance}

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
    font-size:var(--fs-display);
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
  .hoves-block .alphabet{line-height:1.8;letter-spacing:var(--tracking-caps)}
  .font-download{border-top:0!important;padding-top:0!important}

  .logo-color-switch{display:none!important}
  .logo-canvas{overflow:hidden;transition:none!important;position:relative}
  .logo-art{display:block!important;position:relative;z-index:2;transition:opacity 250ms ${EASE}!important}
  .logo-card-tones{
    position:absolute;
    z-index:6;
    top:14px;
    left:14px;
    display:flex;
    gap:7px;
    align-items:center;
  }
  .logo-tone-button{
    position:relative;
    width:14px;
    height:14px;
    display:grid;
    place-items:center;
    padding:0;
    border:0;
    border-radius:999px;
    background:transparent;
    color:var(--purple);
    cursor:pointer;
    opacity:.42;
    transition:opacity 250ms ${EASE};
  }
  .logo-tone-button::before{
    content:"";
    width:12px;
    height:12px;
    border-radius:50%;
    background:var(--tone);
    border:1px solid currentColor;
    box-sizing:border-box;
  }
  .logo-tone-button:hover,.logo-tone-button:focus-visible{opacity:.72;transform:none}
  .logo-tone-button.is-active{opacity:1;background:transparent;box-shadow:none;transform:none}
  .logo-tone-button::after{content:"";position:absolute;inset:-15px -5px}
  .logo-canvas.is-dark-preview{color:var(--white)}
  .logo-canvas.is-dark-preview .logo-tone-button{color:var(--white)}
  .logo-canvas.is-dark-preview .logo-tone-button.is-active{background:transparent;box-shadow:none}
  .logo-canvas.is-dark-preview .logo-tone-button::before{border-color:currentColor}
  .logo-crossfade-layer{
    position:absolute!important;
    z-index:3!important;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    opacity:0;
    pointer-events:none;
    transition:opacity 250ms ${EASE}!important;
  }
  .logo-bg-crossfade{
    position:absolute;
    z-index:1;
    inset:0;
    opacity:0;
    pointer-events:none;
    transition:opacity 250ms ${EASE};
  }
  .logo-art.is-fading-out{opacity:0}
  .logo-crossfade-layer.is-fading-in,.logo-bg-crossfade.is-fading-in{opacity:1}

  .compact-zip-link{
    min-width:44px!important;
    min-height:44px!important;
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
    width:44px!important;
    height:44px!important;
    flex:0 0 44px;
    display:grid!important;
    place-items:center!important;
    border:1px solid currentColor!important;
    border-radius:999px!important;
    background:transparent!important;
    color:inherit!important;
    opacity:1!important;
    transition:transform 250ms ${EASE},opacity 250ms ${EASE}!important;
  }
  .color-copy-icon svg{width:18px!important;height:18px!important;fill:currentColor!important}
  .color-copy-icon:hover,.color-copy-icon:focus-visible{transform:translateY(-1px)}
  .color-deep .color-copy-icon:hover,.color-deep .color-copy-icon:focus-visible{background:var(--white)!important;color:var(--purple)!important}
  .color-lilac .color-copy-icon:hover,.color-lilac .color-copy-icon:focus-visible,
  .color-mist .color-copy-icon:hover,.color-mist .color-copy-icon:focus-visible{background:var(--purple)!important;color:var(--white)!important}

  .copy-value-stack{position:relative;display:grid;overflow:hidden;line-height:.9}
  .copy-value-stack>.color-hex,.copy-value-confirm{grid-area:1/1;display:block;transition:transform 250ms ${EASE},opacity 250ms ${EASE}}
  .copy-value-confirm{align-self:center;justify-self:start;transform:translateY(100%);opacity:0;font-size:var(--fs-small);line-height:1.1;letter-spacing:var(--tracking-caps);text-transform:uppercase}
  .color-primary.is-copy-confirmed .color-hex{transform:translateY(-100%);opacity:0}
  .color-primary.is-copy-confirmed .copy-value-confirm{transform:translateY(0);opacity:1}

  .material-download:hover .material-download-icon{background:var(--white)!important;color:var(--purple)!important;opacity:1!important}

  .desktop-break{display:none}
  @media(min-width:769px){.desktop-break{display:block}}

  /* restrained motion system */
  .scroll-progress{
    position:fixed;
    z-index:300;
    top:0;
    left:0;
    width:100%;
    height:1px;
    background:var(--lilac);
    transform:scaleX(0);
    transform-origin:left center;
    pointer-events:none;
  }
  @keyframes page-progress{to{transform:scaleX(1)}}
  @supports(animation-timeline:scroll()){
    .scroll-progress{animation:page-progress linear both;animation-timeline:scroll(root block)}
  }

  /* Reveals are opacity + transform only: nothing here may clip an element or
     take it out of layout, otherwise the scroll watcher can never measure it.
     No will-change either — it would keep a couple of dozen card-sized layers
     on the GPU for motion that plays once. */
  .reveal{
    opacity:0;
    transform:translateY(14px);
    transition:opacity 620ms ${EASE} var(--reveal-delay,0ms),transform 620ms ${EASE} var(--reveal-delay,0ms);
  }
  .reveal.is-revealed{opacity:1;transform:none}

  .line-reveal{position:relative}
  .line-reveal::after{
    content:"";
    position:absolute;
    left:0;
    right:0;
    bottom:-24px;
    height:1px;
    background:currentColor;
    opacity:.22;
    transform:scaleX(0);
    transform-origin:left center;
    transition:transform 700ms ${EASE};
  }
  .line-reveal.is-revealed::after{transform:scaleX(1)}

  @media(hover:hover){
    .color .codes button{opacity:.82;transform:translateY(4px);transition:opacity 250ms ${EASE},transform 250ms ${EASE}}
    .color:hover .codes button{opacity:1;transform:translateY(0)}
    .color .codes button:nth-child(1){transition-delay:0ms}
    .color .codes button:nth-child(2){transition-delay:40ms}
    .color .codes button:nth-child(3){transition-delay:80ms}
  }

  /* Type specimens: slower than the card reveals and started only once the
     specimen itself is well inside the viewport (see TYPE_TRIGGER).
     The specimen tightens its tracking, which relayouts while it plays, so the
     block is contained and the reflow cannot escape the card. */
  .font-stack .font-block{contain:layout paint}
  .guild-sample.type-reveal{opacity:0;transform:translateY(16px);transition:opacity 950ms ${EASE},transform 950ms ${EASE}}
  .guild-sample.type-reveal.is-revealed{opacity:1;transform:none}

  .type-line-mask{display:block;overflow:hidden}
  .type-line{display:block;transform:translateY(100%);opacity:0;transition:transform 950ms ${EASE} var(--line-delay,0ms),opacity 950ms ${EASE} var(--line-delay,0ms)}
  .hoves-sample.type-reveal.is-revealed .type-line{transform:none;opacity:1}

  .brand-section,.section-colors,.type-section,.section-projects,.files{position:relative;isolation:isolate}
  .brand-section>.shell,.section-colors>.shell,.type-section>.shell,.section-projects>.shell,.files>.shell{position:relative;z-index:1}

  @media(max-width:900px){
    /* The box takes the proportions of the glyph itself (the mask is trimmed to its bounds,
       so it touches the top and bottom of the hero), so the mask is
       never wider than its canvas — a narrower box slices the swoosh with a hard edge. */
    .hero::after{
      z-index:0;
      right:-30vw;
      top:0;
      width:auto;
      height:100%;
      aspect-ratio:384.2/417.8;
      opacity:.16;
      -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='273.7 323.4 384.2 417.8'%3E%3Cpath d='M657.9,741.2c-8.2-8-18.8-21.5-27.6-43.5l-149.6-374.3h-67.8c8.2,8,18.6,21.5,27.2,43.5l129.6,330.8c8.6,22,8.8,35.5,6.9,43.5h81.3Z'/%3E%3Cpath d='M273.7,741.2h73.4c39.9-176.2,155.4-236.2,265.4-247v-3.9c-91.8,6.8-260.2,46.3-338.8,250.9Z'/%3E%3C/svg%3E");
      mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='273.7 323.4 384.2 417.8'%3E%3Cpath d='M657.9,741.2c-8.2-8-18.8-21.5-27.6-43.5l-149.6-374.3h-67.8c8.2,8,18.6,21.5,27.2,43.5l129.6,330.8c8.6,22,8.8,35.5,6.9,43.5h81.3Z'/%3E%3Cpath d='M273.7,741.2h73.4c39.9-176.2,155.4-236.2,265.4-247v-3.9c-91.8,6.8-260.2,46.3-338.8,250.9Z'/%3E%3C/svg%3E");
      -webkit-mask-position:center;
      mask-position:center;
      -webkit-mask-size:100% 100%;
      mask-size:100% 100%;
    }
    .hero h1{grid-column:1/5;margin-top:64px;line-height:.92;position:relative;z-index:2}
    .hero .eyebrow,.hero-note,.hero-foot{position:relative;z-index:2}
    .hero-note{grid-column:1/5;align-self:start;margin:28px 0 0;max-width:300px}
    .hero-foot{grid-column:1/5;margin-top:72px}
    .logo-card-tones{top:11px;left:11px;gap:6px}
    .logo-tone-button{width:14px;height:14px}
    .logo-tone-button::before{width:12px;height:12px}
    .font-download .compact-zip-link{justify-self:start}
  }

  @media(prefers-reduced-motion:reduce){
    .reveal,.reveal.is-revealed,
    .guild-sample.type-reveal,.guild-sample.type-reveal.is-revealed,
    .type-line,.hoves-sample.type-reveal.is-revealed .type-line,
    .logo-art,.logo-crossfade-layer,.logo-bg-crossfade,.color-copy-icon,.copy-value-stack>*{
      animation:none!important;
      transition:none!important;
      opacity:1!important;
      transform:none!important;
    }
    .project .project-cover img,.project.reveal:not(.is-revealed) .project-cover img{transform:none!important;transition:none!important}
    .line-reveal::after,.line-reveal.is-revealed::after{animation:none!important;transition:none!important;transform:none!important}
    .scroll-progress{animation:none!important;transition:none!important;opacity:1!important;transform:none!important}
  }
`;
document.head.appendChild(refinements);

const heroEyebrow=document.querySelector('.hero .eyebrow');
if(heroEyebrow)heroEyebrow.textContent=heroEyebrow.textContent.replace(/^\s*0+\s*\/\s*/, '').trim();
document.querySelectorAll('.hero .page-no').forEach(node=>node.remove());

const guildSample=document.querySelector('.guild-sample');
if(guildSample)guildSample.textContent='О ПРОЕКТЕ';
const guildAlphabet=document.querySelector('.guild-block .alphabet');
if(guildAlphabet)guildAlphabet.textContent='АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const hovesAlphabet=document.querySelector('.hoves-block .alphabet');
if(hovesAlphabet)hovesAlphabet.textContent='Аа Бб Вв Гг Дд Ее Ёё Жж Зз Ии Йй Кк Лл Мм Нн Оо Пп Рр Сс Тт Уу Фф Хх Цц Чч Шш Щщ Ъъ Ыы Ьь Ээ Юю Яя';

const colorIntro=document.querySelector('.section-colors .section-intro');
if(colorIntro){
  colorIntro.innerHTML='Сине-фиолетовый оттенок — доминирующий. <span class="desktop-break"></span>Сиреневый и светло-сиреневый дополняют основную палитру.';
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

/* Copy controls: retain the compact icon, and move HEX out while “Скопировано” moves in. */
document.querySelectorAll('.color-primary').forEach(primary=>{
  const hex=primary.querySelector('.color-hex');
  const button=primary.querySelector('[data-copy]');
  if(!hex||!button)return;
  button.className='color-copy-icon';
  button.setAttribute('aria-label',`Скопировать ${hex.textContent.trim()}`);
  button.setAttribute('title',`Скопировать ${hex.textContent.trim()}`);
  button.innerHTML=copyIcon;
  const stack=document.createElement('span');
  stack.className='copy-value-stack';
  hex.before(stack);
  stack.appendChild(hex);
  const confirmation=document.createElement('span');
  confirmation.className='copy-value-confirm';
  confirmation.textContent='Скопировано';
  stack.appendChild(confirmation);
  primary.insertBefore(button,stack);
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
      const primary=btn.closest('.color-primary');
      btn.innerHTML=checkIcon;
      btn.classList.add('is-copied');
      primary?.classList.add('is-copy-confirmed');
      clearTimeout(btn._copyTimer);
      btn._copyTimer=setTimeout(()=>{
        btn.innerHTML=copyIcon;
        btn.classList.remove('is-copied');
        primary?.classList.remove('is-copy-confirmed');
      },1200);
    }
    showToast(`Скопировано: ${value}`);
  }catch{showToast(value)}
}));

/* Logo cards: every card is a small state machine of version × colour. The image
   changes through one opacity crossfade; the committed image is only replaced once
   the fade has finished, so rapid clicks can never leave a half-switched card. */
const logoTones=[
  {key:'Deep_Purple',data:'Purple',label:'Фиолетовый',preview:'#E9E9F5',dark:false},
  {key:'White',data:'White',label:'Белый',preview:'#1F0048',dark:true}
];
const logoVersions={
  with:{type:'AURIX_With_Descriptor',cls:'logo-art-lockup',label:'с дескриптором'},
  without:{type:'AURIX_Wordmark',cls:'logo-art-wordmark',label:'без дескриптора'},
  symbol:{type:'AURIX_Symbol',cls:'logo-art-symbol',label:'фирменный знак'}
};

/* The lockup is one inline SVG: the wordmark and the descriptor are separate groups.
   Switching the descriptor off slides it away under a clip while the wordmark moves
   to the centre; colour is plain currentColor, so the canvas transition recolours it. */
function initLockupCard(card,canvas,download){
  const toggle=card.querySelector('.desc-switch');
  const label=card.querySelector('[data-desc-label]');
  const svg=card.querySelector('.logo-svg');
  const controls=document.createElement('div');
  controls.className='logo-card-tones';
  controls.setAttribute('role','group');
  controls.setAttribute('aria-label','Цвет логотипа');
  let tone=logoTones[0];
  let descriptor=true;

  function update(){
    card.classList.toggle('desc-off',!descriptor);
    toggle.setAttribute('aria-checked',String(descriptor));
    canvas.style.background=tone.preview;
    canvas.classList.toggle('is-dark-preview',tone.dark);
    const version=descriptor?logoVersions.with:logoVersions.without;
    if(label)label.textContent=descriptor?'С дескриптором':'Без дескриптора';
    svg.setAttribute('aria-label',descriptor?'AURIX — Discover Stars':'AURIX');
    const archive=`${version.type}_${tone.key}.zip`;
    const hint=`Скачать ${version.label}, ${tone.label.toLowerCase()}: SVG, PNG и PDF`;
    download.href=`./downloads/${archive}`;
    download.setAttribute('download',archive);
    download.setAttribute('aria-label',hint);
    download.setAttribute('title',hint);
    controls.querySelectorAll('.logo-tone-button').forEach(button=>{
      const active=button.dataset.tone===tone.key;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
  }

  logoTones.forEach(item=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='logo-tone-button';
    button.dataset.tone=item.key;
    button.style.setProperty('--tone',item.key==='White'?'#FFFFFF':'#1F0048');
    button.setAttribute('aria-label',item.label);
    button.setAttribute('title',item.label);
    button.addEventListener('click',()=>{tone=item;update()});
    controls.appendChild(button);
  });
  toggle.addEventListener('click',()=>{descriptor=!descriptor;update()});
  canvas.appendChild(controls);
  download.innerHTML=`ZIP <b class="inline-download-icon" aria-hidden="true">${downloadIcon}</b>`;
  update();
}

document.querySelectorAll('.logo-variant').forEach(card=>{
  const canvas=card.querySelector('.logo-canvas');
  const img=canvas?.querySelector('img.logo-art');
  const download=card.querySelector('[data-logo-download]');
  if(card.hasAttribute('data-lockup')){
    initLockupCard(card,canvas,download);
    return;
  }
  if(!canvas||!img||!download)return;

  const versions=(card.dataset.variants||'with').split(',').filter(key=>logoVersions[key]);
  const switchButtons=[...card.querySelectorAll('[data-variant]')];
  const controls=document.createElement('div');
  controls.className='logo-card-tones';
  controls.setAttribute('role','group');
  controls.setAttribute('aria-label','Цвет логотипа');
  const toneButtons=new Map();

  let shown={version:versions[0],tone:logoTones[0]}; /* what the committed <img> displays */
  let timer=0;

  const sourceOf=state=>img.dataset[`${state.version}${state.tone.data}`]||img.src;
  const sameState=(a,b)=>a.version===b.version&&a.tone.key===b.tone.key;

  function syncControls(state){
    toneButtons.forEach((button,key)=>{
      button.classList.toggle('is-active',key===state.tone.key);
      button.setAttribute('aria-pressed',String(key===state.tone.key));
    });
    switchButtons.forEach(button=>{
      const active=button.dataset.variant===state.version;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    const archive=`${logoVersions[state.version].type}_${state.tone.key}.zip`;
    const hint=`Скачать ${logoVersions[state.version].label}, ${state.tone.label.toLowerCase()}: SVG, PNG и PDF`;
    download.href=`./downloads/${archive}`;
    download.setAttribute('download',archive);
    download.setAttribute('aria-label',hint);
    download.setAttribute('title',hint);
  }

  function clearLayers(){
    clearTimeout(timer);
    canvas.querySelectorAll('.logo-crossfade-layer,.logo-bg-crossfade').forEach(node=>node.remove());
    img.classList.remove('is-fading-out');
  }

  function commit(state){
    img.className=`logo-art ${logoVersions[state.version].cls}`;
    img.src=sourceOf(state);
    canvas.style.background=state.tone.preview;
    canvas.classList.toggle('is-dark-preview',state.tone.dark);
    clearLayers();
    shown=state;
  }

  function go(state,instant=false){
    syncControls(state);
    clearLayers();
    if(instant){commit(state);return}
    if(sameState(shown,state))return;

    const layer=new Image();
    layer.className=`logo-art ${logoVersions[state.version].cls} logo-crossfade-layer`;
    layer.alt='';
    layer.setAttribute('aria-hidden','true');
    layer.src=sourceOf(state);
    canvas.appendChild(layer);
    const toneChanged=shown.tone.key!==state.tone.key;
    let bg=null;
    if(toneChanged){
      bg=document.createElement('span');
      bg.className='logo-bg-crossfade';
      bg.style.background=state.tone.preview;
      canvas.insertBefore(bg,canvas.firstChild);
    }
    requestAnimationFrame(()=>{
      img.classList.add('is-fading-out');
      layer.classList.add('is-fading-in');
      bg?.classList.add('is-fading-in');
    });
    timer=setTimeout(()=>commit(state),260);
  }

  /* The requested state is the last click, not the last committed image. */
  let wanted={...shown};
  logoTones.forEach(tone=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='logo-tone-button';
    button.style.setProperty('--tone',tone.key==='White'?'#FFFFFF':'#1F0048');
    button.setAttribute('aria-label',tone.label);
    button.setAttribute('title',tone.label);
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>{wanted={...wanted,tone};go(wanted)});
    toneButtons.set(tone.key,button);
    controls.appendChild(button);
  });
  switchButtons.forEach(button=>button.addEventListener('click',()=>{
    if(!logoVersions[button.dataset.variant])return;
    wanted={...wanted,version:button.dataset.variant};
    go(wanted);
  }));

  canvas.appendChild(controls);
  download.innerHTML=`ZIP <b class="inline-download-icon" aria-hidden="true">${downloadIcon}</b>`;
  requestAnimationFrame(()=>go(wanted,true));
});

document.querySelector('.logo-color-switch')?.remove();
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

const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Typography line masks. */
const hovesSample=document.querySelector('.hoves-sample');
if(hovesSample&&!prefersReduced){
  const lines=hovesSample.innerHTML.split(/<br\s*\/?\s*>/i).map(line=>line.trim()).filter(Boolean);
  if(lines.length){
    hovesSample.innerHTML=lines.map((line,index)=>`<span class="type-line-mask"><span class="type-line" style="--line-delay:${index*150}ms">${line}</span></span>`).join('');
  }
}

/* Motion classes are added only when motion will actually run, so a page
   without JS — or with reduced motion — never ends up with hidden content. */
const motionTargets=[];
function addMotion(el,className,trigger,delay){
  if(!el||el.dataset.motion)return;
  el.dataset.motion='1';
  el.classList.add(className);
  if(delay)el.style.setProperty('--reveal-delay',`${delay}ms`);
  motionTargets.push({el,trigger});
}
/* Fraction of the viewport an element must reach before it plays.
   Lower value = starts later (element sits higher up the screen). */
const CARD_TRIGGER=.88;
const TYPE_TRIGGER=.62;

if(!prefersReduced){
  [
    [...document.querySelectorAll('.logo-variant')],
    [...document.querySelectorAll('.palette .color')],
    [...document.querySelectorAll('.font-stack .font-block')],
    [...document.querySelectorAll('.file-list a')]
  ].forEach(group=>group.forEach((el,index)=>addMotion(el,'reveal',CARD_TRIGGER,Math.min(index,3)*70)));
  /* Project covers arrive row by row: left card first, its neighbour a beat later. */
  document.querySelectorAll('.projects .project').forEach((el,index)=>addMotion(el,'reveal',CARD_TRIGGER,el.classList.contains('project-wide')?0:((index+1)%2)*90));
  document.querySelectorAll('.projects-all').forEach(el=>addMotion(el,'reveal',CARD_TRIGGER,0));
  document.querySelectorAll('.section-heading h2,.section-heading .section-intro,.font-download,.logo-rule').forEach(el=>addMotion(el,'reveal',CARD_TRIGGER,0));
  document.querySelectorAll('.section-heading').forEach(el=>addMotion(el,'line-reveal',CARD_TRIGGER,0));
  addMotion(guildSample,'type-reveal',TYPE_TRIGGER,0);
  addMotion(hovesSample,'type-reveal',TYPE_TRIGGER,0);
}

/* The active section is marked with aria-current; the colour comes from CSS. */
const nav=document.querySelector('.nav');
const navLinks=nav?[...nav.querySelectorAll('a[href^="#"]')]:[];

/* Page progress: CSS scroll timeline when available, rAF scroll fallback otherwise. */
const progress=document.createElement('span');
progress.className='scroll-progress';
progress.setAttribute('aria-hidden','true');
document.body.appendChild(progress);
const supportsScrollTimeline=CSS.supports?.('animation-timeline: scroll()')===true;
if(!supportsScrollTimeline){
  let progressTick=false;
  const updateProgress=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const value=Math.min(1,Math.max(0,scrollY/max));
    progress.style.transform=`scaleX(${value})`;
    progressTick=false;
  };
  addEventListener('scroll',()=>{if(!progressTick){progressTick=true;requestAnimationFrame(updateProgress)}},{passive:true});
  addEventListener('resize',updateProgress,{passive:true});
  updateProgress();
}

/* One deterministic pass drives every reveal: a target plays once, when its top
   crosses its own trigger line. Positions are measured up front and only
   remeasured when the layout can actually have changed, so scrolling itself
   reads nothing from the layout tree and can never force a reflow. */
if(prefersReduced){
  motionTargets.forEach(target=>target.el.classList.add('is-revealed'));
}else{
  let pending=motionTargets.slice();
  let queued=false;
  let docHeight=0;
  const measure=()=>{
    docHeight=document.documentElement.scrollHeight;
    pending.forEach(target=>{target.top=target.el.getBoundingClientRect().top+scrollY});
  };
  const updateMotion=()=>{
    queued=false;
    if(!pending.length)return;
    const height=innerHeight||document.documentElement.clientHeight;
    /* Nothing below can move any closer once the page bottom is reached, so
       whatever is left must play rather than stay invisible. */
    const atEnd=scrollY+height>=docHeight-2;
    const rest=[];
    pending.forEach(target=>{
      if(atEnd||target.top<scrollY+height*target.trigger)target.el.classList.add('is-revealed');
      else rest.push(target);
    });
    pending=rest;
  };
  const scheduleMotion=()=>{if(!queued){queued=true;requestAnimationFrame(updateMotion)}};
  const remeasure=()=>{measure();scheduleMotion()};
  measure();
  addEventListener('scroll',scheduleMotion,{passive:true});
  addEventListener('resize',remeasure,{passive:true});
  addEventListener('load',remeasure);
  /* Web fonts land after first paint and shift everything below them. */
  document.fonts?.ready.then(remeasure);
  scheduleMotion();
}

/* Soft parallax for the project covers. The picture sits in a wrapper 16% taller than
   its frame and drifts by at most ±6% of the frame height, slower than the page. Only
   covers near the viewport are updated, in one rAF pass, with no layout reads besides
   the frame rectangles. */
if(!prefersReduced){
  const covers=[...document.querySelectorAll('.project-cover')]
    .map(frame=>({frame,layer:frame.querySelector('.project-par'),near:false}))
    .filter(item=>item.layer);
  if(covers.length){
    let parallaxQueued=false;
    const drift=()=>{
      parallaxQueued=false;
      const vh=innerHeight||document.documentElement.clientHeight;
      covers.forEach(item=>{
        if(!item.near)return;
        const rect=item.frame.getBoundingClientRect();
        const progress=Math.max(-1,Math.min(1,(rect.top+rect.height/2-vh/2)/(vh/2+rect.height/2)));
        item.layer.style.setProperty('--par',`${(-progress*rect.height*.06).toFixed(1)}px`);
      });
    };
    const queueDrift=()=>{if(!parallaxQueued){parallaxQueued=true;requestAnimationFrame(drift)}};
    const nearObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const item=covers.find(candidate=>candidate.frame===entry.target);
        if(item)item.near=entry.isIntersecting;
      });
      queueDrift();
    },{rootMargin:'120px 0px'});
    covers.forEach(item=>nearObserver.observe(item.frame));
    addEventListener('scroll',queueDrift,{passive:true});
    addEventListener('resize',queueDrift,{passive:true});
  }
}

/* Keep aria-current on the nav link of the section in view. */
const currentSectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    navLinks.forEach(link=>link.removeAttribute('aria-current'));
    const active=navLinks.find(link=>link.getAttribute('href')===`#${entry.target.id}`);
    if(active)active.setAttribute('aria-current','true');
  });
},{rootMargin:'-20% 0px -65% 0px',threshold:0});
['logo','colors','type','projects','files'].forEach(id=>{const section=document.getElementById(id);if(section)currentSectionObserver.observe(section)});
