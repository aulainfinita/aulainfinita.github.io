// Menú flotante: sombra al bajar, indicador que se desliza y menú desplegable en celular.
(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;
  var links = nav.querySelector(".nav-links");
  var indicador = nav.querySelector(".nav-indicador");
  var boton = nav.querySelector(".nav-boton");
  var actual = links.querySelector("[aria-current=page]");

  // Sombra cuando la página ya bajó un poco
  function revisarScroll() { nav.classList.toggle("con-sombra", window.scrollY > 8); }
  window.addEventListener("scroll", revisarScroll, { passive: true });
  revisarScroll();

  // Indicador: se mueve bajo el enlace con el cursor y regresa a la página actual
  function moverA(a) {
    if (!indicador) return;
    if (!a) { indicador.style.opacity = 0; return; }
    indicador.style.width = a.offsetWidth + "px";
    indicador.style.transform = "translateX(" + a.offsetLeft + "px)";
    indicador.style.opacity = 1;
  }
  Array.prototype.forEach.call(links.querySelectorAll("a"), function (a, i) {
    a.style.setProperty("--i", i);
    a.addEventListener("mouseenter", function () { moverA(a); });
    a.addEventListener("focus", function () { moverA(a); });
  });
  links.addEventListener("mouseleave", function () { moverA(actual); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moverA(actual); });
  window.addEventListener("resize", function () { moverA(actual); });
  moverA(actual);

  // Celular: abrir y cerrar el menú
  function cerrar() { nav.classList.remove("abierto"); boton.setAttribute("aria-expanded", "false"); }
  boton.addEventListener("click", function () {
    var abierto = nav.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", String(abierto));
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });
  document.addEventListener("click", function (e) { if (!nav.contains(e.target)) cerrar(); });
})();
