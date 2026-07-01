# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descripción del proyecto

Sitio web educativo estático sobre **energía nuclear** dirigido a estudiantes de los últimos años de la escuela secundaria argentina. Es un proyecto del Prof. Pereyra, Javier. Sin backend ni build — todos los archivos son HTML autocontenidos que se abren directamente en el navegador.

## Estructura

```
D:\nucle-ar\
├── index.html                  # Página principal de Energía Nuclear
├── conceptos\
│   ├── fision.html             # Concepto de fisión (acento ROJO #DC2626)
│   └── fusion.html             # Concepto de fusión (acento AZUL #3B82F6)
└── CLAUDE.md
```

## Stack técnico

- **HTML5 puro** sin frameworks ni npm. No hay package.json, ni build, ni tests.
- **Tailwind CSS** cargado vía CDN: `https://cdn.tailwindcss.com`
- **Iconify** para iconos: `https://code.iconify.design/3/3.1.0/iconify.min.js`
- **Google Fonts**: Playfair Display (titulares), Cormorant Garamond (cuerpo), Inter (UI)
- **MathJax** (solo en páginas de conceptos): `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js`
- **SVG animados** con SMIL (`<animate>`, `<animateMotion>`, `<animateTransform>`) para diagramas científicos

## Comandos comunes

No hay comandos de build/test/lint. El proyecto se desarrolla abriendo los `.html` en el navegador:

```powershell
# Abrir página principal
Start-Process "D:\nucle-ar\index.html"

# Abrir página de concepto
Start-Process "D:\nucle-ar\conceptos\fision.html"
```

Para verificar cambios sin recargar manualmente, usar `?nocache=1` o Ctrl+F5.

## Arquitectura del sitio

### `index.html` — Página principal
- Hero con átomo decorativo animado (órbitas CSS rotando)
- 8 secciones: hero, marquee, qué es, fisión vs fusión, Argentina, centrales (Atucha I/II, Embalse, CAREM, INVAP), aplicaciones, seguridad, recursos, footer
- Color de acento: cian radioactivo `#00E5FF` (paleta `nucleo` en `tailwind.config`)
- Imágenes de Wikimedia Commons (URLs verificadas) y Unsplash

### `conceptos/fision.html` y `conceptos/fusion.html` — Conceptos individuales
Plantilla común:
- Mismo fondo oscuro, mismas fuentes y patrón de nav/footer
- Hero + secciones numeradas (01–06) con SVG animado en la sección 02
- Ecuaciones con MathJax (`\(...\)` para inline, `\[...\]` para bloque)
- Barra de progreso de lectura superior (`.reading-bar`)
- Navegación cruzada entre páginas hermanas al final

**Diferenciación visual entre conceptos**:
| Concepto | Color `accent` | Icono principal | Tema |
|----------|---------------|-----------------|------|
| Fisión | `#DC2626` rojo | `lucide:split` | Peligro, potencia, ruptura |
| Fusión | `#3B82F6` azul | `lucide:merge` | Estrella, plasma, futuro |

## Patrones SVG animados

Los SVG científicos usan SMIL con `dur` y `keyTimes` proporcionales (no CSS animation). Para ciclos largos se divide el tiempo así:

```
t=0s  → keyTime 0     (inicio)
t=2s  → keyTime 0.143 (en dur=14s)
t=4s  → keyTime 0.286
t=6s  → keyTime 0.428
t=8s  → keyTime 0.571
t=14s → keyTime 1     (loop)
```

Para **explosión instantánea** (fisión): el U-235 pasa de `r=20` a `r=0` en 2-3 keyTimes consecutivos (ej. `r="20;20;50;0;0"` con `keyTimes="0;0.16;0.168;0.175;1"`) y un flash cubre la transición con `r=90`.

Para **separación de fragmentos** los `animateMotion` necesitan paths con **puntos intermedios únicos** — no repetir el destino. Ejemplo correcto:
```xml
<animateMotion dur="14s" repeatCount="indefinite"
  keyTimes="0;0.07;0.17;0.55;1"
  calcMode="spline" keySplines="0.2 0.8 0.2 1; 0.5 0 0.5 1; 0 0 1 1; 0 0 1 1"
  path="M 0 0 L -10 -16 L -20 -32 L -32 -50 L -32 -50"/>
```
Mal ejemplo: `path="M 0 0 L -32 -50 L -32 -50 L -32 -50 L -32 -50"` (el producto aparece estático, sin movimiento visible).

## Paleta de colores

Definida en `tailwind.config` de cada archivo bajo el namespace `nucleo`:
- Base: `black #06090C`, `dark #0B1014`, `gray #141A20`, `mid #1C232A`
- Texto: `silver #A8B5BD`, `silverLight #C8D4DC`, `silverDark #5A6B72`
- Acentos variables según la página (ver tabla arriba)
- Estados: `warning #FFB300` (alertas), `cyan #00E5FF` (énfasis secundario)

## Notas para futuras instancias

- **No usar `npm` ni crear `package.json`**: el proyecto es deliberadamente sin build. Todo se carga por CDN.
- **Mantener coherencia visual** entre páginas: misma nav, mismo footer, mismas fuentes, mismo patrón de breadcrumb (`Inicio / Conceptos / Nombre`).
- **Imágenes**: usar URLs estables. Wikimedia Commons funciona para reactores argentinos; Unsplash para imágenes genéricas. Las URLs de Wikimedia con hashes incorrectos (como `/thumb/X/X/...`) dan 404 — verificar antes de usar.
- **Gradientes SVG**: los productos de fisión se diferencian por color (`baGrad` dorado, `krGrad` naranja, `xeGrad` cian, `srGrad` verde) según el canal de fisión real.
- **Datos técnicos de reactores argentinos** (Atucha I, Atucha II, Embalse, CAREM, INVAP) están en la página principal — mantener consistencia si se expanden.
- **No hay tests automatizados** ni CI. La verificación es manual abriendo las páginas en el navegador.
</content>
</invoke>