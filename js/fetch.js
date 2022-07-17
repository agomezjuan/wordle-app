const getWord = async () => {
  try {
    const response = await fetch("https://wordle.danielfrg.com/words/5.json");

    const palabras = await response.json();

    const palabraAleatoria = randomWord(palabras.toUpperCase());

    return palabraAleatoria;
  } catch (error) {
    console.log(error);
  }
};

function randomWord(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

export default getWord;
