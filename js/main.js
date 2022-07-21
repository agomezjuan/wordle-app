// Selectores del DOM y variables globales del wordle
const displayJugador = document.querySelector(".jugador-container");
const displayMensaje = document.querySelector(".mensaje-container");
const displayCajas = document.querySelector(".caja-container");
const modal = document.querySelector(".modal-container");
const teclado = document.querySelector(".teclado-container");
let jugador = {
  nombre: "",
  tablero: [],
  wordle: "",
  fecha: new Date().getTime(),
  tiempo: "",
  estadisticas: { aciertos: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fallas: 0 } },
};
let listaPalabras = [];
let wordle = "";
let filaActual = 0;
let cajaActual = 0;
let juegoTerminado = false;

// Variables para el contador
let contadorCall;
let horas = `00`;
let minutos = `00`;
let segundos = `00`;

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
 * Fetch para obtener la palabra a adivinar
 */
function obtenerPalabra() {
  fetch("https://agomezjuan.github.io/wordle-app/data/20.json")
    .then((response) => response.json())
    .then((palabras) => {
      wordle = palabraAleatoria(palabras).toUpperCase();
      return wordle;
    })
    .catch((error) => {
      console.log(error);
    });
}

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
 * se genera una caja donde se muestran las letras elegidas.
 */
const iniciarWordle = () => {
  displayCajas.innerHTML = "";

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
};

/**
 * Por cada letra de la lista de teclas se genera
 * un botón para renderizar el teclado.
 */
const generarTeclado = (habilitado = false) => {
  teclado.innerHTML = "";

  teclas.forEach((tecla) => {
    const botonTecla = document.createElement("button");
    botonTecla.textContent = tecla;
    botonTecla.setAttribute("id", tecla);
    if (!habilitado) {
      botonTecla.setAttribute("disabled", "");
    }
    botonTecla.addEventListener("click", () => {
      if (tecla === "←") {
        quitarLetra();
        return;
      }
      if (tecla === "ENTER") {
        if (cajaActual < 5) {
          mostrarMensaje("¡Rellena las letras que faltan!");
          return;
        }
        verificarFila();
        return;
      }
      ponerLetra(tecla);
    });
    teclado.append(botonTecla);
  });
};

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
    jugador.tablero.push(adivinaUsuario);
    resaltarCajas(filaActual);
    if (adivinaUsuario === wordle) {
      mostrarMensaje("Excelente, has ganado! 🎉", true);
      eliminarJuegoGuardado(jugador.fecha);
      clearInterval(contadorCall);
      juegoTerminado = true;
      return;
    } else {
      if (filaActual >= 5) {
        let contadorDisplay = document.getElementById("contador");
        mostrarMensaje("Que pena, perdiste! 😞", true);
        clearInterval(contadorCall);
        let respuesta = `<p>El wordle era ${wordle}</p>`;
        displayJugador.insertAdjacentHTML("beforeend", respuesta);
        juegoTerminado = true;
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
const mostrarMensaje = (mensaje, permanente = false) => {
  displayMensaje.innerHTML = "";
  const elementoMensaje = document.createElement("p");
  elementoMensaje.innerText = mensaje;
  displayMensaje.append(elementoMensaje);

  if (!permanente) {
    setTimeout(() => {
      displayMensaje.removeChild(elementoMensaje);
    }, 2500);
  }
};

/**
 * Esta función resalta las palabras con colores segun su nivel de acierto
 */
const resaltarCajas = (filaActual) => {
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

/**
 * Contador que muestra el tiempo desde que empezó el juego
 */
const contador = () => {
  const contadorDisplay = document.getElementById("contador");
  segundos++;

  if (segundos < 10) segundos = `0` + segundos;

  if (segundos > 59) {
    segundos = `00`;
    minutos++;

    if (minutos < 10) minutos = `0` + minutos;
  }

  if (minutos > 59) {
    minutos = `00`;
    horas++;

    if (horas < 10) horas = `0` + horas;
  }

  contadorDisplay.innerHTML = `${horas}:${minutos}:${segundos}`;
};

const iniciarContador = (h = `00`, m = `00`, s = `00`) => {
  let contadorDisplay = document.getElementById("contador");
  // Iniciar contador en cero
  horas = h;
  minutos = m;
  segundos = s;
  if (!contadorDisplay) {
    contadorDisplay = document.createElement("p");
    contadorDisplay.setAttribute("id", "contador");
  }
  displayJugador.insertAdjacentElement("beforeend", contadorDisplay);

  contadorCall = setInterval(contador, 1000);
};

/* ----------------- Eventos ------------------ */

// Botón Jugar
const btnJugar = document.querySelector("#jugar");
btnJugar.addEventListener("click", (e) => {
  e.preventDefault();
  if (!jugador.nombre) {
    modal.style.display = "flex";
  } else {
    filaActual = 0;
    cajaActual = 0;
    jugador.tablero = [];
    wordle = obtenerPalabra();
    iniciarWordle();
    generarTeclado(true);
    displayJugador.innerHTML = `<p>¡Mucha suerte, ${jugador.nombre}!</p>`;
    clearInterval(contadorCall);
    juegoTerminado = false;
    // Iniciar contador en cero
    iniciarContador();
    displayMensaje.innerHTML = "";
    console.log(displayJugador.childNodes.length);
    if (displayJugador.childNodes.length > 2) {
      displayJugador.removeChild(displayJugador.lastChild());
    }
  }
});

// Botón Empezar Juego (despues de ecribir el nombre)
const btnEmpezarJuego = document.getElementById("empezar");
btnEmpezarJuego.addEventListener("click", () => {
  const nombre = document.querySelector(".registro input");
  jugador.nombre = nombre.value;

  if (jugador.nombre) {
    displayJugador.innerHTML = "";
    let contadorDisplay = document.getElementById("contador");
    clearInterval(contadorCall);

    iniciarContador();

    // Bienvenida jugador
    displayJugador.insertAdjacentHTML(
      "afterbegin",
      `<p>¡Mucha suerte, ${jugador.nombre}!</p>`
    );

    iniciarWordle();
    generarTeclado(true);
    modal.style.display = "none";
    nombre.value = "";
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  wordle = obtenerPalabra();
  iniciarWordle();
  generarTeclado();
});

const guardarJuego = (jugador) => {
  let juegosGuardados = localStorage.getItem("juegosGuardados")
    ? JSON.parse(localStorage.getItem("juegosGuardados"))
    : [];
  console.log(juegosGuardados);
  if (juegoTerminado) {
    mostrarMensaje("Este juego no se puede guardar porque ya ha terminado.");
  } else {
    jugador.wordle = btoa(wordle);
    clearInterval(contadorCall);
    jugador.tiempo = `${horas}:${minutos}:${segundos}`;
    juegosGuardados.push(jugador);
    localStorage.setItem("juegosGuardados", JSON.stringify(juegosGuardados));
    iniciarWordle();
    generarTeclado();
    mostrarMensaje("Juego guardado correctamente.");
  }
};

const cargarJuego = () => {
  const juegosGuardados = JSON.parse(localStorage.getItem("juegosGuardados"));
  if (!juegosGuardados || juegosGuardados.length == 0) {
    mostrarMensaje("No hay ningún juego guardado");
  } else {
    console.log(juegosGuardados);
    clearInterval(contadorCall);
    generarTeclado(true);

    renderJuegosGuardados(juegosGuardados);
  }
};

const guardar = document.getElementById("guardar");
guardar.addEventListener("click", (e) => {
  e.preventDefault();
  if (!jugador.nombre) {
    mostrarMensaje("No hay ningún jugador");
  } else {
    guardarJuego(jugador);
  }
});

const cargar = document.getElementById("cargar");
cargar.addEventListener("click", (e) => {
  e.preventDefault();
  cargarJuego();
});

function renderJuegosGuardados(juegosGuardados) {
  const listaContainer = document.querySelector(".lista-container");
  if (listaContainer) listaContainer.remove();
  const guardadosContainer = document.createElement("div");
  guardadosContainer.classList.add("lista-container");

  const listaGuardados = document.createElement("div");
  listaGuardados.classList.add("lista-juegos");

  const h2 = `<h2>Juegos guardados</h2>`;
  guardadosContainer.insertAdjacentHTML("afterbegin", h2);

  juegosGuardados.forEach((juego) => {
    const p = document.createElement("p");
    p.classList.add("juego-guardado");
    p.innerHTML = `${juego.nombre} - ${new Date(juego.fecha).toLocaleDateString(
      "es",
      { year: "numeric", month: "short", day: "numeric" }
    )}<br /><span>${juego.tablero}</span>`;

    p.addEventListener("click", () => {
      jugador = juego;
      clearInterval(contadorCall);
      iniciarWordle();
      wordle = atob(juego.wordle);
      horas = juego.tiempo.split(":")[0];
      minutos = juego.tiempo.split(":")[1];
      segundos = juego.tiempo.split(":")[2];
      for (let i = 0; i < juego.tablero.length; i++) {
        filaActual = i;
        const palabra = juego.tablero[i];
        const letras = palabra.split("");
        for (let j = 0; j < letras.length; j++) {
          cajaActual = j;
          ponerLetra(letras[j]);
        }
        resaltarCajas(filaActual);
      }
      jugador.tablero = [];
      verificarFila();

      guardadosContainer.style.display = "none";
      displayJugador.innerHTML = "";
      displayJugador.innerHTML = `<p>¡Mucha suerte, ${juego.nombre}!</p>`;
      iniciarContador(horas, minutos, segundos);
    });

    listaGuardados.insertAdjacentElement("beforeend", p);
  });
  modal.insertAdjacentElement("afterend", guardadosContainer);
  guardadosContainer.insertAdjacentElement("beforeend", listaGuardados);
  guardadosContainer.style.display = "flex";
}

function eliminarJuegoGuardado(fecha) {
  let juegosGuardados = JSON.parse(localStorage.getItem("juegosGuardados"));
  if (juegosGuardados) {
    const juegos = juegosGuardados.filter((juego) => fecha !== juego.fecha);
    localStorage.setItem("juegosGuardados", JSON.stringify(juegos));
  }
}
