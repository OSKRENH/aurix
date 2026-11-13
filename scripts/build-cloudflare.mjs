import fs from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist-site');
const LOGOS = path.join(ROOT, 'assets', 'logos');
const PROJECTS = path.join(ROOT, 'assets', 'projects');
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

async function makePdf(png, width, height) {
  const doc = await PDFDocument.create();
  const image = await doc.embedPng(png);
  const page = doc.addPage([width, height]);
  page.drawImage(image, { x: 0, y: 0, width, height });
  return Buffer.from(await doc.save());
}

async function makeEps(png) {
  // Keep Workers Builds fast and self-contained: EPS is a compact raster EPS
  // generated with Sharp + native Buffer hex encoding, with no Inkscape or
  // Poppler dependency. Per-card downloads remain SVG/PNG/PDF as before.
  const { data, info } = await sharp(png)
    .flatten({ background: '#ffffff' })
    .resize({ width: 480, withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels !== 3) throw new Error(`Unexpected EPS channel count: ${channels}`);
  const hex = data.toString('hex').match(/.{1,120}/g)?.join('\n') || '';

  return Buffer.from(`%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 ${width} ${height}\n%%LanguageLevel: 2\n%%Pages: 1\n%%EndComments\n/picstr ${width * 3} string def\n${width} ${height} 8\n[${width} 0 0 -${height} 0 ${height}]\n{ currentfile picstr readhexstring pop }\nfalse 3 colorimage\n${hex}\nshowpage\n%%EOF\n`, 'ascii');
}

async function makeLogoAsset(svgText, pngWidth, includeEps = true) {
  const svg = Buffer.from(svgText, 'utf8');
  const rendered = await sharp(svg)
    .resize({ width: pngWidth, withoutEnlargement: false })
    .png()
    .toBuffer({ resolveWithObject: true });
  const png = rendered.data;
  const width = rendered.info.width;
  const height = rendered.info.height;
  const [pdf, eps] = await Promise.all([
    makePdf(png, width, height),
    includeEps ? makeEps(png) : undefined
  ]);
  return { svg, png, pdf, eps };
}

async function writeZip(fileName, zip) {
  const data = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
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

async function buildProjectLogoDownloads() {
  const all = new JSZip();
  const root = all.folder('AURIX_Project_Logos');
  const names = {
    arbat2: 'Arbat_2',
    ldm: 'LDM',
    mariinka: 'Mariinka_Deluxe',
    omega: 'Residence_Omega'
  };

  for (const [slug, name] of Object.entries(names)) {
    const source = await fs.readFile(path.join(PROJECTS, `${slug}-logo.svg`), 'utf8');
    const zip = new JSZip();
    const project = root.folder(name);
    for (const [tone, color] of [['Black', '#000000'], ['White', '#FFFFFF']]) {
      const svgText = source.replace(/#fff\b/gi, color);
      const { svg, png, pdf } = await makeLogoAsset(svgText, 2400, false);
      const eps = await makeProjectEps(png, tone === 'White');
      for (const [format, data] of Object.entries({ svg, png, pdf, eps })) {
        const file = `AURIX_${name}_${tone}.${format}`;
        zip.folder(tone).file(file, data);
        project.folder(tone).file(file, data);
      }
    }
    await writeZip(`AURIX_Project_Logo_${slug}.zip`, zip);
  }
  await writeZip('AURIX_Project_Logos.zip', all);
}

async function makeProjectEps(png, white) {
  // A PostScript stencil leaves the area around either logo color transparent.
  const { data, info: { width, height, channels } } = await sharp(png)
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const stride = Math.ceil(width / 8);
  const mask = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + channels - 1] >= 128) {
        mask[y * stride + (x >> 3)] |= 128 >> (x % 8);
      }
    }
  }
  const hex = mask.toString('hex').match(/.{1,120}/g).join('\n');
  return Buffer.from(`%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 ${width} ${height}\n%%EndComments\n${white ? 1 : 0} setgray\n${width} ${height} scale\n/picstr ${stride} string def\n${width} ${height} true [${width} 0 0 -${height} 0 ${height}]\n{ currentfile picstr readhexstring pop } imagemask\n${hex}\nshowpage\n%%EOF\n`, 'ascii');
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

  await copyFile(path.join('assets', 'og-cover.jpg'));
  await copyFile(path.join('assets', 'favicon.svg'));
  await ensureDir(path.join(DIST, 'assets', 'projects'));
  for (const name of await fs.readdir(PROJECTS)) {
    if (name.endsWith('.webp') || name.endsWith('-logo.svg')) await copyFile(path.join('assets', 'projects', name));
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
  await buildProjectLogoDownloads();

  const required = [
    'index.html',
    'assets/og-cover.jpg',
    'assets/favicon.svg',
    'assets/projects/omega-1600.webp',
    'assets/projects/zemled-1600.webp',
    'downloads/AURIX_Fonts.zip',
    'downloads/AURIX_Logos.zip',
    'downloads/AURIX_Project_Logos.zip',
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
