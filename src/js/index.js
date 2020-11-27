// URL de petición para obtener todos los pokemon
const URL_ALL_POKEMONS = 'https://pokeapi.co/api/v2/pokemon?limit=386';
// Array para guardar el resultado de la petición
let allPokemonInfo = [];
// Estado actual de la pokedex
let pokedex = [];
// Array de todos los nombres de los pokemon que faltan por capturar
let remainingPokemons = [];
// Respuesta correcta
let correctAnswer = '';

// DOM
const pokeImage = document.getElementById('poke-image');
const answersList = document.getElementById('poke-answers');
const loader = document.getElementById('loader');
const pokedexElement = document.getElementById('pokedex');

const getRandomNumber = (max = 386) => Math.floor(Math.random() * max) + 1;

/* 
  ORDEN DE EJECUCIÓN
  1 - Comprobar si ya tenemos una pokedex en el localstorage y si no la creamos
  2 - Rellenamos el array para saber los pokemon que nos quedan por capturar
  2 - Pintamos la pokedex en pantalla
  3 - Generamos las respuestas posibles
  4 - Pintamos las respuestas y el gif del pokemon
  3 - Empezamos el juego
*/

const checkPokedex = () => {
  // Si ya tenemos pokedex la usamos
  if (localStorage.getItem('pokedex')) {
    pokedex = JSON.parse(localStorage.getItem('pokedex'));
    allPokemonInfo = pokedex.map(pokemon => pokemon.name);
    fillRemainingPokemons();
  } else {
    // Si no, hacemos la peticion y creamos una
    fetch(URL_ALL_POKEMONS)
      .then(res => res.json())
      .then(data => {
        allPokemonInfo = data.results.map(pokemon => pokemon.name);
        pokedex = allPokemonInfo.map((pokemon, idx) => ({
          id: idx + 1,
          name: pokemon,
          catched: false
        }));
        localStorage.setItem('pokedex', JSON.stringify(pokedex));
        fillRemainingPokemons();
      });
  }
};

const fillRemainingPokemons = () => {
  pokedex.forEach(pokemon => {
    if (!pokemon.catched) {
      remainingPokemons.push(pokemon.name);
    }
  });
  // Pintamos la pokedex
  createPokedex();
};

const createPokedex = () => {
  // Vaciamos la pokedex
  pokedexElement.textContent = '';
  const fragment = document.createDocumentFragment();
  /* 
  Creamos la estructura de la tarjeta
  <div class="card-container">
    <div class="card" data-id="5">
      <div class="card__front">
        <div class="card__image-container">
        <img src="pokemon">
        </div>
        <div class="card__info">
          <p>#id - name</p>
        </div>
      </div>
      <div class="card__back">
        <div class="card__pokeball"></div>
      </div>
    </div>
  */
  pokedex.forEach(pokemon => {
    const pokecardContainer = document.createElement('div');
    pokecardContainer.classList.add('card-container');
    const pokecard = document.createElement('div');
    pokecard.classList.add('card');
    pokecard.dataset.id = pokemon.id;
    const pokecardFront = document.createElement('div');
    pokecardFront.classList.add('card__front');
    const pokecardImageContainer = document.createElement('div');
    pokecardImageContainer.classList.add('card__image-container');
    const pokecardImage = document.createElement('img');
    pokecardImage.classList.add('card__image');
    pokecardImage.src = `/assets/images/png/${pokemon.name}.png`;
    pokecardImageContainer.appendChild(pokecardImage);
    pokecardFront.appendChild(pokecardImageContainer);
    const pokecardInfo = document.createElement('div');
    pokecardInfo.classList.add('card__info');
    const pokecardInfoText = document.createElement('p');
    pokecardInfoText.classList.add('card__text');
    pokecardInfoText.textContent = `#${pokemon.id} - ${pokemon.name}`;
    pokecardInfo.appendChild(pokecardInfoText);
    pokecardFront.appendChild(pokecardInfo);
    const pokecardBack = document.createElement('div');
    pokecardBack.classList.add('card__back');
    const pokeball = document.createElement('div');
    pokeball.classList.add('card__pokeball');
    if (pokemon.catched) {
      pokecard.classList.add('card--show');
    }
    pokecard.appendChild(pokecardFront);
    pokecardBack.appendChild(pokeball);
    pokecard.appendChild(pokecardBack);
    pokecardContainer.appendChild(pokecard);
    fragment.appendChild(pokecardContainer);
  });
  pokedexElement.appendChild(fragment);
  getAnswers();
};

const getAnswers = (answers = 5) => {
  const options = [];
  const currentPokemon = remainingPokemons[getRandomNumber()];
  options.push(currentPokemon);
  while (options.length < answers) {
    const newAnswer = allPokemonInfo[getRandomNumber()];
    if (!options.includes(newAnswer)) {
      options.push(newAnswer);
    }
  }
  correctAnswer = options[0];

  const allAnswers = options.sort(() => Math.random() - 0.5);

  writeGame(allAnswers);
};

const writeGame = answers => {
  answersList.textContent = '';
  const fragment = document.createDocumentFragment();
  for (const answer of answers) {
    const listItem = document.createElement('li');
    listItem.textContent = answer;
    fragment.append(listItem);
  }
  loader.style.display = 'none';
  pokeImage.classList.remove('game__image--show');
  pokeImage.classList.add('game__image');
  pokeImage.src = `/assets/images/gif/${correctAnswer}.gif`;
  answersList.append(fragment);
};

const catchPokemon = () => {
  const caughtPokemon = pokedex.findIndex(
    pokemon => pokemon.name === correctAnswer
  );

  pokedex[caughtPokemon].catched = true;
  remainingPokemons.splice(caughtPokemon, 1);

  getPokemonCard(pokedex[caughtPokemon].id - 1);

  localStorage.setItem('pokedex', JSON.stringify(pokedex));
};

const getPokemonCard = id => {
  const allPokemonsCards = [...document.querySelectorAll('.card-container')];
  const pokemonCard = allPokemonsCards[id];
  pokedexElement.scrollTo({
    top: pokemonCard.offsetTop - 400,
    behavior: 'smooth'
  });

  fetch(`https://pokeapi.co/api/v2/pokemon/${id + 1}/`)
    .then(res => res.json())
    .then(({ id, name, types }) => {
      pokemonCard.addEventListener('transitionend', e => {
        setTimeout(() => {
          getAnswers();
        }, 1000);
      });

      setTimeout(() => {
        pokemonCard.firstElementChild.classList.add(types[0].type.name);
        pokemonCard.firstElementChild.classList.add('card--show');
      }, 1500);
    });
};

answersList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    if (e.target.textContent === correctAnswer) {
      pokeImage.classList.add('game__image--show');
      catchPokemon();
    } else {
      getAnswers();
    }
  }
});

checkPokedex();
