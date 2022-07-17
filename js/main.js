//import getWord from "./fetch.js";

const tablero = document.querySelector(".tile-container");
const teclado = document.querySelector(".keyboard-container");

fetch("../data/palabras.json")
  .then((response) => response.json())
  .then((data) => console.log(randomWord(data)))
  .catch((error) => {
    console.log(error);
  });

function randomWord(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

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
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "«",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentBox = 0;

guessRows.forEach((guessRow, indexFila) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", `guessRow-${indexFila}`);
  tablero.appendChild(rowElement);
  guessRow.forEach((caja, indexCaja) => {
    const boxElement = document.createElement("div");
    boxElement.setAttribute(
      "id",
      `guessRow-${indexFila}-posicion-${indexCaja}`
    );
    boxElement.classList.add("tile");
    rowElement.appendChild(boxElement);
  });
});

teclas.forEach((tecla) => {
  const botonTecla = document.createElement("button");
  botonTecla.textContent = tecla;
  botonTecla.setAttribute("id", tecla);
  botonTecla.addEventListener("click", () => handleClick(tecla));
  teclado.append(botonTecla);
});

const handleClick = (tecla) => {
  console.log("Clickie", tecla);
  if (tecla === "«") {
    console.log("Borrar");
    return;
  }
  if (tecla === "ENTER") {
    console.log("Enter");
    return;
  }
  addLetter(tecla);
};

const addLetter = (letter) => {
  const box = document.getElementById(
    `guessRow-${currentRow}-posicion-${currentBox}`
  );
  console.log("Fila", currentRow);
  console.log("Caja", currentBox);
  box.innerText = letter;
  guessRows[currentRow][currentBox];
  currentBox++;
  console.log(guessRows);
};
