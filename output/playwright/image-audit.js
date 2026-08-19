async (page) => {
  const base = "http://127.0.0.1:8765";
  const paths = [
    "/Explorando%20la%20materia.html",
    "/index.html",
    "/inicio.html",
    "/presentacion.html",
    "/revista.html",
    "/conceptos/aceleradores.html",
    "/conceptos/antimateria.html",
    "/conceptos/aplicaciones.html",
    "/conceptos/argentina.html",
    "/conceptos/atomos.html",
    "/conceptos/cosmicos.html",
    "/conceptos/dosis.html",
    "/conceptos/energia-espacial.html",
    "/conceptos/energias.html",
    "/conceptos/espectro.html",
    "/conceptos/fision.html",
    "/conceptos/fuerzas.html",
    "/conceptos/fusion.html",
    "/conceptos/instituciones.html",
    "/conceptos/materia-oscura.html",
    "/conceptos/medicina.html",
    "/conceptos/mundo.html",
    "/conceptos/peliculas.html",
    "/conceptos/radiaciones.html",
    "/conceptos/radioisotopos.html",
    "/conceptos/reactores.html",
    "/conceptos/residuos.html",
    "/conceptos/energias/biomasa.html",
    "/conceptos/energias/carbon.html",
    "/conceptos/energias/eolica.html",
    "/conceptos/energias/gas.html",
    "/conceptos/energias/geotermia.html",
    "/conceptos/energias/hidroelectrica.html",
    "/conceptos/energias/nuclear.html",
    "/conceptos/energias/petroleo.html",
    "/conceptos/energias/solar.html",
    "/conceptos/energias/modelo3D-central_nuclear/central-nuclear-3d.html",
    "/conceptos/energias/modelo3D_eolico/parque-eolico-3d.html",
    "/conceptos/energias/modelo3D_parque_solar/Parque%20Solar%203D%20(descarga).html",
    "/conceptos/energias/modelo3D_represa/Represa%20Hidroelectrica%203D%20(standalone).html",
    "/conceptos/modelo3D_rocket/falcon-heavy-3d.html",
    "/conceptos/modelo3D_rocket/falcon-9/Falcon%209%20Especificaciones.dc.html",
    "/conceptos/modelo3D_rocket/falcon-9/falcon9-3d.html",
    "/conceptos/modelo3D_rocket/starship/starship.html",
    "/conceptos/revista/balseiro.html",
    "/conceptos/revista/bomba-atomica.html",
    "/conceptos/revista/chernobyl.html",
    "/conceptos/revista/curie.html",
    "/conceptos/revista/einstein.html",
    "/conceptos/revista/fermi.html",
    "/conceptos/revista/fukushima.html",
    "/conceptos/revista/meitner.html",
    "/conceptos/revista/oklo.html",
    "/conceptos/revista/propulsion.html"
  ];

  await page.setViewportSize({ width: 1280, height: 900 });
  const results = [];

  for (const path of paths) {
    const failedImages = [];
    const badResponses = [];
    const onFailed = (request) => {
      if (request.resourceType() === "image") {
        failedImages.push({ url: request.url(), error: request.failure()?.errorText || "request failed" });
      }
    };
    const onResponse = (response) => {
      if (response.request().resourceType() === "image" && response.status() >= 400) {
        badResponses.push({ url: response.url(), status: response.status() });
      }
    };
    page.on("requestfailed", onFailed);
    page.on("response", onResponse);

    let status = null;
    let navigationError = null;
    try {
      const response = await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 12000 });
      status = response?.status() ?? null;
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = "eager";
        const height = document.documentElement.scrollHeight;
        for (let y = 0; y < height; y += Math.max(innerHeight * 0.8, 600)) {
          scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 35));
        }
        scrollTo(0, 0);
      });
      await page.waitForTimeout(path.includes("modelo3D") ? 1000 : 400);
    } catch (error) {
      navigationError = String(error).slice(0, 220);
    }

    const details = await page.evaluate(() => {
      const images = [...document.images].map((image) => ({
        src: image.currentSrc || image.src,
        alt: image.alt,
        complete: image.complete,
        width: image.naturalWidth,
        height: image.naturalHeight,
        visible: Boolean(image.getClientRects().length)
      }));
      const backgroundUrls = new Set();
      for (const element of document.querySelectorAll("*")) {
        const background = getComputedStyle(element).backgroundImage;
        for (const match of background.matchAll(/url\(["']?([^"')]+)["']?\)/g)) backgroundUrls.add(match[1]);
      }
      return {
        title: document.title,
        imageCount: images.length,
        loadedCount: images.filter((image) => image.complete && image.width > 0 && image.height > 0).length,
        broken: images.filter((image) => !image.complete || image.width === 0 || image.height === 0),
        backgroundUrls: [...backgroundUrls]
      };
    });

    page.off("requestfailed", onFailed);
    page.off("response", onResponse);
    results.push({ path, status, navigationError, failedImages, badResponses, ...details });
  }

  return {
    pages: results.length,
    imageElements: results.reduce((sum, item) => sum + item.imageCount, 0),
    loadedImageElements: results.reduce((sum, item) => sum + item.loadedCount, 0),
    cssBackgroundReferences: results.reduce((sum, item) => sum + item.backgroundUrls.length, 0),
    pagesWithImages: results.filter((item) => item.imageCount > 0).length,
    issues: results.filter((item) => item.status !== 200 || item.navigationError || item.broken.length || item.failedImages.length || item.badResponses.length)
  };
}
