(()=>{
  const EASE='cubic-bezier(.2,.7,.3,1)';
  const downloadIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.17l3.59-3.58L18 11l-6 6-6-6 1.41-1.41L11 13.17V3zM5 19h14v2H5z"/></svg>';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toneNames={light:'Светлая',dark:'Тёмная'};
  const fileTone={light:'Light',dark:'Dark'};
  const cityFiles={moscow:'Moscow',spb:'Saint_Petersburg'};

  document.querySelectorAll('.map-card').forEach((card,cardIndex)=>{
    let current='light';
    const layers=[...card.querySelectorAll('.map-preview-layer')];
    const buttons=[...card.querySelectorAll('.map-tone-button')];
    const links=[...card.querySelectorAll('[data-map-format]')];
    const city=card.dataset.city;

    const syncDownloads=(tone)=>{
      const cityName=cityFiles[city];
      if(!cityName)return;
      links.forEach(link=>{
        const format=link.dataset.mapFormat;
        const ext=format==='jpg'?'jpg':format;
        const file=`AURIX_Map_${cityName}_${fileTone[tone]}.${ext}`;
        link.href=`./downloads/maps/${file}`;
        link.setAttribute('download',file);
        link.setAttribute('aria-label',`Скачать ${card.dataset.label}, ${toneNames[tone]}, ${format.toUpperCase()}`);
      });
    };

    const applyTone=(tone)=>{
      if(tone===current)return;
      current=tone;
      layers.forEach(layer=>layer.classList.toggle('is-active',layer.dataset.tone===tone));
      buttons.forEach(button=>{
        const active=button.dataset.tone===tone;
        button.classList.toggle('is-active',active);
        button.setAttribute('aria-pressed',String(active));
      });
      syncDownloads(tone);
    };

    buttons.forEach(button=>button.addEventListener('click',()=>applyTone(button.dataset.tone)));
    links.forEach(link=>{link.innerHTML=`${link.dataset.mapFormat.toUpperCase()} <span aria-hidden="true">${downloadIcon}</span>`});
    syncDownloads(current);

    card.style.setProperty('--map-delay',`${cardIndex*70}ms`);
  });

  const revealTargets=[...document.querySelectorAll('.section-maps .section-heading,.map-card')];
  if(reduced){
    revealTargets.forEach(el=>el.classList.add('is-revealed'));
  }else{
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },{rootMargin:'0px 0px -14% 0px',threshold:.08});
    revealTargets.forEach(el=>observer.observe(el));
  }

  const mapsSection=document.getElementById('maps');
  const mapNav=document.querySelector('.nav a[href="#maps"]');
  const nav=document.querySelector('.nav');
  if(mapsSection&&mapNav&&nav){
    const activeObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        nav.querySelectorAll('a[href^="#"]').forEach(link=>link.removeAttribute('aria-current'));
        mapNav.setAttribute('aria-current','true');
        const indicator=nav.querySelector('.nav-active-indicator');
        if(indicator){
          const x=mapNav.offsetLeft+(mapNav.offsetWidth-28)/2;
          indicator.style.transform=`translateX(${Math.round(x)}px)`;
          indicator.classList.add('is-visible');
        }
      });
    },{rootMargin:'-20% 0px -65% 0px',threshold:0});
    activeObserver.observe(mapsSection);
  }
})();
