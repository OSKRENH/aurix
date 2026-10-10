const UI_FIXES = `
@media (max-width: 560px) {
  .hero::after {
    display: none !important;
    content: none !important;
  }
}

/* The outgoing logo still fades for 250ms, but the committed image must snap
   back to opacity:1 when the temporary crossfade layer is removed. Otherwise
   it starts a second 250ms fade-in and creates the visible end-of-switch blink. */
.logo-art:not(.is-fading-out) {
  transition: none !important;
}
.logo-art.is-fading-out {
  transition: opacity 250ms cubic-bezier(.2,.7,.3,1) !important;
}
`;

const RUNTIME_FIXES = `
(() => {
  /* Keep the printed HEX with #, but copy the raw six-character value. The
     existing app.js handler reads dataset.copy at click time, so changing the
     dataset here preserves its checkmark and “Скопировано” feedback. */
  document.querySelectorAll('.color-primary [data-copy]').forEach((button) => {
    button.dataset.copy = (button.dataset.copy || '').replace(/^#/, '');
  });
})();
`;

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) return response;

    return new HTMLRewriter()
      .on('head', {
        element(head) {
          head.append(`<style>${UI_FIXES}</style>`, { html: true });
        }
      })
      .on('body', {
        element(body) {
          body.append(`<script>${RUNTIME_FIXES}</script>`, { html: true });
        }
      })
      .transform(response);
  }
};
