

const M = {
  steel: new THREE.MeshStandardMaterial({ name: 'steel', color: 0xd7dbe0, roughness: 0.32, metalness: 0.38 }),
  steel_dark: new THREE.MeshStandardMaterial({ name: 'steel_dark', color: 0x9199a1, roughness: 0.42, metalness: 0.35 }),
  tile_black: new THREE.MeshStandardMaterial({ name: 'tile_black', color: 0x1a1c20, roughness: 0.85, metalness: 0.05 }),
  engine_black: new THREE.MeshStandardMaterial({ name: 'engine_black', color: 0x26282c, roughness: 0.5, metalness: 0.3 }),
  plumbing: new THREE.MeshStandardMaterial({ name: 'plumbing', color: 0x3a3d42, roughness: 0.45, metalness: 0.4 }),
};

const R = 4.5;           // hull radius (9 m diameter)
const BOOSTER_TOP = 69;  // top of booster barrel
const HOT_RING_TOP = 71.5;
const SHIP_BARREL_TOP = 102;
const NOSE_TOP = 124;

function mesh(name, geo, mat) {
  const m = new THREE.Mesh(geo, mat);
  m.name = name;
  return m;
}

/** Simplified Raptor: bell nozzle + throat + powerhead block + turbo plumbing. */
function raptor(name, exitR, len, vacuum) {
  const g = new THREE.Group();
  g.name = name;
  const throatR = exitR * 0.34;
  // bell: lathe so the contour flares like a real nozzle
  const pts = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = throatR + (exitR - throatR) * Math.pow(t, vacuum ? 0.62 : 0.78);
    pts.push(new THREE.Vector2(r, -len * t));
  }
  g.add(mesh(name + '_bell', new THREE.LatheGeometry(pts, 40), M.engine_black));
  g.add(mesh(name + '_throat', new THREE.CylinderGeometry(throatR * 0.9, throatR, len * 0.18, 24), M.engine_black));
  const head = mesh(name + '_powerhead', new THREE.CylinderGeometry(throatR * 1.35, throatR * 1.2, len * 0.3, 20), M.plumbing);
  head.position.y = len * 0.22;
  g.add(head);
  const dome = mesh(name + '_dome', new THREE.SphereGeometry(throatR * 1.15, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.plumbing);
  dome.position.y = len * 0.36;
  g.add(dome);
  // two turbopumps flanking the powerhead
  for (const s of [-1, 1]) {
    const p = mesh(name + '_turbopump', new THREE.CylinderGeometry(throatR * 0.5, throatR * 0.5, len * 0.26, 16), M.plumbing);
    p.position.set(s * throatR * 1.5, len * 0.14, 0);
    g.add(p);
    const duct = mesh(name + '_duct', new THREE.TorusGeometry(throatR * 0.85, throatR * 0.2, 10, 20, Math.PI * 1.1), M.plumbing);
    duct.rotation.set(Math.PI / 2, 0, s * 0.4);
    duct.position.set(s * throatR * 0.9, -len * 0.1, 0);
    g.add(duct);
  }
  return g;
}

function ring(count, radius, y, build, phase = 0) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = phase + (i / count) * Math.PI * 2;
    const o = build(i);
    o.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
    out.push(o);
  }
  return out;
}

/** Raised raceway / chine strip running along a hull section. */
function raceway(name, angle, y0, y1, width = 0.55, depth = 0.35) {
  const h = y1 - y0;
  const m = mesh(name, new THREE.BoxGeometry(width, h, depth), M.steel_dark);
  m.position.set(Math.cos(angle) * (R + depth * 0.3), (y0 + y1) / 2, Math.sin(angle) * (R + depth * 0.3));
  m.rotation.y = -angle;
  return m;
}

/** Aero flap: plate thin in the vertical axis, spanning radially outward. */
function flap(name, span, chord, thick, angle, y, tilt) {
  const g = new THREE.Group();
  g.name = name;
  const blade = mesh(name + '_panel', new THREE.BoxGeometry(span, thick, chord), M.steel);
  blade.position.x = span / 2;
  g.add(blade);
  const tip = mesh(name + '_tip', new THREE.BoxGeometry(0.3, thick * 1.2, chord * 0.98), M.steel_dark);
  tip.position.x = span - 0.1;
  g.add(tip);
  const edge = mesh(name + '_leading_edge', new THREE.BoxGeometry(span * 0.98, thick * 1.15, chord * 0.1), M.steel_dark);
  edge.position.set(span / 2, 0, chord / 2 - chord * 0.05);
  g.add(edge);
  const hinge = mesh(name + '_hinge', new THREE.CylinderGeometry(thick * 1.5, thick * 1.5, chord * 0.9, 18), M.steel_dark);
  hinge.rotation.x = Math.PI / 2;
  hinge.position.x = 0.5;
  g.add(hinge);
  g.position.set(Math.cos(angle) * (R - 0.15), y, Math.sin(angle) * (R - 0.15));
  g.rotation.y = -angle;
  g.rotateZ(tilt);
  return g;
}

function buildStarship() {
  const stack = new THREE.Group();
  stack.name = 'starship_full_stack';

  /* ---------- Super Heavy booster ---------- */
  const booster = new THREE.Group();
  booster.name = 'super_heavy_booster';
  stack.add(booster);

  const skirtH = 4.2;
  const skirtBase = 2.2;   // bells reach below the skirt, as on the real booster
  booster.add((() => {
    const m = mesh('booster_engine_skirt', new THREE.CylinderGeometry(R, R * 0.985, skirtH, 64, 1, true), M.steel_dark);
    m.position.y = skirtBase + skirtH / 2;
    m.material.side = THREE.DoubleSide;
    return m;
  })());
  booster.add((() => {
    const m = mesh('booster_barrel', new THREE.CylinderGeometry(R, R, BOOSTER_TOP - skirtH - skirtBase, 64, 1, true), M.steel);
    m.position.y = skirtBase + skirtH + (BOOSTER_TOP - skirtH - skirtBase) / 2;
    m.material.side = THREE.DoubleSide;
    return m;
  })());
  booster.add((() => {
    const m = mesh('booster_thrust_dome', new THREE.SphereGeometry(R * 0.98, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2), M.steel_dark);
    m.position.y = skirtBase + skirtH + 0.2;
    return m;
  })());

  // 33 Raptors: 3 gimbaling center, 10 mid ring, 20 outer ring
  const engines = new THREE.Group();
  engines.name = 'booster_raptors';
  booster.add(engines);
  const engLen = 4.2, engR = 1.2, engTop = 4.6;
  let n = 0;
  const place = (count, radius) =>
    ring(count, radius, engTop, () => raptor('raptor_' + (++n), engR, engLen, false)).forEach((e) => engines.add(e));
  place(3, 1.35);
  place(10, 2.6);
  place(20, 3.85);

  // hull detail: raceways + downcomer fairing
  booster.add(raceway('booster_raceway_a', 0.35, skirtH, BOOSTER_TOP - 1.5));
  booster.add(raceway('booster_raceway_b', 0.62, skirtH + 6, BOOSTER_TOP - 1.5, 0.9, 0.5));
  booster.add(raceway('booster_raceway_c', -0.25, skirtH + 2, BOOSTER_TOP - 14, 0.7, 0.45));
  booster.add((() => {
    const m = mesh('booster_lox_fairing', new THREE.CylinderGeometry(0.95, 0.95, 22, 24, 1, false, 0, Math.PI), M.steel_dark);
    m.position.set(Math.cos(1.1) * (R - 0.1), skirtH + 8, Math.sin(1.1) * (R - 0.1));
    m.rotation.y = -1.1 + Math.PI / 2;
    return m;
  })());

  // 4 grid fins near the top
  const fins = new THREE.Group();
  fins.name = 'grid_fins';
  booster.add(fins);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const f = new THREE.Group();
    f.name = 'grid_fin_' + (i + 1);
    const frame = mesh('grid_fin_frame_' + (i + 1), new THREE.BoxGeometry(5.2, 0.7, 3.6), M.steel_dark);
    f.add(frame);
    for (let j = 0; j < 5; j++) {
      const b = mesh('grid_fin_lattice_' + (i + 1) + '_' + j, new THREE.BoxGeometry(4.4, 0.75, 0.12), M.steel_dark);
      b.position.z = -1.2 + j * 0.6;
      f.add(b);
    }
    for (let j = 0; j < 7; j++) {
      const b = mesh('grid_fin_rib_' + (i + 1) + '_' + j, new THREE.BoxGeometry(0.12, 0.75, 2.9), M.steel_dark);
      b.position.x = -1.9 + j * 0.63;
      f.add(b);
    }
    const root = mesh('grid_fin_root_' + (i + 1), new THREE.BoxGeometry(1.1, 1.4, 1.4), M.steel_dark);
    root.position.x = -2.6;
    f.add(root);
    f.position.set(Math.cos(a) * (R + 2.9), BOOSTER_TOP - 5.5, Math.sin(a) * (R + 2.4));
    f.rotation.y = -a;
    fins.add(f);
  }

  // hot-stage ring: vented lattice collar at the booster's top
  const hot = new THREE.Group();
  hot.name = 'hot_stage_ring';
  booster.add(hot);
  hot.add((() => {
    const m = mesh('hot_stage_shell', new THREE.CylinderGeometry(R * 1.02, R * 1.02, HOT_RING_TOP - BOOSTER_TOP, 64, 1, true), M.steel_dark);
    m.position.y = BOOSTER_TOP + (HOT_RING_TOP - BOOSTER_TOP) / 2;
    m.material.side = THREE.DoubleSide;
    return m;
  })());
  ring(40, R * 1.02, HOT_RING_TOP - 0.5, (i) =>
    mesh('hot_stage_vent_' + i, new THREE.BoxGeometry(0.42, 1.6, 0.5), M.steel_dark)
  ).forEach((v, i) => {
    v.rotation.y = -((i / 40) * Math.PI * 2);
    hot.add(v);
  });

  /* ---------- Starship upper stage ---------- */
  const ship = new THREE.Group();
  ship.name = 'starship_upper_stage';
  stack.add(ship);

  const shipBase = HOT_RING_TOP;
  ship.add((() => {
    const m = mesh('ship_barrel', new THREE.CylinderGeometry(R, R, SHIP_BARREL_TOP - shipBase, 64, 1, true), M.steel);
    m.position.y = shipBase + (SHIP_BARREL_TOP - shipBase) / 2;
    m.material.side = THREE.DoubleSide;
    return m;
  })());

  // ogive nose
  const nosePts = [];
  const noseH = NOSE_TOP - SHIP_BARREL_TOP;
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = R * Math.pow(Math.cos(t * Math.PI * 0.5), 0.62);
    nosePts.push(new THREE.Vector2(Math.max(r, 0.001), SHIP_BARREL_TOP + noseH * t));
  }
  ship.add(mesh('ship_nose_cone', new THREE.LatheGeometry(nosePts, 64), M.steel));

  // windward heat-shield tiles (dark half shell on hull + nose)
  ship.add((() => {
    const m = mesh('heat_shield_tiles_hull', new THREE.CylinderGeometry(R + 0.06, R + 0.06, SHIP_BARREL_TOP - shipBase - 0.4, 64, 1, true, Math.PI * 0.58, Math.PI * 0.84), M.tile_black);
    m.position.y = shipBase + (SHIP_BARREL_TOP - shipBase) / 2;
    m.material.side = THREE.DoubleSide;
    return m;
  })());
  ship.add((() => {
    const pts = nosePts.map((p) => new THREE.Vector2(p.x * 1.012 + 0.02, p.y));
    const m = mesh('heat_shield_tiles_nose', new THREE.LatheGeometry(pts, 64, Math.PI * 0.58, Math.PI * 0.84), M.tile_black);
    m.material.side = THREE.DoubleSide;
    return m;
  })());

  // aft flaps (large, low) and forward flaps (small, at nose base)
  ship.add(flap('aft_flap_port', 7.2, 6.6, 0.5, -Math.PI * 0.3, shipBase + 8.5, -0.34));
  ship.add(flap('aft_flap_starboard', 7.2, 6.6, 0.5, Math.PI * 0.3, shipBase + 8.5, -0.34));
  ship.add(flap('forward_flap_port', 5.6, 5.2, 0.42, -Math.PI * 0.32, SHIP_BARREL_TOP - 0.6, 0.28));
  ship.add(flap('forward_flap_starboard', 5.6, 5.2, 0.42, Math.PI * 0.32, SHIP_BARREL_TOP - 0.6, 0.28));

  // hull detail
  ship.add((() => {
    const m = mesh('ship_raceway', new THREE.BoxGeometry(0.5, SHIP_BARREL_TOP - shipBase - 6, 0.32), M.steel_dark);
    m.position.set(Math.cos(0.15) * (R + 0.1), shipBase + (SHIP_BARREL_TOP - shipBase) / 2, Math.sin(0.15) * (R + 0.1));
    m.rotation.y = -0.15;
    return m;
  })());
  ring(2, R + 0.12, shipBase + (SHIP_BARREL_TOP - shipBase) / 2 + 2, (i) =>
    mesh('ship_header_line_' + i, new THREE.BoxGeometry(0.22, SHIP_BARREL_TOP - shipBase - 14, 0.22), M.steel_dark), -0.35
  ).forEach((o, i) => { o.rotation.y = 0.35 - i * Math.PI; ship.add(o); });

  // 3 sea-level + 3 vacuum Raptors tucked in the ship's aft
  const shipEngines = new THREE.Group();
  shipEngines.name = 'ship_raptors';
  ship.add(shipEngines);
  ring(3, 1.5, shipBase + 4.4, (i) => raptor('ship_raptor_sl_' + (i + 1), 1.1, 3.0, false), 0.5)
    .forEach((e) => shipEngines.add(e));
  ring(3, 3.1, shipBase + 5.6, (i) => raptor('ship_raptor_vac_' + (i + 1), 1.9, 4.3, true), 0.5 + Math.PI / 3)
    .forEach((e) => shipEngines.add(e));
  ship.add((() => {
    const m = mesh('ship_aft_skirt', new THREE.CylinderGeometry(R * 0.99, R * 0.99, 1.4, 64, 1, true), M.steel_dark);
    m.position.y = shipBase + 0.7;
    m.material.side = THREE.DoubleSide;
    return m;
  })());

  // Rótulo negro "STARSHIP" sobre la cara limpia del Super Heavy.
  // Se ubica lejos de los raceways para que permanezca legible en la vista inicial.
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 256;
  labelCanvas.height = 1024;
  const labelContext = labelCanvas.getContext('2d');
  labelContext.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
  labelContext.translate(labelCanvas.width / 2, labelCanvas.height / 2);
  labelContext.rotate(Math.PI / 2);
  labelContext.fillStyle = '#05070a';
  labelContext.font = '700 116px "Inter", Arial, sans-serif';
  labelContext.textAlign = 'center';
  labelContext.textBaseline = 'middle';
  labelContext.letterSpacing = '14px';
  labelContext.fillText('STARSHIP', 0, 0);

  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  labelTexture.anisotropy = 8;

  const wordmark = mesh(
    'starship_wordmark',
    new THREE.PlaneGeometry(2.45, 15.5),
    new THREE.MeshBasicMaterial({
      name: 'starship_wordmark_black',
      map: labelTexture,
      transparent: true,
      alphaTest: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    })
  );
  wordmark.position.set(0, 37, R + 0.035);
  wordmark.renderOrder = 2;
  booster.add(wordmark);

  return stack;
}
window.buildStarship = buildStarship;
