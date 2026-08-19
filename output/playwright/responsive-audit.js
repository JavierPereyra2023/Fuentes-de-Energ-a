async (page) => {
  const base = "http://127.0.0.1:8765";
  const paths = new Set([
    "/index.html",
    "/inicio.html",
    "/presentacion.html",
    "/revista.html",
    "/conceptos/energias/modelo3D-central_nuclear/central-nuclear-3d.html",
    "/conceptos/energias/modelo3D_eolico/parque-eolico-3d.html",
    "/conceptos/energias/modelo3D_parque_solar/Parque%20Solar%203D%20(descarga).html",
    "/conceptos/energias/modelo3D_represa/Represa%20Hidroelectrica%203D%20(standalone).html",
    "/conceptos/modelo3D_rocket/falcon-heavy-3d.html",
    "/conceptos/modelo3D_rocket/falcon-9/falcon9-3d.html",
    "/conceptos/modelo3D_rocket/starship/starship.html"
  ]);
  for (const hub of ["/inicio.html", "/revista.html", "/conceptos/energias.html"]) {
    await page.goto(base + hub, { waitUntil: "domcontentloaded", timeout: 10000 });
    const links = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((anchor) => ({ origin: anchor.origin, pathname: anchor.pathname })));
    for (const link of links) {
      if (link.origin === base && link.pathname.endsWith(".html") && !link.pathname.includes("modelo3D")) {
        paths.add(link.pathname);
      }
    }
  }

  const audits = [];
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    const results = [];

    for (const path of paths) {
      let failure = null;
      let status = null;
      const runtimeErrors = [];
      const onPageError = (error) => runtimeErrors.push(String(error).slice(0, 180));
      const onConsole = (message) => {
        if (message.type() === "error") runtimeErrors.push(message.text().slice(0, 180));
      };
      page.on("pageerror", onPageError);
      page.on("console", onConsole);
      try {
        const response = await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 10000 });
        status = response ? response.status() : null;
        if (path === "/index.html" || path.includes("modelo3D")) await page.waitForTimeout(900);
      } catch (error) {
        failure = String(error).slice(0, 160);
      }
      const metrics = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        viewport: innerWidth,
        title: document.title,
        bodyLength: document.body ? document.body.innerText.trim().length : 0,
        headings: document.querySelectorAll("h1").length,
        visuals: document.querySelectorAll("canvas, three-d-stage, svg, img").length
      }));
      page.off("pageerror", onPageError);
      page.off("console", onConsole);
      results.push({ path, status, failure, runtimeErrors, ...metrics });
    }

    audits.push({
      viewport: `${viewport.width}x${viewport.height}`,
      count: results.length,
      issues: results.filter((result) =>
        result.failure ||
        result.status !== 200 ||
        result.runtimeErrors.length ||
        result.width > result.viewport + 1 ||
        (!result.title && !result.path.includes("modelo3D")) ||
        (!result.bodyLength && !result.visuals && !result.path.includes("modelo3D"))
      )
    });
  }
  return audits;
}
