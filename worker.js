const MOTION_STABILITY_CSS = `
/* Stabilize palette cards: keep the one-shot reveal, but disable the flaky
   clip/view-timeline combination that could leave swatches invisible. */
.palette .color.swatch-reveal{
  clip-path:none!important;
  animation:none!important;
}
.palette .color.reveal.is-view-tracking{
  animation:none!important;
}
.palette .color.reveal.is-revealed{
  opacity:1!important;
  transform:translateY(0)!important;
}

/* Typography enters later and more calmly. The generic IO still makes it
   one-shot; these overrides stop view-timeline from starting too early. */
.font-stack .font-block.reveal,
.guild-sample.type-spacing-reveal{
  animation:none!important;
  transition-duration:650ms!important;
  transition-delay:240ms!important;
}
.guild-sample.type-spacing-reveal{
  transition-property:letter-spacing,opacity,transform!important;
}
.type-line{
  animation:none!important;
  transition-duration:650ms!important;
  transition-delay:calc(300ms + var(--line-delay,0ms))!important;
}

@media(prefers-reduced-motion:reduce){
  .palette .color.swatch-reveal,
  .palette .color.reveal,
  .font-stack .font-block.reveal,
  .guild-sample.type-spacing-reveal,
  .type-line{
    animation:none!important;
    transition:none!important;
    opacity:1!important;
    transform:none!important;
    clip-path:none!important;
  }
}
`;

class MotionStabilityHead {
  element(element) {
    element.append(`<style id="aurix-motion-stability">${MOTION_STABILITY_CSS}</style>`, { html: true });
  }
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;
    return new HTMLRewriter().on('head', new MotionStabilityHead()).transform(response);
  }
};
