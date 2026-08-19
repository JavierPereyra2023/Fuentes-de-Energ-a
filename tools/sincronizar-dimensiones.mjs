// Escribe width/height reales en cada <img> que apunte a un archivo local.
// Sin esas medidas el navegador no reserva el espacio y, en celular, las fotos
// "saltan" o quedan colapsadas mientras cargan.
//
// Uso:  node tools/sincronizar-dimensiones.mjs
import { readFileSync, writeFileSync, globSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..');

const medir = (ruta) => {
  const d = readFileSync(ruta);
  if (d.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return { w: d.readUInt32BE(16), h: d.readUInt32BE(20) };
  if (d[0] === 0xff && d[1] === 0xd8) {
    let i = 2;
    while (i < d.length) {
      if (d[i] !== 0xff) { i++; continue; }
      const m = d[i + 1];
      if (m >= 0xd0 && m <= 0xd9) { i += 2; continue; }
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(m))
        return { h: d.readUInt16BE(i + 5), w: d.readUInt16BE(i + 7) };
      i += 2 + d.readUInt16BE(i + 2);
    }
  }
  return null;
};

let puestas = 0, corregidas = 0;
for (const archivo of globSync('**/*.html', { cwd: raiz, exclude: (p) => p.startsWith('output') })) {
  const ruta = resolve(raiz, archivo);
  const original = readFileSync(ruta, 'utf8');

  const nuevo = original.replace(/<img\b[^>]*>/g, (tag) => {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src || /^(https?:|data:)/.test(src)) return tag;
    const img = resolve(dirname(ruta), decodeURIComponent(src));
    if (!existsSync(img)) return tag;
    const dim = medir(img);
    if (!dim) return tag;

    const tieneW = /\bwidth="\d+"/.test(tag);
    let out = tag;
    if (tieneW) {
      const antes = out;
      out = out.replace(/\bwidth="\d+"/, `width="${dim.w}"`).replace(/\bheight="\d+"/, `height="${dim.h}"`);
      if (out !== antes) corregidas++;
    } else {
      out = out.replace(/^<img\b/, `<img width="${dim.w}" height="${dim.h}"`);
      puestas++;
    }
    return out;
  });

  if (nuevo !== original) writeFileSync(ruta, nuevo);
}
console.log(`width/height agregados: ${puestas}   corregidos: ${corregidas}`);
