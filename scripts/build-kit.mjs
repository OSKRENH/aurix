import fs from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';
import sharp from 'sharp';
import opentype from 'opentype.js';
import { PDFDocument } from 'pdf-lib';

/* Builds the remaining downloads and the all-in-one kit. It runs after
   build-cloudflare.mjs (logos, fonts) and build-maps.mjs (maps). */

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist-site');
const DOWNLOADS = path.join(DIST, 'downloads');
const hoves = opentype.loadSync(path.join(ROOT, 'fonts', 'tt-hoves-pro', 'TT Hoves Pro Trial Regular.ttf'));

const COLORS = [
  { slug: 'Deep_Purple', name: 'Тёмно-фиолетовый', hex: '#1F0048', pantone: '2695 C', cmyk: '95 / 100 / 25 / 50', rgb: [31, 0, 72], onDark: true },
  { slug: 'Lilac', name: 'Сиреневый', hex: '#A7A4DF', pantone: '2705 C', cmyk: '30 / 30 / 0 / 0', rgb: [167, 164, 223] },
  { slug: 'Mist', name: 'Светло-сиреневый', hex: '#E9E9F5', pantone: '7443 EC', cmyk: '9 / 8 / 0 / 1', rgb: [233, 233, 245] }
];
const PURPLE = '#1F0048';

const COVERS = {
  omega: 'Residence_Omega',
  ldm: 'LDM',
  mariinka: 'Mariinka_Deluxe',
  ordynka: 'Bolshaya_Ordynka_25',
  zemled: 'Zemledelcheskiy_15',
  polyanka: 'Malaya_Polyanka_3'
};

async function writeZip(fileName, zip) {
  const data = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  await fs.writeFile(path.join(DOWNLOADS, fileName), data);
  return data;
}

async function makePdf(png, width, height) {
  const doc = await PDFDocument.create();
  const image = await doc.embedPng(png);
  const page = doc.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });
  return Buffer.from(await doc.save());
}

/* Text becomes outlines, so the sheet carries the brand typeface without any installed font. */
function text(value, x, y, size, fill) {
  return `<path d="${hoves.getPath(value, x, y, size).toPathData(2)}" fill="${fill}"/>`;
}

function paletteSheet() {
  const W = 2400, H = 1500, pad = 80, gap = 40, inner = 64;
  const leftW = 1320, rightX = pad + leftW + gap, rightW = W - pad - rightX;
  const rightH = (H - pad * 2 - gap) / 2;
  const frames = [
    { c: COLORS[0], x: pad, y: pad, w: leftW, h: H - pad * 2 },
    { c: COLORS[1], x: rightX, y: pad, w: rightW, h: rightH },
    { c: COLORS[2], x: rightX, y: pad + rightH + gap, w: rightW, h: rightH }
  ];
  const parts = [`<rect width="${W}" height="${H}" fill="#FFFFFF"/>`];
  for (const { c, x, y, w, h } of frames) {
    const ink = c.onDark ? '#FFFFFF' : PURPLE;
    const border = c.slug === 'Lilac' || c.slug === 'Mist' ? ` stroke="${PURPLE}" stroke-width="2"` : '';
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c.hex}"${border}/>`);
    parts.push(text(c.hex, x + inner, y + inner + 92, 120, ink));
    parts.push(text(c.name.toUpperCase(), x + inner, y + inner + 92 + 64, 28, ink));
    const rows = [['PANTONE', c.pantone], ['CMYK', c.cmyk], ['RGB', c.rgb.join(' / ')]];
    const rowH = 88;
    const top = y + h - inner - rows.length * rowH;
    rows.forEach(([label, value], i) => {
      const ry = top + i * rowH;
      parts.push(`<rect x="${x + inner}" y="${ry}" width="${w - inner * 2}" height="1.5" fill="${ink}" opacity=".55"/>`);
      parts.push(text(label, x + inner, ry + 56, 28, ink));
      parts.push(text(value, x + inner + 360, ry + 56, 28, ink));
    });
    parts.push(`<rect x="${x + inner}" y="${top + rows.length * rowH}" width="${w - inner * 2}" height="1.5" fill="${ink}" opacity=".55"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${parts.join('')}</svg>`;
}

/* Adobe Swatch Exchange: RGB global-less swatches. */
function swatchExchange(colors) {
  const chunks = [];
  const header = Buffer.alloc(12);
  header.write('ASEF', 0, 'ascii');
  header.writeUInt16BE(1, 4);
  header.writeUInt16BE(0, 6);
  header.writeUInt32BE(colors.length, 8);
  chunks.push(header);
  for (const c of colors) {
    const name = `AURIX ${c.name} ${c.hex}`;
    const nameBytes = Buffer.alloc((name.length + 1) * 2);
    for (let i = 0; i < name.length; i++) nameBytes.writeUInt16BE(name.charCodeAt(i), i * 2);
    const body = Buffer.alloc(2 + nameBytes.length + 4 + 12 + 2);
    let o = 0;
    body.writeUInt16BE(name.length + 1, o); o += 2;
    nameBytes.copy(body, o); o += nameBytes.length;
    body.write('RGB ', o, 'ascii'); o += 4;
    for (const v of c.rgb) { body.writeFloatBE(v / 255, o); o += 4; }
    body.writeUInt16BE(2, o);
    const block = Buffer.alloc(6 + body.length);
    block.writeUInt16BE(0x0001, 0);
    block.writeUInt32BE(body.length, 2);
    body.copy(block, 6);
    chunks.push(block);
  }
  return Buffer.concat(chunks);
}

async function buildColors() {
  const zip = new JSZip();
  const root = zip.folder('AURIX_Colors');
  const sheetSvg = Buffer.from(paletteSheet(), 'utf8');
  const sheetPng = await sharp(sheetSvg).png().toBuffer({ resolveWithObject: true });
  root.file('AURIX_Palette.svg', sheetSvg);
  root.file('AURIX_Palette.png', sheetPng.data);
  root.file('AURIX_Palette.pdf', await makePdf(sheetPng.data, sheetPng.info.width, sheetPng.info.height));
  root.file('AURIX_Palette.ase', swatchExchange(COLORS));

  const swatches = root.folder('Swatches');
  for (const c of COLORS) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000"><rect width="1000" height="1000" fill="${c.hex}"/></svg>`;
    swatches.file(`AURIX_${c.slug}_${c.hex.slice(1)}.svg`, svg);
    swatches.file(`AURIX_${c.slug}_${c.hex.slice(1)}.png`, await sharp({ create: { width: 1000, height: 1000, channels: 3, background: c.hex } }).png().toBuffer());
  }

  root.file('AURIX_Palette.css', `:root {\n${COLORS.map(c => `  --aurix-${c.slug.toLowerCase().replace('_', '-')}: ${c.hex};`).join('\n')}\n}\n`);
  root.file('README.txt', [
    'AURIX — фирменная палитра',
    '',
    ...COLORS.flatMap(c => [`${c.name}`, `  HEX      ${c.hex}`, `  PANTONE  ${c.pantone}`, `  CMYK     ${c.cmyk}`, `  RGB      ${c.rgb.join(' / ')}`, '']),
    'Файлы: AURIX_Palette (SVG, PNG, PDF) — карточки цветов как на сайте;',
    'AURIX_Palette.ase — образцы для Adobe Photoshop, Illustrator, InDesign;',
    'AURIX_Palette.css — переменные для вёрстки; Swatches — плашки по одному цвету.',
    'Текст: только тёмно-фиолетовый или белый, в зависимости от фона.',
    ''
  ].join('\n'));
  await writeZip('AURIX_Colors.zip', zip);
}

async function buildMaps() {
  const dir = path.join(DOWNLOADS, 'maps');
  const zip = new JSZip();
  const root = zip.folder('AURIX_Maps');
  const files = (await fs.readdir(dir)).filter(name => /\.(jpg|svg|pdf)$/.test(name)).sort();
  if (files.length !== 12) throw new Error(`Expected 12 map files, found ${files.length}`);
  for (const name of files) root.file(name, await fs.readFile(path.join(dir, name)));
  root.file('README.txt', 'AURIX — фирменные карты Москвы и Санкт-Петербурга.\nСветлая и тёмная версия каждой карты: JPG (3840 px), SVG, PDF.\n');
  await writeZip('AURIX_Maps.zip', zip);
}

async function buildCovers() {
  const zip = new JSZip();
  const root = zip.folder('AURIX_Project_Covers');
  for (const [slug, title] of Object.entries(COVERS)) {
    const source = path.join(ROOT, 'assets', 'projects', `${slug}-1600.webp`);
    root.file(`AURIX_${title}.jpg`, await sharp(source).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toBuffer());
  }
  root.file('README.txt', 'AURIX — обложки проектов (JPG, 1600 px по ширине). Полные рендеры лежат в папках на Яндекс Диске и Google Диске, ссылки на сайте в разделе «Проекты».\n');
  await writeZip('AURIX_Project_Covers.zip', zip);
}

async function copyInto(kit, folderName, zipFile, stripRoot) {
  const source = await JSZip.loadAsync(await fs.readFile(path.join(DOWNLOADS, zipFile)));
  const target = kit.folder(folderName);
  for (const [entry, file] of Object.entries(source.files)) {
    if (file.dir) continue;
    const relative = entry.startsWith(`${stripRoot}/`) ? entry.slice(stripRoot.length + 1) : entry;
    target.file(relative, await file.async('nodebuffer'));
  }
}

async function buildKit() {
  const zip = new JSZip();
  const kit = zip.folder('AURIX_Brand_Kit');
  await copyInto(kit, '01_Logos', 'AURIX_Logos_All_Formats.zip', 'AURIX_Logos_All_Formats');
  const fonts = kit.folder('02_Fonts');
  const fontZip = await JSZip.loadAsync(await fs.readFile(path.join(DOWNLOADS, 'AURIX_Fonts.zip')));
  for (const [entry, file] of Object.entries(fontZip.files)) if (!file.dir) fonts.file(entry, await file.async('nodebuffer'));
  await copyInto(kit, '03_Colors', 'AURIX_Colors.zip', 'AURIX_Colors');
  await copyInto(kit, '04_Maps', 'AURIX_Maps.zip', 'AURIX_Maps');
  await copyInto(kit, '05_Project_Covers', 'AURIX_Project_Covers.zip', 'AURIX_Project_Covers');
  kit.file('README.txt', [
    'AURIX — комплект материалов бренда',
    '',
    '01_Logos           логотип с дескриптором, без него и символ: SVG, PNG, PDF, EPS; фиолетовый и белый',
    '02_Fonts           Guild A Display и TT Hoves Pro (Regular)',
    '03_Colors          палитра: карточки цветов, образцы ASE, CSS, значения HEX / PANTONE / CMYK / RGB',
    '04_Maps           карты Москвы и Санкт-Петербурга: светлая и тёмная, JPG / SVG / PDF',
    '05_Project_Covers обложки проектов, JPG',
    '',
    'Руководство: https://aurix.ivankamaldinov.workers.dev',
    ''
  ].join('\n'));
  const data = await writeZip('AURIX_Brand_Kit.zip', zip);
  const entries = Object.values(zip.files).filter(f => !f.dir).length;
  console.log(`AURIX brand kit ready: ${entries} files, ${(data.length / 1048576).toFixed(1)} MB`);
}

await buildColors();
await buildMaps();
await buildCovers();
await buildKit();

for (const file of ['AURIX_Colors.zip', 'AURIX_Maps.zip', 'AURIX_Project_Covers.zip', 'AURIX_Brand_Kit.zip']) {
  const stat = await fs.stat(path.join(DOWNLOADS, file));
  if (!stat.size) throw new Error(`Generated file is empty: ${file}`);
}
