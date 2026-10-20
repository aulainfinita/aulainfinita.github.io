// Luz suave que sigue al cursor dentro de cada fila (.fila-item).
(function () {
  if (!window.matchMedia("(hover: hover)").matches) return;
  document.addEventListener("pointermove", function (e) {
    var fila = e.target.closest && e.target.closest(".fila-item");
    if (!fila) return;
    var r = fila.getBoundingClientRect();
    fila.style.setProperty("--x", (e.clientX - r.left) + "px");
    fila.style.setProperty("--y", (e.clientY - r.top) + "px");
  }, { passive: true });
})();
