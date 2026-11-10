// Redirects www.vizn3r.eu to vizn3r.eu and serves everything else from dist/.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.vizn3r.eu") {
      url.hostname = "vizn3r.eu";
      console.log(`redirecting ${request.url} to ${url} ...`);
      return Response.redirect(url.toString(), 301);
    }

    console.log(`serving ${url.pathname} ...`);
    const response = await env.ASSETS.fetch(request);
    console.log(`served ${url.pathname} with status ${response.status}`);
    return response;
  },
};
