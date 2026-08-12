(() => {
  const fonts = [
    { family: 'Guild A Display', base: './fonts/guild', parts: 1 },
    { family: 'TT Hoves Pro', base: './fonts/hoves', parts: 4 }
  ];

  function decodeBase64(value) {
    const binary = atob(value.replace(/\s+/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  async function loadFont({ family, base, parts }) {
    const chunks = await Promise.all(
      Array.from({ length: parts }, (_, index) => {
        const part = String(index).padStart(2, '0');
        return fetch(`${base}/part-${part}.b64`, { cache: 'force-cache' }).then((response) => {
          if (!response.ok) throw new Error(`Failed to load ${response.url}`);
          return response.text();
        });
      })
    );

    const face = new FontFace(family, decodeBase64(chunks.join('')), {
      style: 'normal',
      weight: '400',
      display: 'swap'
    });
    await face.load();
    document.fonts.add(face);
  }

  if (!('FontFace' in window) || !document.fonts) return;

  Promise.all(fonts.map(loadFont))
    .then(() => document.documentElement.classList.add('brand-fonts-loaded'))
    .catch((error) => console.error('AURIX brand fonts failed to load', error));
})();
