const MOTION_STABILITY_CSS = `
/* Palette: disable the flaky clip/view-timeline combination. The small
   runtime below owns the one-shot reveal with transform + opacity only. */
.palette .color.swatch-reveal{
  clip-path:none!important;
  animation:none!important;
}
.palette .color.reveal.is-view-tracking{animation:none!important}
.palette.motion-stable .color.reveal{
  opacity:0!important;
  transform:translateY(14px)!important;
  transition:opacity 560ms cubic-bezier(.2,.7,.3,1) var(--stable-delay,0ms),
             transform 560ms cubic-bezier(.2,.7,.3,1) var(--stable-delay,0ms)!important;
}
.palette.motion-stable .color.reveal.is-revealed{
  opacity:1!important;
  transform:translateY(0)!important;
}

/* Typography: gate the visual start until the specimen is materially in view,
   then use a slower 650ms motion. */
.font-stack .font-block.reveal,
.guild-sample.type-spacing-reveal{
  animation:none!important;
}
.guild-sample.type-late-gate:not(.type-late-ready){
  opacity:0!important;
  transform:translateY(14px)!important;
  letter-spacing:.08em!important;
}
.guild-sample.type-late-gate.type-late-ready{
  opacity:1!important;
  transform:translateY(0)!important;
  letter-spacing:-.03em!important;
  transition:letter-spacing 650ms cubic-bezier(.2,.7,.3,1),
             opacity 650ms cubic-bezier(.2,.7,.3,1),
             transform 650ms cubic-bezier(.2,.7,.3,1)!important;
}
.hoves-sample.type-late-gate:not(.type-late-ready) .type-line{
  opacity:0!important;
  transform:translateY(100%)!important;
}
.hoves-sample.type-late-gate.type-late-ready .type-line{
  opacity:1!important;
  transform:translateY(0)!important;
  transition:transform 650ms cubic-bezier(.2,.7,.3,1) var(--late-line-delay,0ms),
             opacity 650ms cubic-bezier(.2,.7,.3,1) var(--late-line-delay,0ms)!important;
}

@media(prefers-reduced-motion:reduce){
  .palette .color,
  .guild-sample.type-late-gate,
  .hoves-sample.type-late-gate .type-line{
    animation:none!important;
    transition:none!important;
    opacity:1!important;
    transform:none!important;
    clip-path:none!important;
    letter-spacing:normal!important;
  }
}
`;

const MOTION_STABILITY_JS = `
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const palette = document.querySelector('.palette');
  if (palette) {
    const cards = [...palette.querySelectorAll('.color')];
    palette.classList.add('motion-stable');
    cards.forEach((card, index) => {
      card.classList.remove('is-view-tracking','is-revealed');
      card.style.setProperty('--stable-delay', (index * 70) + 'ms');
    });
    if (reduced) {
      cards.forEach(card => card.classList.add('is-revealed'));
    } else {
      const paletteObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        cards.forEach(card => card.classList.add('is-revealed'));
        paletteObserver.disconnect();
      }, { threshold: .12, rootMargin: '0px 0px -10% 0px' });
      paletteObserver.observe(palette);
    }
  }

  const guild = document.querySelector('.guild-sample');
  const hoves = document.querySelector('.hoves-sample');
  [guild, hoves].filter(Boolean).forEach(node => node.classList.add('type-late-gate'));
  if (hoves) {
    hoves.querySelectorAll('.type-line').forEach((line, index) => {
      line.style.setProperty('--late-line-delay', (index * 110) + 'ms');
    });
  }

  if (reduced) {
    [guild, hoves].filter(Boolean).forEach(node => node.classList.add('type-late-ready'));
  } else {
    const typeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('type-late-ready');
        typeObserver.unobserve(entry.target);
      });
    }, { threshold: .38, rootMargin: '0px 0px -24% 0px' });
    [guild, hoves].filter(Boolean).forEach(node => typeObserver.observe(node));
  }
})();
`;

class MotionStabilityHead {
  element(element) {
    element.append(`<style id="aurix-motion-stability">${MOTION_STABILITY_CSS}</style>`, { html: true });
  }
}

class MotionStabilityBody {
  element(element) {
    element.append(`<script id="aurix-motion-stability-runtime">${MOTION_STABILITY_JS}<\/script>`, { html: true });
  }
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;
    return new HTMLRewriter()
      .on('head', new MotionStabilityHead())
      .on('body', new MotionStabilityBody())
      .transform(response);
  }
};
