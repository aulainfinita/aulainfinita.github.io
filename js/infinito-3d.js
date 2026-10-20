// El ∞ en 3D de la portada: se dibuja al entrar, una luz lo recorre
// y gira un poco siguiendo al cursor y al scroll. Sus colores son las tres materias.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const lienzo = document.getElementById("infinito");
const escenario = lienzo.parentElement;
const reducirMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esCelular = matchMedia("(max-width: 720px)").matches;

// Curva lemniscata (forma de ∞). Las dos ramas se separan en profundidad para no chocar en el centro.
class Lemniscata extends THREE.Curve {
  getPoint(t, destino = new THREE.Vector3()) {
    const a = t * Math.PI * 2, s = Math.sin(a), c = Math.cos(a), d = 1 + s * s;
    return destino.set(1.6 * c / d, 1.6 * s * c / d, 0.42 * s);
  }
}

// Pinta el tubo con un degradado continuo: matemáticas → ciencias → programación → matemáticas
function pintarColores(geometria, tramos, lados) {
  const paradas = ["#2F6FED", "#F2802E", "#7B4DE0", "#2F6FED"].map((h) => new THREE.Color(h));
  const colores = new Float32Array(geometria.attributes.position.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i <= tramos; i++) {
    const u = (i / tramos) * 3, k = Math.min(2, Math.floor(u));
    c.copy(paradas[k]).lerp(paradas[k + 1], u - k);
    for (let j = 0; j <= lados; j++) c.toArray(colores, (i * (lados + 1) + j) * 3);
  }
  geometria.setAttribute("color", new THREE.BufferAttribute(colores, 3));
}

function iniciar() {
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, esCelular ? 1.5 : 2));
  renderer.toneMapping = THREE.NeutralToneMapping;

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.85;

  const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camara.position.set(0, 0, 7.2);

  const luzPrincipal = new THREE.DirectionalLight(0xffffff, 1.6);
  luzPrincipal.position.set(-3, 4, 5);
  escena.add(luzPrincipal);

  const grupo = new THREE.Group();
  escena.add(grupo);

  const curva = new Lemniscata();
  const tramos = esCelular ? 280 : 480, lados = esCelular ? 24 : 40;
  const geometria = new THREE.TubeGeometry(curva, tramos, 0.11, lados, true);
  pintarColores(geometria, tramos, lados);
  const material = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.24, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.1 });
  const tubo = new THREE.Mesh(geometria, material);
  grupo.add(tubo);

  // Luz viajera: un punto blanco que recorre el ∞ e ilumina el tubo a su paso
  const luzViajera = new THREE.PointLight(0xffffff, 7, 2.4, 2);
  const perla = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  grupo.add(luzViajera, perla);

  // Tamaño del lienzo igual a su contenedor
  function ajustar() {
    const w = escenario.clientWidth, h = escenario.clientHeight;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    // En pantallas angostas se aleja la cámara para que el ∞ quepa completo
    camara.position.z = w / h < 1.1 ? 7.2 * (1.1 / (w / h)) : 7.2;
    camara.updateProjectionMatrix();
  }
  new ResizeObserver(() => { ajustar(); if (reducirMovimiento) dibujar(0); }).observe(escenario);
  ajustar();

  // Cursor (de −1 a 1) y avance del scroll dentro de la portada
  const cursor = { x: 0, y: 0 }, giro = { x: 0, y: 0 };
  addEventListener("pointermove", (e) => {
    cursor.x = (e.clientX / innerWidth) * 2 - 1;
    cursor.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  const indices = geometria.index.count, porTramo = lados * 6, punto = new THREE.Vector3();
  const suave = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

  function dibujar(t) {
    // 1) El ∞ se dibuja a sí mismo al entrar
    const avance = reducirMovimiento ? 1 : suave((t - 0.2) / 1.9);
    geometria.setDrawRange(0, Math.min(indices, Math.ceil(avance * tramos) * porTramo));

    // 2) Giro: lento por sí solo y un poco hacia el cursor
    const baseY = reducirMovimiento ? -0.25 : Math.sin(t * 0.22) * 0.3 - 0.15;
    giro.y += (baseY + cursor.x * 0.35 - giro.y) * 0.05;
    giro.x += (0.18 + cursor.y * 0.22 - giro.x) * 0.05;
    const s = Math.min(1, scrollY / Math.max(1, escenario.offsetHeight));
    grupo.rotation.set(giro.x + s * 0.35, giro.y, s * 0.2);
    grupo.position.y = (reducirMovimiento ? 0 : Math.sin(t * 0.8) * 0.05) + s * 0.5;
    grupo.scale.setScalar(1 - s * 0.12);

    // 3) La luz viajera recorre la curva detrás de donde se va dibujando
    const u = reducirMovimiento ? 0.15 : ((t * 0.07) % 1) * avance;
    curva.getPointAt(u, punto);
    perla.position.copy(punto).add(new THREE.Vector3(0, 0, 0.13));
    luzViajera.position.copy(punto).add(new THREE.Vector3(0, 0.15, 0.45));
    perla.visible = avance > 0.98;

    renderer.render(escena, camara);
  }

  // Solo se anima cuando la portada está a la vista
  let visible = true, inicio = performance.now();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(escenario);
  if (reducirMovimiento) dibujar(0);
  else renderer.setAnimationLoop(() => { if (visible && !document.hidden) dibujar((performance.now() - inicio) / 1000); });

  escenario.classList.remove("sin-3d");
  window.__infinito3D = true;
}

try { iniciar(); } catch (e) { escenario.classList.add("sin-3d"); }
