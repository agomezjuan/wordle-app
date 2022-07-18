// Selectores del DOM y variables globales del wordle
const displayMensaje = document.querySelector(".mensaje-container");
const displayCajas = document.querySelector(".caja-container");
const teclado = document.querySelector(".teclado-container");
let listaPalabras = [];
let wordle = "";
let filaActual = 0;
let cajaActual = 0;
let juegoTerminado = false;


// Lista de letras del teclado
const teclas = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Ñ",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "←",
];


/**
 * Por cada letra de la lista de teclas se genera
 * un botón para renderizar el teclado
 */
teclas.forEach((tecla) => {
  const botonTecla = document.createElement("button");
  botonTecla.textContent = tecla;
  botonTecla.setAttribute("id", tecla);
  botonTecla.addEventListener("click", () => {
    //console.log("Click en la tecla", tecla);
    if (tecla === "←") {
      quitarLetra();
      return;
    }
    if (tecla === "ENTER") {
      verificarFila();
      return;
    }
    ponerLetra(tecla);
  });
  teclado.append(botonTecla);
});


/**
 * Fetch para obtener la lista de palabras
 */
fetch("../data/5.json")
  .then((response) => response.json())
  .then((palabras) => {

    listaPalabras = palabras.filter((palabra) => {
      const acentos = ["á", "é", "í", "ó", "ú"];

      for (const letra of palabra.split("")) {
        for (const vocal of acentos) {
          if (letra === vocal) return false;
        }
      }
      return true;
    });

    wordle = palabraAleatoria(listaPalabras).toUpperCase();
    //console.log(wordle);
  })
  .catch((error) => {
    console.log(error);
  });


/**
 * Función para seleccionar una palabra aleatoria de la lista.
 * @param {*} arr
 * @returns String
 */
function palabraAleatoria(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}


// Matriz de adivinar las palabras
const intentosFilas = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];


/**
 * Por cada elemento de la matriz de intentos por adivinar la palabra
 * se genera una caja donde se muestran las letras elegidas
 */
intentosFilas.forEach((intentoFila, indexFila) => {
  const elementoFila = document.createElement("div");
  elementoFila.setAttribute("id", `intentoFila-${indexFila}`);
  displayCajas.appendChild(elementoFila);
  intentoFila.forEach((cajaLetra, indexCaja) => {
    const elementoCaja = document.createElement("div");
    elementoCaja.setAttribute(
      "id",
      `intentoFila-${indexFila}-posicion-${indexCaja}`
    );
    elementoCaja.classList.add("caja");
    elementoFila.appendChild(elementoCaja);
  });
});


/**
 * Esta función pone una letra en la caja de la fila actual de la matriz
 * de intentos por adivinar el wordle
 * @param {*} letra 
 */
const ponerLetra = (letra) => {
  if (filaActual < 6 && cajaActual < 5) {
    const caja = document.getElementById(
      `intentoFila-${filaActual}-posicion-${cajaActual}`
    );
    caja.innerText = letra;
    caja.setAttribute("data", letra);
    intentosFilas[filaActual][cajaActual] = letra;
    cajaActual++;
  }
};


/**
 * Esta función borra la ultima letra puesta en la caja para adivinar
 * el wordle
 */
const quitarLetra = () => {
  if (cajaActual > 0) {
    cajaActual--;
    const caja = document.getElementById(
      `intentoFila-${filaActual}-posicion-${cajaActual}`
    );
    caja.innerText = "";
    caja.setAttribute("data", "");
    intentosFilas[filaActual][cajaActual] = "";
  }
};


/**
 * Esta función verifica si las letras elegidas se corresponden con 
 * la palabra guardada en el wordle
 * @returns 
 */
const verificarFila = () => {
  if (cajaActual > 4) {
    const adivinaUsuario = intentosFilas[filaActual].join("");
    resaltarCajas();
    if (adivinaUsuario === wordle) {
      mostrarMensaje("Excelente, has ganado!");
      juegoTerminado = true;
      return;
    } else {
      if (filaActual >= 5) {
        juegoTerminado = true;
        mostrarMensaje("Que pena, perdiste! :(");
        return;
      }
      if (filaActual < 5) {
        filaActual++;
        cajaActual = 0;
      }
    }
  }
};


/**
 * Esta función muestra un mensaje según el texto enviado por parámetro
 * y se renderiza en el contenedor correspondiente del template HTML
 * @param {*} mensaje 
 */
const mostrarMensaje = (mensaje) => {
  const elementoMensaje = document.createElement("p");
  elementoMensaje.innerText = mensaje;
  displayMensaje.append(elementoMensaje);
  setTimeout(() => {
    displayMensaje.removeChild(elementoMensaje);
  }, 2500);
};


/**
 * Esta función resalta las palabras con colores segun su nivel de acierto
 */
const resaltarCajas = () => {
  const cajasDeFila = document.getElementById(
    `intentoFila-${filaActual}`
  ).childNodes;

  let verificarWordle = wordle;
  const intentoAdivinar = [];

  // Por defecto todas las letras se resaltan en gris
  cajasDeFila.forEach((caja) => {
    intentoAdivinar.push({
      letra: caja.getAttribute("data"),
      color: "resaltado-gris",
    });
  });

  // Si la letra se encuentra en la palabra pero no en la posición exacta
  // se resalta en amarillo
  intentoAdivinar.forEach((intento) => {
    if (verificarWordle.includes(intento.letra)) {
      intento.color = "resaltado-amarillo";
      verificarWordle = verificarWordle.replace(intento.letra, "");
    }
  });

  // Si la letra se encuentra en la posición exacta se resalta en verde
  intentoAdivinar.forEach((intento, index) => {
    if (intento.letra === wordle[index]) {
      intento.color = "resaltado-verde";
      verificarWordle = verificarWordle.replace(intento.letra, "");
    }
  });

  // Para cada caja resaltada se verifica que corresponda a su posición
  cajasDeFila.forEach((caja, index) => {
    const dataLetra = caja.getAttribute("data");
    setTimeout(() => {
      caja.classList.add(intentoAdivinar[index].color);
      document
        .getElementById(dataLetra)
        .classList.add(intentoAdivinar[index].color);
    }, 250 * index);
  });
};
