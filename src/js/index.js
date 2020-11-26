const URL_ALL_POKEMONS = 'https://pokeapi.co/api/v2/pokemon?limit=386';
let allPokemonInfo = [];
let pokedex = [];
let correctAnswer = '';

// DOM
const pokeImage = document.getElementById('poke-image');
const answersList = document.getElementById('poke-answers');
const loader = document.getElementById('loader');
const pokedexElement = document.getElementById('pokedex');

<<<<<<< HEAD
const getRandomNumber = (max = 386) => Math.floor(Math.random() * max) + 1;
=======
const getRandomNumber = (max = 150) => Math.floor(Math.random() * max) + 1;
>>>>>>> e3a172bf185f19eb1ca8d76643cabedf74643699

const getAllPokemons = () => {
  loader.style.display = 'block';
  fetch(URL_ALL_POKEMONS)
    .then(res => res.json())
    .then(allPokemons => {
      allPokemonInfo = allPokemons.results.map(pokemon => pokemon.name);
<<<<<<< HEAD
      fillPokedex();
=======
>>>>>>> e3a172bf185f19eb1ca8d76643cabedf74643699
      getAnswers();
      fillPokedex();
    });
};

const getAnswers = (answers = 5) => {
  const options = [];
  const currentPokemon = allPokemonInfo[getRandomNumber()];
<<<<<<< HEAD
  const isCatched = pokedex.find(({ name }) => name === currentPokemon);
  if (!isCatched.catched) {
    console.log(isCatched.catched);
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
=======
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
>>>>>>> e3a172bf185f19eb1ca8d76643cabedf74643699
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
    const pokecard = document.createElement('div');
<<<<<<< HEAD
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
=======
    pokecard.classList.add('pokedex__card');
    const pokeball = document.createElement('div');
    pokeball.classList.add('pokedex__pokeball');
    if (pokemon.catched) {
      pokecard.classList.add('pokedex__card--show');
    }
    pokecard.appendChild(pokeball);
>>>>>>> e3a172bf185f19eb1ca8d76643cabedf74643699
    fragment.appendChild(pokecard);
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

<<<<<<< HEAD
  getPokemonCard(pokedex[caughtPokemon].id - 1);

  pokedex[caughtPokemon].catched = true;

  localStorage.setItem('pokedex', JSON.stringify(pokedex));
};

const getPokemonCard = id => {
  const allPokemonsCards = [...document.querySelectorAll('.card')];
  const pokemonCard = allPokemonsCards[id];
  pokedexElement.scrollTo({
    top: pokemonCard.offsetTop - 400,
    behavior: 'smooth'
  });

  fetch(`https://pokeapi.co/api/v2/pokemon/${id + 1}/`)
    .then(res => res.json())
    .then(({ id, name, types }) => {
      console.log(types);
      for (const slot of types) {
        console.log(slot.type.name);
      }
      pokemonCard.innerHTML = `<h1 class="card__name">${name}</h1>`;
      setTimeout(() => {
        pokemonCard.classList.add('card--show');
      }, 2000);
    });

  console.dir(pokemonCard);
=======
  pokedex[caughtPokemon].catched = true;

  localStorage.setItem('pokedex', JSON.stringify(pokedex));

  console.log(pokedex[caughtPokemon]);
>>>>>>> e3a172bf185f19eb1ca8d76643cabedf74643699
};

answersList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    if (e.target.textContent === correctAnswer) {
      pokeImage.classList.add('game__image--show');
      catchPokemon();
<<<<<<< HEAD
=======
      createPokedex();
>>>>>>> e3a172bf185f19eb1ca8d76643cabedf74643699
      setTimeout(() => getAnswers(), 2500);
    } else {
      console.log('FALLASTE');
    }
  }
});

getAllPokemons();
