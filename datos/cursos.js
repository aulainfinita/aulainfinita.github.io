// Lista de cursos que aparecen en cursos.html.
// Para agregar un curso, copia un bloque { ... }, pégalo debajo y cambia sus datos.
// materia: "matematicas", "ciencias" o "programacion" (define el color).
// id: palabra corta sin espacios; los videos de este curso usan el mismo id.
// examen: ruta del examen del curso, o "" si todavía no tiene.
// disponible: true si ya se puede usar, false para mostrarlo como "Próximamente".
var CURSOS = [
  {
    id: "algebra",
    titulo: "Álgebra",
    materia: "matematicas",
    grado: "3er grado, CBTis 236",
    descripcion: "Lenguaje algebraico, términos semejantes y ecuaciones de primer grado.",
    examen: "examenes/algebra-3er-grado.html",
    disponible: true
  },
  {
    id: "ciencias",
    titulo: "Ciencias",
    materia: "ciencias",
    grado: "",
    descripcion: "Primero el fenómeno, después el modelo y al final la teoría.",
    examen: "",
    disponible: false
  },
  {
    id: "programacion",
    titulo: "Programación",
    materia: "programacion",
    grado: "",
    descripcion: "Qué “piensa” la computadora: variables, memoria y flujo del programa.",
    examen: "",
    disponible: false
  }
];
