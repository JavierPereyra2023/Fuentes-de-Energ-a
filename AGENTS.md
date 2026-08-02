# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Descripción del proyecto

Sitio web educativo estático sobre **energía nuclear** dirigido a estudiantes de los últimos años de la escuela secundaria argentina. Es un proyecto del Prof. Pereyra, Javier. Sin backend ni build — todos los archivos son HTML autocontenidos que se abren directamente en el navegador.

## Estructura

```
D:\nucle-ar\
├── index.html                  # Página principal (cian #00E5FF)
├── revista.html                # Índice de artículos de revista (oro #F59E0B)
├── assets/                     # Recursos estáticos
├── conceptos\
│   ├── aceleradores.html       # Aceleradores de partículas (violeta #7C4DFF) — incluye BNCT
│   ├── antimateria.html        # Antimateria (fucsia #EC4899)
│   ├── aplicaciones.html       # Aplicaciones (rojo #DC2626) — incluye BNCT
│   ├── argentina.html          # Tecnología nuclear argentina (celeste #75AADB) — incluye TANDAR
│   ├── atomos.html             # Estructura del átomo (ámbar #F59E0B)
│   ├── cosmicos.html           # Rayos cósmicos (violeta #7C4DFF)
│   ├── dosis.html              # Dosis y protección radiológica (teal #14B8A6) — Gy/Sv/mSv, límites ARN, radón, ALARA
│   ├── espectro.html           # Espectro electromagnético (violeta #7C4DFF)
│   ├── energias.html           # Otras fuentes de energía (verde esmeralda #10B981) — hub de 4 secciones, grid de 9 cards a energias\, sin SVG
│   ├── fision.html             # Fisión (rojo #DC2626)
│   ├── fuerzas.html            # Fuerzas fundamentales (cian #00E5FF)
│   ├── fusion.html             # Fusión (azul #3B82F6)
│   ├── instituciones.html      # Instituciones argentinas (celeste #75AADB, plantilla reducida, 9 tarjetas)
│   ├── materia-oscura.html     # Materia oscura (índigo #4F46E5)
│   ├── medicina.html           # Medicina nuclear y radiología (rojo #DC2626) — 11 secciones, sin SVG
│   ├── mundo.html              # La nuclear en el mundo (blue-600 #2563EB) — flota, países, SMR/Gen IV, COP28
│   ├── peliculas.html          # Películas y series nucleares (oro #F59E0B, plantilla reducida, sin iframes)
│   ├── radiaciones.html        # Radiaciones ionizantes (naranja #FF6E40)
│   ├── radioisotopos.html      # Radioisótopos (verde #26A69A)
│   ├── reactores.html          # Reactores nucleares (ámbar #FFB300)
│   ├── residuos.html           # Residuos radiactivos (yellow #EAB308) — clasificación, gestión, Onkalo, debate
│   ├── energias\               # 9 páginas de fuentes de energía (plantilla completa, 4 secciones 01-04)
│   │   ├── hidroelectrica.html # Hidroeléctrica (sky #38BDF8) — Yacyretá, Salto Grande, Comahue
│   │   ├── eolica.html         # Eólica (cian #00E5FF) — Patagonia, 71% de lo renovable
│   │   ├── solar.html          # Solar (ámbar #F59E0B) — Cauchari (Jujuy)
│   │   ├── biomasa.html        # Biomasa (verde #26A69A) — biogás, biocombustibles
│   │   ├── geotermia.html      # Geotermia (naranja #FF6E40) — Copahue, Domuyo
│   │   ├── gas.html            # Gas natural (#FFB300) — Vaca Muerta, ~70% de lo térmico
│   │   ├── petroleo.html       # Petróleo (#D97706) — respaldo en picos
│   │   ├── carbon.html         # Carbón (gris #9CA3AF) — Río Turbio, aporte marginal
│   │   └── nuclear.html        # Nuclear (rojo #DC2626) — Atucha I/II, Embalse, 1.763 MW
│   └── revista\                # 10 artículos (plantilla reducida, sin TOC/num)
│       ├── balseiro.html       # Balseiro (celeste #75AADB)
│       ├── bomba-atomica.html  # Proyecto Manhattan / Oppenheimer (rojo #DC2626)
│       ├── chernobyl.html      # Chernobyl (rojo #DC2626)
│       ├── curie.html          # Marie Curie (violeta #7C4DFF)
│       ├── einstein.html       # Einstein (ámbar #F59E0B)
│       ├── fermi.html          # Fermi (ámbar #F59E0B)
│       ├── fukushima.html      # Fukushima (naranja #FF6E40)
│       ├── meitner.html        # Lise Meitner (violeta #7C4DFF)
│       ├── oklo.html           # Oklo, reactor natural (ámbar #F59E0B)
│       └── propulsion.html     # Propulsión nuclear (ámbar #F59E0B)
├── tools\                      # Scripts de mantenimiento
│   └── verificar-links.ps1     # Valida href/src locales, anchors #id y wrapper flex de secciones
└── AGENTS.md
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

Para validar enlaces locales, anchors y el patrón de secciones, ejecutar el verificador:

```powershell
# Verificar enlaces, anchors y wrapper flex de todas las páginas
& "D:\nucle-ar\tools\verificar-links.ps1"
```

## Arquitectura del sitio

### `index.html` — Página principal
- Hero con átomo decorativo animado (órbitas CSS rotando)
- 5 secciones + marquee + footer: hero, marquee, qué es, fisión vs fusión, Argentina, temas, footer (las secciones `centrales`/`aplicaciones`/`seguridad`/`recursos` ya no existen)
- Color de acento: cian radioactivo `#00E5FF` (paleta `nucleo` en `tailwind.config`, sin clave `accent`; usa `cyan`/`cyanLight`/`cyanDark`)
- Imágenes de Wikimedia Commons (URLs verificadas) y Unsplash
- Grid de 18 tarjetas de temas (`#temas`) numeradas 01–18 enlazando a las páginas de conceptos (incluye Fusión 12, Espectro EM 13, Medicina Nuclear 14, Otras Energías 15, Dosis 16, Residuos 17 y La Nuclear en el Mundo 18; las tarjetas de Fusión, Otras Energías, Dosis, Residuos y Mundo usan clases Tailwind estándar `blue-500`/`emerald-500`/`teal-500`/`yellow-500`/`blue-600` porque esos colores no están en la paleta `nucleo`)
- Nav incluye: Fundamentos, Conceptos, Argentina, Instituciones, Películas, Temas, Revista
- Marquee incluye TANDAR. Timeline argentina incluye hito 1985 (TANDAR)
- Colores adicionales en paleta: `fucsia` (#EC4899), `indigo` (#4F46E5)

### `revista.html` — Índice de la revista
- Lista 9 artículos de `conceptos/revista/` como tarjetas + 1 destacado (Einstein)
- Acento oro `#F59E0B` (paleta `nucleo` sin `accent`; usa `oro`/`oroLight`)
- Una tarjeta destacada + 9 tarjetas chicas en grid
- Footer con link a Películas

### Páginas de conceptos (`conceptos/*.html`)
Plantilla común (15 páginas con secciones numeradas):
- Mismo fondo oscuro, mismas fuentes y patrón de nav/footer
- Breadcrumb `Inicio / Conceptos / Nombre`
- Hero + secciones numeradas (01–05 o 06) con `section-num`
- Tabla de contenidos lateral fija (`.toc-sidebar` desktop, `.toc-overlay` móvil)
- Ecuaciones con MathJax (`\(...\)` para inline, `\[...\]` para bloque)
- Barra de progreso de lectura superior (`.reading-bar`)
- "Conceptos Clave" + "Temas Relacionados" + navegación cruzada al final
- Footer con badge del icono del concepto

**Plantilla reducida** (`instituciones.html`, `peliculas.html`): sin TOC, sin `section-num`, sin MathJax. Grid de 2 columnas con tarjetas. `instituciones.html` usa enlaces externos (YouTube + sitio oficial). `peliculas.html` usa links de YouTube sin iframes (evitar error 153 de embedding bloqueado).

**Diferenciación visual entre conceptos** (cada página define su propio `accent` en `tailwind.config`):
| Concepto | Color `accent` | Icono footer | Tema |
|----------|---------------|--------------|------|
| Aceleradores | `#7C4DFF` violeta | `lucide:zap` | Ciclotrones, sincrotrones, TANDAR, BNCT, Dr. Kreiner |
| Antimateria | `#EC4899` fucsia | `lucide:equal-not` | Dirac, positrón, aniquilación, PET, asimetría |
| Aplicaciones | `#DC2626` rojo | `lucide:stethoscope` | Energía eléctrica, medicina, industria, propulsión, agua/hidrógeno, monitoreo, TIE, BNCT |
| Argentina | `#75AADB` celeste | `lucide:map-pin` | CNEA, NA-SA, INVAP, CAREM, TANDAR |
| Átomos | `#F59E0B` ámbar | `lucide:atom` | Estructura atómica, Schrödinger |
| Cósmicos | `#7C4DFF` violeta | `lucide:particles` | Rayos cósmicos, Pierre Auger |
| Dosis | `#14B8A6` teal | `lucide:shield` | Gy/Sv/mSv, dosis típicas, límites ICRP/ARN, radón, dosimetría, tiempo/distancia/blindaje, ALARA |
| Espectro | `#7C4DFF` violeta | `lucide:radio` | Espectro electromagnético |
| Energías | `#10B981` verde esmeralda | `lucide:leaf` | Matriz argentina, renovables (hidro, eólica, solar, biomasa, geotermia), fósiles, emisiones CO₂, nuclear en la matriz |
| Fisión | `#DC2626` rojo | `lucide:split` | Reacción en cadena, U-235 |
| Fuerzas | `#00E5FF` cian | `lucide:zap` | Gravitatoria, EM, débil, fuerte |
| Fusión | `#3B82F6` azul | `lucide:merge` | Plasma, tokamaks, estrellas |
| Instituciones | `#75AADB` celeste | `lucide:landmark` | Plantilla reducida, 9 tarjetas (incluye UNSAM) |
| Materia Oscura | `#4F46E5` índigo | `lucide:eye-off` | WIMP, rotación galáctica, Zwicky, Rubin, 27% |
| Medicina | `#DC2626` rojo | `lucide:stethoscope` | Radiología, gammagrafía, SPECT, PET, radioterapia, protones, braquiterapia, teranóstica, BNCT, esterilización |
| Mundo | `#2563EB` blue-600 | `lucide:globe` | Flota mundial, países líderes, en construcción, SMR, Generación IV, COP28 |
| Radiaciones | `#FF6E40` naranja | `lucide:radio` | α, β, X, γ, neutrones |
| Radioisótopos | `#26A69A` verde | `lucide:flask-conical` | Co-60, Tc-99m, I-131 |
| Reactores | `#FFB300` ámbar | `lucide:atom` | Atucha I/II, Embalse, CAREM |
| Residuos | `#EAB308` yellow | `lucide:archive` | Clasificación (MBBA/ABBA/MVA/AVA), gestión, transporte, Onkalo, debate |

Nota: los iconos del footer de cada página pueden diferir de los iconos usados en las tarjetas de `index.html`. Mantener ambos.

### Artículos de revista (`conceptos/revista/*.html`)
10 artículos largos sobre personas/eventos clave: Balseiro, Bomba Atómica, Chernobyl, Curie, Einstein, Fermi, Fukushima, Meitner, Oklo, Propulsión nuclear.
- Reutilizan la plantilla de conceptos pero con nav simplificada y **sin TOC lateral ni `section-num`**
- Cada uno define su propio `accent` según la temática (ver árbol de estructura)
- Sin MathJax (las ecuaciones se muestran como imágenes o texto simple)
- Sin footer

### Página de Películas y Series (`conceptos/peliculas.html`)
- Plantilla reducida (sin TOC, sin section-num, sin MathJax)
- 12 tarjetas en grid de 2 columnas con: título, año, tipo (badge de color), descripción, link IMDb
- **Sin iframes de YouTube**: todos los tráilers se abren como link externo (click → YouTube). Esto evita el error 153 por embedding bloqueado.
- 5 tarjetas tienen link directo al video de YouTube (IDs verificados vía oembed API)
- 6 tarjetas tienen link de búsqueda en YouTube (términos específicos para el tráiler oficial)
- 1 tarjeta (The Day After Trinity) linkea a Internet Archive

### Contenido enriquecido

**BNCT (Terapia por Captura Neutrónica de Boro)**:
- `aceleradores.html` sec06: historia argentina (RA-6 Bariloche), melanoma, glioblastoma, acelerador compacto Kreiner/UNSAM
- `aplicaciones.html` sec10: cómo funciona (boro-10 + neutrones), Argentina pionera mundial
- `medicina.html` sec10: dos pasos de la técnica (boro-10 + neutrones, 5–9 µm), RA-6 Bariloche, proyecto Kreiner, cross-link a `aplicaciones.html#sec10`

**Medicina nuclear y radiología** (`medicina.html`, 11 secciones 01–11, sin SVG):
- sec01 Dos mundos: radiología (fuente externa) vs medicina nuclear (radiofármaco), ecuación atenuación \(I_0 e^{-\mu x}\), RM/ecografía no ionizan
- sec02 Radiología: Röntgen 1895, radiografía, mamografía, TC (Hounsfield), fluoroscopia con arco en C, bremsstrahlung
- sec03 Gammagrafía: cámara gamma, Tc-99m >80% procedimientos, Mo-99 del RA-3, tabla de estudios por órgano
- sec04 SPECT y SPECT/CT: rotación del cabezal, colimador de plomo, perfusión miocárdica
- sec05 PET y PET/CT: aniquilación \(e^{+}+e^{-}\to 2\gamma\) 511 keV, F-18 FDG, híbridos, ciclotrones locales
- sec06 Radioterapia externa: LINAC, 3D-CRT, IMRT, VMAT, IGRT, SRS/SBRT, Gamma Knife (192 haces de Co-60), CyberKnife, dato Embalse
- sec07 Protones e iones: pico de Bragg, tumores junto a órganos críticos, niños, costo 30–60 M USD
- sec08 Braquiterapia: LDR (semillas I-125/Pd-103 próstata), HDR (Ir-192), placas oculares, dato RA-3
- sec09 Radiofármacos terapéuticos y teranóstica: I-131, PRRT Lu-177, radioinmunoterapia 90Y, Sm-153/Sr-89/Ra-223, SIRT 90Y, terapia alfa Ac-225/Bi-213, 68Ga-PSMA → 177Lu-PSMA
- sec10 BNCT: cross-link a `aplicaciones.html#sec10`
- sec11 Esterilización e irradiación: Co-60 esteriliza insumos, irradiación de sangre (EICH), cross-link a `aplicaciones.html#sec05`

**Matriz energética argentina** (`energias.html`, hub de 4 secciones 01–04, sin SVG, acento verde esmeralda `#10B981`):
- sec01 La matriz argentina: tabla de generación eléctrica 2024 (térmica ~50%, hidro ~25%, renovables ~16%, nuclear ~7-9%), CAMMESA
- sec02 **Las fuentes, una por una**: grid de 9 cards enlazando a `energias/hidroelectrica.html`, `eolica.html`, `solar.html`, `biomasa.html`, `geotermia.html`, `gas.html`, `petroleo.html`, `carbon.html` y `nuclear.html`
- sec03 Emisiones: tabla CO₂eq/kWh (carbón 740-920, petróleo 800-1000, gas 410-490, biomasa 200-280, solar 40-80, nuclear 5-40, eólica 7-14, hidro 4-30)
- sec04 Transición: base + variable + respaldo + almacenamiento; imágenes en `assets/energias/`

**Dosis y protección radiológica** (`dosis.html`, 6 secciones 01–06, teal `#14B8A6`, footer `lucide:shield`):
- sec01 Qué es la dosis: gray (energía absorbida, Gy) vs sievert (efecto biológico, Sv), \(D=dE/dm\), \(H=D\cdot w_R\), factores de peso \(w_R\)/\(w_T\)
- sec02 Dosis típicas: tabla comparativa (radiografía 0,02 mSv, vuelo 0,03–0,06, fondo 2,4 mSv/año, TC ~8 mSv, límite trabajador 20 mSv)
- sec03 Límites y regulación: ICRP, ARN, 20 mSv/año trabajador (promedio 5 años, máx 50), 1 mSv/año público, pacientes (justificación + optimización), ALARA
- sec04 Radón y fondo natural: radón ~50%, cósmicos ~15%, terrestre ~20%, alimentos ~15%; medicina ≫ centrales en dosis artificial
- sec05 Dosimetría: TLD, OSL, dosímetro electrónico, monitores de área, registros vitalicios
- sec06 Protección práctica: tiempo / distancia / blindaje, ley del inverso del cuadrado \(I_2=I_1(d_1/d_2)^2\)

**Residuos radiactivos** (`residuos.html`, 6 secciones 01–06, yellow `#EAB308`, footer `lucide:archive`):
- sec01 Qué son: actividad y semivida definen el riesgo; volumen diminuto; ley de desintegración \(N(t)=N_0 e^{-\lambda t}\)
- sec02 Clasificación: tabla (exenta/muy baja, baja, media MVA, alta AVA según actividad y semivida)
- sec03 De dónde salen: reactores de potencia, medicina, industria e investigación, minería del uranio
- sec04 Gestión actual: minimizar → acondicionar (cemento/vidrio) → aislar (piscinas, contenedores secos); transporte regulado
- sec05 El repositorio: almacenamiento geológico profundo, Onkalo (Finlandia, granito 450 m), caso argentino (combustible en temporario, candidatos en Patagonia)
- sec06 El debate: argumentos a favor/en contra, deuda intergeneracional, transparencia

**La nuclear en el mundo** (`mundo.html`, 5 secciones 01–05, blue-600 `#2563EB`, footer `lucide:globe`):
- sec01 La flota mundial: ~440 reactores, ~400 GW, ~10% electricidad mundial, ~25% de la limpia, factor de carga más alto
- sec02 Países líderes: tabla (EE.UU. ~93/~19%, Francia ~56/~65%, China ~55, Rusia ~37, Corea ~25, Canadá ~19, Argentina 3/~7-9%); imagen `assets/generated/central-nuclear-argentina.png`
- sec03 En construcción: ~60 unidades, China/India lideran, Egipto (El Dabaa) y Turquía (Akkuyu) primeros programas, Japón revisa su salida
- sec04 SMR y Generación IV: reactores modulares pequeños (hasta 300 MW), CAREM argentino, NuScale/BWRX-300, MSR/SFR/HTGR, ciclo cerrado del combustible
- sec05 Rol en la transición: COP28 declaración de triplicar capacidad nuclear para 2050, cross-links a `argentina.html`, `reactores.html#sec05`, `energias.html`

**Páginas de fuentes de energía** (`conceptos/energias/`, 9 archivos, plantilla completa de conceptos, 4 secciones 01–04):
- Cada página sigue la misma estructura: `sec01` Cómo funciona (paso a paso + ecuación), `sec02` Ubicación en Argentina (imagen en `assets/energias/` + tarjetas), `sec03` Potencia generada (datos de la matriz), `sec04` Ventajas y desventajas. Hero con chips, TOC, breadcrumb `../../index.html / ../../index.html#temas / ../energias.html`, Conceptos Clave, Temas Relacionados, prev/next encadenado (hidro → eólica → solar → biomasa → geotermia → gas → petróleo → carbón → nuclear → hub) y footer.
- `hidroelectrica.html` (sky `#38BDF8`): ecuación \(P=\rho g Q h\), Yacyretá, Salto Grande, El Chocón, Piedra del Águila; 9.000–10.000 MW instalados
- `eolica.html` (cian `#00E5FF`): Patagonia, Loma Blanca; 71% de lo renovable, 16.200 GWh 2024
- `solar.html` (ámbar `#F59E0B`): efecto fotoeléctrico, Cauchari (Jujuy); 17% de lo renovable, 3.900 GWh 2024
- `biomasa.html` (verde `#26A69A`): biogás, biodiésel/bioetanol, carbono neutro, 1.000–1.300 MW
- `geotermia.html` (naranja `#FF6E40`): Copahue, Domuyo, Tuzgle; potencial sin centrales de gran porte
- `gas.html` (`#FFB300`): Vaca Muerta, ~70% de lo térmico, ciclo combinado
- `petroleo.html` (`#D97706`): golfo San Jorge, fueloil/gasoil de respaldo en picos
- `carbon.html` (gris `#9CA3AF`): Río Turbio, central San Nicolás, aporte marginal 1-2%
- `nuclear.html` (rojo `#DC2626`): Atucha I/II, Embalse, CAREM, 1.763 MW, factor >90%, cross-links a `../reactores.html` y `../argentina.html`

**TANDAR y aceleradores argentinos**:
- `aceleradores.html` sec05 expandida: Dr. Andrés Kreiner, salas experimentales (física nuclear, irradiación de materiales, microhaz, biología/metales pesados), FUESMEN, ciclotrones médicos
- `argentina.html` sec05: párrafo sobre TANDAR y aceleradores

**Aplicaciones nucleares** (`aplicaciones.html`, 10 secciones 01–10):
- sec01 Energía eléctrica: SVG animado del ciclo de potencia (reactor → vapor → turbina → generador → red), Atucha I/II, Embalse, CAREM
- sec07 Propulsión naval: SVG de submarino nuclear, USS Nautilus, portaaviones, cross-link a `revista/propulsion.html` (propulsión espacial, viaje a Marte)
- sec08 Agua, hidrógeno y calor: tarjetas de desalinización, hidrógeno "rosa" y calefacción de distrito
- sec09 Monitoreo y seguridad: SVG de pórtico de detección radiológica, trazadores ambientales, CTBTO, ARN
- BNCT pasó a sec10

**Instituciones**:
- `instituciones.html`: 9 tarjetas. UNSAM agregada (física médica, RMN, co-tutelas Alemania). Balseiro y Sabato con descripciones ajustadas.

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

**Penetración de radiaciones** (`radiaciones.html`): carriles horizontales con barreras verticales. Las **partículas** (α, β, n) se dibujan como círculos que recorren `animateMotion` lineales; las **ondas electromagnéticas** (X, γ) como paths sinusoidales con `Q`/`T` (ej.: `path="M 95 215 L 160 209 L 230 291 L 300 279 L 370 291 ..."`) y un trazo tenue de referencia debajo. La atenuación se modela con `opacity` ramp `1→0.25` al cruzar la barrera — la absorción con `flashG` + `opacity 0`. No mezclarlas: gamma **se atenúa** (sigue avanzando, opacity decrece); alfa/beta **se absorben** (flash + desaparecen).

## Paleta de colores

Definida en `tailwind.config` de cada archivo bajo el namespace `nucleo`:
- Base: `black #06090C`, `dark #0B1014`, `gray #141A20`, `mid #1C232A`
- Texto: `silver #A8B5BD`, `silverLight #C8D4DC`, `silverDark #5A6B72`
- Acentos variables según la página (ver tabla arriba)
- Estados: `warning #FFB300` (alertas), `cyan #00E5FF` (énfasis secundario)

## Bugs conocidos y corregidos

- **Wrapper flex en cada `sec0X`**: toda `<section class="reveal mb-16" id="sec0X">` debe abrir explícitamente `<div class="flex items-center gap-4 mb-6">` + `<span class="section-num">0X</span>` + `<div class="accent-line"></div>` + `<h2>` + `</div>`. Si se omite el wrapper y se deja un `</div>` huérfano, el navegador auto-anida todo el resto del `<main>` (incluyendo el footer) y los botones del pie se ven deformados/anchos. Síntoma visual: footer roto, no SVG. Auditoría rápida: `grep -n 'id="sec0X"' *.html` y revisar las 5 líneas siguientes.

- **Anchor `#centrales`**: ~~El footer de varias páginas linkeaba a `../index.html#centrales`, pero index.html no tiene ese id.~~ Corregido en los 6 archivos afectados (aceleradores, fision, fusion, radioisotopos, antimateria, materia-oscura). Cambiado a `#temas`.

- **Enlaces de YouTube en `instituciones.html`**: los handles con formato `@NombreCompleto` (CamelCase) suelen dar 404 — los canales oficiales argentinos usan formatos heredados (`/user/invapin`, `/user/nucleoelectricaarg`, IDs de canal `UC...`, o handles con sufijos `@institutobalseiroIB`). UNSAM verificado: `@unsamoficial` funciona.

- **Embedding de YouTube en `peliculas.html`**: los iframes de YouTube producen error 153 (embedding bloqueado por el uploader) en la mayoría de los tráilers. Solución: no usar iframes. Toda la página usa links externos (click → abre YouTube en pestaña nueva). Para verificar IDs de video antes de usarlos, consultar `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json` — si devuelve 404, el video no existe o no está disponible.

- **Paleta accent variable por página**: cada archivo define su propio `accent` en `tailwind.config` — no asumir un único color. El violeta `#7C4DFF` se repite en 3 conceptos (aceleradores, cósmicos, espectro) por coincidencia temática, no por error. `index.html`, `revista.html` y `peliculas.html` no usan la clave `accent`; usan `cyan`/`oro`.

- **`revista/` no lleva `section-num`**: los artículos usan la plantilla reducida sin secciones numeradas — no forzarles el patrón del main `conceptos/`. Tampoco llevan MathJax ni footer.

- **Penetración de radiaciones — distinción ondas vs partículas**: en el SVG de `radiaciones.html`, las partículas (α, β, n) son círculos que avanzan en línea recta y se absorben con flash; las ondas electromagnéticas (X, γ) son paths sinusoidales que se atenúan (opacity decrece) sin desaparecer. No mezclar los dos patrones.

## Cross-links establecidos

- `aceleradores.html` ↔ `argentina.html` (Temas Relacionados)
- `antimateria.html` ↔ `materia-oscura.html` (prev/next nav + footer)
- `dosis.html` ↔ `residuos.html` ↔ `mundo.html` (prev/next nav encadenado: radiaciones → dosis → residuos → mundo → energias)
- `dosis.html` ↔ `radiaciones.html`, `medicina.html`, `instituciones.html`, `residuos.html` (Temas Relacionados)
- `residuos.html` ↔ `reactores.html`, `radiaciones.html`, `dosis.html`, `instituciones.html` (Temas Relacionados)
- `mundo.html` ↔ `reactores.html`, `argentina.html`, `energias.html`, `fusion.html` (Temas Relacionados; cross-links en sec02/sec04/sec05 a `argentina.html`, `reactores.html#sec05`, `energias.html`)
- `energias.html` ↔ `reactores.html` y `argentina.html` (Temas Relacionados; `energias.html` → `reactores.html` y `argentina.html`); hub ↔ 9 páginas de `energias/` (grid sec02 + nav encadenado)
- `medicina.html` ↔ `aplicaciones.html` (prev/next nav, Temas Relacionados, cross-links en sec10/sec11 → `aplicaciones.html#sec10`/`#sec05`; `aplicaciones.html` sec02 → `medicina.html`)
- `medicina.html` ↔ `radioisotopos.html` y `antimateria.html` (Temas Relacionados)
- Películas linkeada desde nav de `index.html`, footer de `index.html` y `revista.html`

## Notas para futuras instancias

- **No usar `npm` ni crear `package.json`**: el proyecto es deliberadamente sin build. Todo se carga por CDN.
- **Mantener coherencia visual** entre páginas: misma nav, mismo footer, mismas fuentes, mismo patrón de breadcrumb.
- **Imágenes**: usar URLs estables. Wikimedia Commons funciona para reactores argentinos; Unsplash para imágenes genéricas. Las URLs de Wikimedia con hashes incorrectos dan 404 — verificar antes de usar.
- **Gradientes SVG**: los productos de fisión se diferencian por color (`baGrad` dorado, `krGrad` naranja, `xeGrad` cian, `srGrad` verde) según el canal de fisión real.
- **Datos técnicos de reactores argentinos** (Atucha I, Atucha II, Embalse, CAREM, INVAP) están en la página principal — mantener consistencia si se expanden.
- **No hay tests automatizados** ni CI. La verificación es manual abriendo las páginas en el navegador.

## SEO y favicon

- Todas las páginas llevan `<meta name="description">` única, Open Graph (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:image`) y Twitter Card. El favicon es `assets/favicon.svg` (átomo cian), referenciado con `<link rel="icon" type="image/svg+xml">` y rutas relativas por profundidad.
- `og:image` apunta a `assets/generated/hero-laboratorio-nuclear.png` con ruta relativa (no hay dominio). Si el sitio se aloja con URL pública, convertir a URL absoluta.
- Las descripciones se mantienen en sincronía manualmente al crear/renombrar páginas; el verificador (`tools/verificar-links.ps1`) comprueba que el `<head>` tenga `meta description` y favicon en cada archivo.
- Al crear una página nueva, copiar el bloque meta completo de una existente y ajustar `title`, `description` y la ruta del favicon/og:image según la profundidad (`.`, `../`, `../../`).
