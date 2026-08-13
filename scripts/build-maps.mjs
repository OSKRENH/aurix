import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

const ROOT=process.cwd();
const DIST=path.join(ROOT,'dist-site');
const SRC=path.join(ROOT,'assets','maps');
const OUT_ASSETS=path.join(DIST,'assets','maps');
const OUT_DOWNLOADS=path.join(DIST,'downloads','maps');

const MAPS={
  Moscow:{label:'Москва',light:'moscow-light.svg',dark:'moscow-dark.svg'},
  Saint_Petersburg:{label:'Санкт-Петербург',light:'spb-light.svg',dark:'spb-dark.svg'}
};

const SECTION=`
<section class="brand-section section-maps theme-white" id="maps">
  <span class="section-number-sticky" aria-hidden="true">05</span>
  <div class="shell"><div class="grid">
    <header class="section-heading">
      <div class="section-kicker">05 / КАРТЫ</div>
      <h2>Карты</h2>
      <p class="section-intro">Фирменные карты Москвы и Санкт-Петербурга в светлой и тёмной версиях.</p>
    </header>
    <div class="map-grid" aria-label="Фирменные карты AURIX">
      <article class="map-card" data-city="moscow" data-label="Москва">
        <div class="map-canvas">
          <img class="map-preview-layer is-active" data-tone="light" src="./assets/maps/moscow-light.svg" alt="Карта Москвы, светлая версия">
          <img class="map-preview-layer" data-tone="dark" src="./assets/maps/moscow-dark.svg" alt="Карта Москвы, тёмная версия">
          <span class="map-index">КАРТА / 01</span>
          <div class="map-tone-switch" role="group" aria-label="Цвет карты Москвы">
            <button class="map-tone-button is-active" type="button" data-tone="light" style="--tone:#E5E5F3" aria-label="Светлая" aria-pressed="true"></button>
            <button class="map-tone-button" type="button" data-tone="dark" style="--tone:#1F0048" aria-label="Тёмная" aria-pressed="false"></button>
          </div>
        </div>
        <div class="map-meta"><div class="map-copy"><span>КАРТА / 01</span><strong>Москва</strong></div><div class="map-downloads" aria-label="Скачать карту Москвы"><a data-map-format="jpg" href="./downloads/maps/AURIX_Map_Moscow_Light.jpg" download>JPG</a><a data-map-format="svg" href="./downloads/maps/AURIX_Map_Moscow_Light.svg" download>SVG</a><a data-map-format="pdf" href="./downloads/maps/AURIX_Map_Moscow_Light.pdf" download>PDF</a></div></div>
      </article>
      <article class="map-card" data-city="spb" data-label="Санкт-Петербург">
        <div class="map-canvas">
          <img class="map-preview-layer is-active" data-tone="light" src="./assets/maps/spb-light.svg" alt="Карта Санкт-Петербурга, светлая версия">
          <img class="map-preview-layer" data-tone="dark" src="./assets/maps/spb-dark.svg" alt="Карта Санкт-Петербурга, тёмная версия">
          <span class="map-index">КАРТА / 02</span>
          <div class="map-tone-switch" role="group" aria-label="Цвет карты Санкт-Петербурга">
            <button class="map-tone-button is-active" type="button" data-tone="light" style="--tone:#E5E5F3" aria-label="Светлая" aria-pressed="true"></button>
            <button class="map-tone-button" type="button" data-tone="dark" style="--tone:#1F0048" aria-label="Тёмная" aria-pressed="false"></button>
          </div>
        </div>
        <div class="map-meta"><div class="map-copy"><span>КАРТА / 02</span><strong>Санкт-Петербург</strong></div><div class="map-downloads" aria-label="Скачать карту Санкт-Петербурга"><a data-map-format="jpg" href="./downloads/maps/AURIX_Map_Saint_Petersburg_Light.jpg" download>JPG</a><a data-map-format="svg" href="./downloads/maps/AURIX_Map_Saint_Petersburg_Light.svg" download>SVG</a><a data-map-format="pdf" href="./downloads/maps/AURIX_Map_Saint_Petersburg_Light.pdf" download>PDF</a></div></div>
      </article>
    </div>
  </div></div>
</section>`;

async function ensure(dir){await fs.mkdir(dir,{recursive:true})}

async function makePdf(jpg,width,height){
  const doc=await PDFDocument.create();
  const image=await doc.embedJpg(jpg);
  const pageWidth=1920;
  const pageHeight=pageWidth*(height/width);
  const page=doc.addPage([pageWidth,pageHeight]);
  page.drawImage(image,{x:0,y:0,width:pageWidth,height:pageHeight});
  return Buffer.from(await doc.save());
}

async function exportMap(cityKey,tone,sourceName){
  const sourcePath=path.join(SRC,sourceName);
  const svg=await fs.readFile(sourcePath);
  const rendered=await sharp(svg).resize({width:3840,withoutEnlargement:false}).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toBuffer({resolveWithObject:true});
  const titleTone=tone==='light'?'Light':'Dark';
  const base=`AURIX_Map_${cityKey}_${titleTone}`;
  const pdf=await makePdf(rendered.data,rendered.info.width,rendered.info.height);
  await Promise.all([
    fs.writeFile(path.join(OUT_DOWNLOADS,`${base}.jpg`),rendered.data),
    fs.writeFile(path.join(OUT_DOWNLOADS,`${base}.svg`),svg),
    fs.writeFile(path.join(OUT_DOWNLOADS,`${base}.pdf`),pdf)
  ]);
}

async function inject(file){
  const target=path.join(DIST,file);
  let html=await fs.readFile(target,'utf8');
  if(!html.includes('maps.css')) html=html.replace('</head>','  <link rel="stylesheet" href="./maps.css">\n</head>');
  html=html.replaceAll('<a href="#files">Файлы</a>','<a href="#files">Файлы</a>\n      <a href="#maps">Карты</a>');
  if(!html.includes('id="maps"')) html=html.replace('</main>',`${SECTION}\n  </main>`);
  if(!html.includes('maps.js')) html=html.replace('</body>','  <script src="./maps.js"></script>\n</body>');
  await fs.writeFile(target,html);
}

await ensure(OUT_ASSETS);
await ensure(OUT_DOWNLOADS);
await Promise.all([
  fs.copyFile(path.join(ROOT,'maps.css'),path.join(DIST,'maps.css')),
  fs.copyFile(path.join(ROOT,'maps.js'),path.join(DIST,'maps.js'))
]);
for(const name of await fs.readdir(SRC)) if(name.endsWith('.svg')) await fs.copyFile(path.join(SRC,name),path.join(OUT_ASSETS,name));
for(const [cityKey,cfg] of Object.entries(MAPS)){
  await exportMap(cityKey,'light',cfg.light);
  await exportMap(cityKey,'dark',cfg.dark);
}
for(const file of ['index.html','brandbook.html']) await inject(file);

for(const file of [
  'AURIX_Map_Moscow_Light.jpg','AURIX_Map_Moscow_Light.svg','AURIX_Map_Moscow_Light.pdf',
  'AURIX_Map_Moscow_Dark.jpg','AURIX_Map_Moscow_Dark.svg','AURIX_Map_Moscow_Dark.pdf',
  'AURIX_Map_Saint_Petersburg_Light.jpg','AURIX_Map_Saint_Petersburg_Light.svg','AURIX_Map_Saint_Petersburg_Light.pdf',
  'AURIX_Map_Saint_Petersburg_Dark.jpg','AURIX_Map_Saint_Petersburg_Dark.svg','AURIX_Map_Saint_Petersburg_Dark.pdf'
]){
  const stat=await fs.stat(path.join(OUT_DOWNLOADS,file));
  if(!stat.size) throw new Error(`Generated map file is empty: ${file}`);
}
console.log('AURIX maps section and downloads ready');
