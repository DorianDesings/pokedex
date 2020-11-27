const URL_ALL_POKEMONS = 'https://pokeapi.co/api/v2/pokemon?limit=386';
let allPokemonInfo = [];
let pokedex = [];
let correctAnswer = '';

// DOM
const pokeImage = document.getElementById('poke-image');
const answersList = document.getElementById('poke-answers');
const loader = document.getElementById('loader');
const pokedexElement = document.getElementById('pokedex');

const getRandomNumber = (max = 386) => Math.floor(Math.random() * max) + 1;

const getAllPokemons = () => {
  loader.style.display = 'block';
  fetch(URL_ALL_POKEMONS)
    .then(res => res.json())
    .then(allPokemons => {
      allPokemonInfo = allPokemons.results.map(pokemon => pokemon.name);
      fillPokedex();
      getAnswers();
    });
};

const getAnswers = (answers = 5) => {
  const options = [];
  const currentPokemon = allPokemonInfo[getRandomNumber()];
  const isCatched = pokedex.find(({ name }) => name === currentPokemon);
  if (!isCatched.catched) {
    options.push(currentPokemon);
    while (options.length < answers) {
      const newAnswerPokemon = allPokemonInfo[getRandomNumber()];
      if (!options.includes(newAnswerPokemon)) {
        options.push(newAnswerPokemon);
      }
    }
    correctAnswer = options[0];

    const allAnswers = options.sort(() => Math.random() - 0.5);

    writeAnswers(allAnswers);
  } else {
    getAnswers();
  }
  options.push(currentPokemon);
  while (options.length < answers) {
    const newAnswerPokemon = allPokemonInfo[getRandomNumber()];
    if (!options.includes(newAnswerPokemon)) {
      options.push(newAnswerPokemon);
    }
  }

  correctAnswer = options[0];

  const allAnswers = options.sort(() => Math.random() - 0.5);

  writeAnswers(allAnswers);
};

const writeAnswers = answers => {
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

const createPokedex = () => {
  pokedexElement.textContent = '';
  const fragment = document.createDocumentFragment();
  pokedex.forEach(pokemon => {
    const pokecardContainer = document.createElement('div');
    pokecardContainer.classList.add('card-container');
    const pokecard = document.createElement('div');
    pokecard.classList.add('card');
    pokecard.dataset.id = pokemon.id;
    const pokecardFront = document.createElement('div');
    pokecardFront.classList.add('card__front');
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
};

const fillPokedex = () => {
  if (localStorage.getItem('pokedex')) {
    pokedex = JSON.parse(localStorage.getItem('pokedex'));
  } else {
    pokedex = allPokemonInfo.map((pokemon, idx) => {
      return {
        id: idx + 1,
        name: pokemon,
        catched: false
      };
    });

    localStorage.setItem('pokedex', JSON.stringify(pokedex));
  }

  createPokedex();
};

const catchPokemon = () => {
  const caughtPokemon = pokedex.findIndex(
    pokemon => pokemon.name === correctAnswer
  );

  getPokemonCard(pokedex[caughtPokemon].id - 1);

  pokedex[caughtPokemon].catched = true;

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
      for (const slot of types) {
        console.log(slot.type.name);
      }
      pokemonCard.addEventListener('transitionend', e => {
        setTimeout(() => {
          getAnswers();
        }, 1000);
      });

      setTimeout(() => {
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
      console.log('FALLASTE');
    }
  }
});

// pokedexElement.addEventListener('scroll', e => {
//   console.log(e);
// });

getAllPokemons();
