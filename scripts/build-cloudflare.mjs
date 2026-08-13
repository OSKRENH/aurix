import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import JSZip from 'jszip';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist-site');
const LOGOS = path.join(ROOT, 'assets', 'logos');
const DOWNLOADS = path.join(DIST, 'downloads');

const STATIC_FILES = [
  'index.html',
  'brandbook.html',
  'app.js',
  'fonts.css',
  'styles.css',
  'mobile-fix.css'
];

const TYPES = {
  With_Descriptor: {
    source: 'aurix-discover-stars.svg',
    label: 'AURIX_With_Descriptor',
    pngWidth: 2400
  },
  Wordmark: {
    source: 'wordmark-purple.svg',
    label: 'AURIX_Wordmark',
    pngWidth: 2400
  },
  Symbol: {
    source: 'symbol-purple.svg',
    label: 'AURIX_Symbol',
    pngWidth: 1600
  }
};

const TONES = {
  Deep_Purple: '#1F0048',
  White: '#FFFFFF'
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyFile(relative, destination = relative) {
  const from = path.join(ROOT, relative);
  const to = path.join(DIST, destination);
  await ensureDir(path.dirname(to));
  await fs.copyFile(from, to);
}

function recolorSvg(svg, color) {
  return svg.replace(/#1f0048(?:ff)?/gi, color);
}

function ascii85(buffer) {
  let out = '';
  for (let i = 0; i < buffer.length; i += 4) {
    const remaining = Math.min(4, buffer.length - i);
    let value = 0;
    for (let j = 0; j < 4; j++) value = value * 256 + (j < remaining ? buffer[i + j] : 0);
    if (remaining === 4 && value === 0) {
      out += 'z';
      continue;
    }
    const chars = new Array(5);
    for (let j = 4; j >= 0; j--) {
      chars[j] = String.fromCharCode((value % 85) + 33);
      value = Math.floor(value / 85);
    }
    out += chars.slice(0, remaining + 1).join('');
  }
  return out + '~>';
}

async function makePdf(png, width, height) {
  const doc = await PDFDocument.create();
  const image = await doc.embedPng(png);
  const page = doc.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });
  return Buffer.from(await doc.save());
}

async function makeEps(png) {
  // EPS is included only in the full download. A compact Flate-compressed RGB
  // image keeps Workers Builds self-contained without system packages such as
  // Inkscape/Poppler, while remaining a valid EPS file for interchange.
  const { data, info } = await sharp(png)
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .resize({ width: Math.min(1200, (await sharp(png).metadata()).width || 1200), withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const compressed = zlib.deflateSync(data, { level: 9 });
  const encoded = ascii85(compressed);
  const lines = encoded.match(/.{1,100}/g)?.join('\n') || encoded;
  const { width, height, channels } = info;
  if (channels !== 3) throw new Error(`Unexpected EPS channel count: ${channels}`);

  return Buffer.from(`%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 ${width} ${height}\n%%LanguageLevel: 3\n%%Pages: 1\n%%EndComments\n/Data currentfile /ASCII85Decode filter /FlateDecode filter def\n${width} ${height} 8\n[${width} 0 0 -${height} 0 ${height}]\n{ Data } false 3 colorimage\n${lines}\nshowpage\n%%EOF\n`, 'ascii');
}

async function makeLogoAsset(svgText, pngWidth) {
  const svg = Buffer.from(svgText, 'utf8');
  const rendered = await sharp(svg)
    .resize({ width: pngWidth, withoutEnlargement: false })
    .png()
    .toBuffer({ resolveWithObject: true });
  const png = rendered.data;
  const width = rendered.info.width;
  const height = rendered.info.height;
  const pdf = await makePdf(png, width, height);
  const eps = await makeEps(png);
  return { svg, png, pdf, eps };
}

async function writeZip(fileName, zip) {
  const data = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });
  await fs.writeFile(path.join(DOWNLOADS, fileName), data);
  return data;
}

async function buildLogoDownloads() {
  const full = new JSZip();
  const fullRoot = full.folder('AURIX_Logos_All_Formats');
  let exportedCount = 0;

  for (const [type, cfg] of Object.entries(TYPES)) {
    const sourceSvg = await fs.readFile(path.join(LOGOS, cfg.source), 'utf8');
    for (const [tone, color] of Object.entries(TONES)) {
      const baseName = `${cfg.label}_${tone}`;
      const svgText = recolorSvg(sourceSvg, color);
      const asset = await makeLogoAsset(svgText, cfg.pngWidth);

      const perCard = new JSZip();
      perCard.file(`${baseName}.svg`, asset.svg);
      perCard.file(`${baseName}.png`, asset.png);
      perCard.file(`${baseName}.pdf`, asset.pdf);
      await writeZip(`${baseName}.zip`, perCard);

      const folder = fullRoot.folder(type).folder(tone);
      folder.file(`${baseName}.svg`, asset.svg);
      folder.file(`${baseName}.png`, asset.png);
      folder.file(`${baseName}.pdf`, asset.pdf);
      folder.file(`${baseName}.eps`, asset.eps);
      exportedCount += 4;
    }
  }

  if (exportedCount !== 24) throw new Error(`Expected 24 logo exports, got ${exportedCount}`);

  fullRoot.file('README.txt', `AURIX — логотипы и фирменный символ в двух разрешённых цветах.\n\nТипы:\nWith_Descriptor — логотип AURIX + DISCOVER STARS\nWordmark — логотип AURIX без дескриптора\nSymbol — фирменный знак AURIX\n\nФорматы полного архива:\nSVG — редактируемый вектор\nPNG — прозрачный фон\nEPS — формат для профессиональной печати\nPDF — универсальный формат\n\nИндивидуальные архивы каждой карточки содержат SVG, PNG и PDF выбранного цвета.\n\nЦвета логотипа:\nDeep_Purple — #1F0048\nWhite — #FFFFFF\n\nНе изменяйте пропорции и взаимное расположение элементов логотипа.\n`);

  const all = await writeZip('AURIX_Logos_All_Formats.zip', full);
  await fs.writeFile(path.join(DOWNLOADS, 'AURIX_Logos.zip'), all);
}

async function buildFontDownload() {
  const guildName = 'GuildA-Display-Regular-Desktop.otf';
  const hovesName = 'TT Hoves Pro Trial Regular.ttf';
  const guild = await fs.readFile(path.join(ROOT, 'fonts', 'guild', guildName));
  const hoves = await fs.readFile(path.join(ROOT, 'fonts', 'tt-hoves-pro', hovesName));
  const zip = new JSZip();
  zip.file(guildName, guild);
  zip.file(hovesName, hoves);
  await writeZip('AURIX_Fonts.zip', zip);
}

async function buildStaticSite() {
  await fs.rm(DIST, { recursive: true, force: true });
  await ensureDir(DIST);

  for (const file of STATIC_FILES) await copyFile(file);

  await ensureDir(path.join(DIST, 'assets', 'logos'));
  for (const name of await fs.readdir(LOGOS)) {
    if (name.endsWith('.svg')) await copyFile(path.join('assets', 'logos', name));
  }

  await copyFile(
    path.join('fonts', 'guild', 'GuildA-Display-Regular-Desktop.otf'),
    path.join('fonts', 'guild', 'GuildA-Display-Regular-Desktop.otf')
  );
  await copyFile(
    path.join('fonts', 'tt-hoves-pro', 'TT Hoves Pro Trial Regular.ttf'),
    path.join('fonts', 'tt-hoves-pro', 'TT Hoves Pro Trial Regular.ttf')
  );

  await ensureDir(DOWNLOADS);
  await buildFontDownload();
  await buildLogoDownloads();

  const required = [
    'index.html',
    'downloads/AURIX_Fonts.zip',
    'downloads/AURIX_Logos.zip',
    'downloads/AURIX_Logos_All_Formats.zip',
    'downloads/AURIX_With_Descriptor_Deep_Purple.zip',
    'downloads/AURIX_With_Descriptor_White.zip',
    'downloads/AURIX_Wordmark_Deep_Purple.zip',
    'downloads/AURIX_Wordmark_White.zip',
    'downloads/AURIX_Symbol_Deep_Purple.zip',
    'downloads/AURIX_Symbol_White.zip'
  ];
  for (const file of required) {
    const stat = await fs.stat(path.join(DIST, file));
    if (!stat.size) throw new Error(`Generated file is empty: ${file}`);
  }

  console.log(`AURIX static build ready: ${DIST}`);
}

await buildStaticSite();
