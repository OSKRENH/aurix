/* The site is fully static: the worker only serves the built assets.
   Motion lives in app.js, so nothing is injected into the HTML here — an
   injected second motion layer could only fight the first one. */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
