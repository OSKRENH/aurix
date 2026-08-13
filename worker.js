const MOBILE_HERO_FIX = `
@media (max-width: 560px) {
  .hero::after {
    display: none !important;
    content: none !important;
  }
}
`;

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) return response;

    return new HTMLRewriter()
      .on('head', {
        element(head) {
          head.append(`<style>${MOBILE_HERO_FIX}</style>`, { html: true });
        }
      })
      .transform(response);
  }
};
