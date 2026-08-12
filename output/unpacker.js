window.__resources = ' +
      JSON.stringify(resourceMap).replace(/<\//g, '<\\/') +
      ';</' + 'script>';
    // Inject after <head> so the DOCTYPE stays first; prepending the script
    // would push the parser into quirks mode. DOMParser always emits a <head>
    // (synthesizing one if the source HTML omitted it) but may carry
    // attributes through, so match the full opening tag. slice() rather than
    // replace() keeps us clear of $-pattern substitution in resourceScript.
    const headOpen = template.match(/<head[^>]*>/i);
    if (headOpen) {
      const i = headOpen.index + headOpen[0].length;
      template = template.slice(0, i) + resourceScript + template.slice(i);
    }

    // Give the vertical fuselage wordmark enough breathing room so the
    // initial "F" is not clipped by the edges of its canvas texture.
    template = template
      .replace("g2.font = '600 128px", "g2.font = '600 108px")
      .replace("g2.letterSpacing = '14px'", "g2.letterSpacing = '8px'");

    // Parse the template and swap the root element. Scripts inserted via
    // DOMParser/replaceWith are inert per spec — re-create each with
    // createElement so they execute, awaiting onload for src scripts to
    // preserve ordering (React before ReactDOM before Babel before text/babel).
    const doc = new DOMParser().parseFromString(template, 'text/html');
    const sharedTheme = doc.createElement('link');
    sharedTheme.rel = 'stylesheet';
    sharedTheme.href = 'rocket-viewer-theme.css?v=mobile5';
    doc.head.appendChild(sharedTheme);
    document.documentElement.replaceWith(doc.documentElement);

    // Resolve page-frame markers: mint this document's own blob for each
    // framed page — from local text when this is the root, otherwise by
    // asking the direct parent over the relay protocol above. An
    // unanswered request leaves the frame on about:blank, the same
    // degraded state as a refused embed.
    {
      const MARKER = /^about:blank#([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(#.*)?$/;
      const needed = [];
      for (const el of Array.from(document.querySelectorAll('iframe'))) {
        const m = MARKER.exec(el.getAttribute('src') || '');
        if (!m) continue;
        const text = pageTexts[m[1]];
        if (typeof text === 'string') {
          mountPage(el, m[2] || '', text);
        } else if (window.parent !== window && !isPageRoot) {
          const had = pendingFrames[m[1]];
          (pendingFrames[m[1]] = had || []).push({ el: el, frag: m[2] || '' });
          if (!had) needed.push(m[1]);
        }
      }
      for (const uuid of needed) {
        window.parent.postMessage({ __bundler_need: uuid }, OWN_TARGET);
      }
    }

    const dead = Array.from(document.scripts);
    for (const old of dead) {
      const s = document.createElement('script');
      for (const a of old.attributes) s.setAttribute(a.name, a.value);
      s.textContent = old.textContent;
      // text/babel scripts with a src: read and inline. transformScriptTags
      // does XHR against the src, but blob:null/ from a file:// origin is
      // silently dropped. Inlining makes it a plain inline babel script,
      // which transformScriptTags handles unconditionally.
      if ((s.type === 'text/babel' || s.type === 'text/jsx') && s.src) {
        const pre = resourceBlobs[s.src.split('#')[0]];
        s.textContent = pre ? await pre.text() : await (await fetch(s.src)).text();
        s.removeAttribute('src');
      }
      const p = s.src ? new Promise(function(r) { s.onload = s.onerror = r; }) : null;
      old.replaceWith(s);
      if (p) await p;
    }
    // Babel standalone auto-transforms type=text/babel on DOMContentLoaded,
    // which fired before we swapped the document. Trigger manually if present.
    if (window.Babel && typeof window.Babel.transformScriptTags === 'function') {
      window.Babel.transformScriptTags();
    }
  } catch (err) {
    setStatus('Error unpacking: ' + err.message);
    console.error('Bundle unpack error:', err);
  }
});

  