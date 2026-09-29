import Pokemon from './pokemon.js';
import Type, { TYPE_TRANSLATIONS } from './type.js';

const selectGen = document.querySelector('#generation-select');
const selectSort = document.querySelector('#sort-select');
const main = document.querySelector('main');
const typesContainer = document.querySelector('#types');

let currentType = 'all';

selectGen.addEventListener('change', () => {
  loadData(selectGen.value, currentType);
});

selectSort.addEventListener('change', () => {
  loadData(selectGen.value, currentType);
});

loadData();
addFilterTypes();

async function loadData(idGeneration = 1, type = 'all') {
  main.innerHTML = '<p style="text-align:center; width:100%; font-size:1.2em;">Chargement des Pokémon...</p>';

  try {
    const reponse = await fetch('https://pokeapi.co/api/v2/generation/' + idGeneration);
    const genData = await reponse.json();

    const rawList = await Promise.all(
      genData.pokemon_species.map(async (species) => {
        try {
          const parts = species.url.split('/').filter(Boolean);
          const id = parts[parts.length - 1];

          const [pokeRes, speciesRes] = await Promise.all([
            fetch('https://pokeapi.co/api/v2/pokemon/' + id),
            fetch('https://pokeapi.co/api/v2/pokemon-species/' + id)
          ]);

          const poke = await pokeRes.json();
          const speciesData = await speciesRes.json();
          const frNameObj = speciesData.names.find((n) => n.language.name === 'fr');

          return {
            id: parseInt(id),
            name: frNameObj ? frNameObj.name : poke.name,
            image: poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default,
            types: poke.types.map((t) => t.type.name),
            stats: {
              HP: poke.stats[0].base_stat,
              attack: poke.stats[1].base_stat,
              defense: poke.stats[2].base_stat,
              special_attack: poke.stats[3].base_stat,
              speed: poke.stats[5].base_stat
            }
          };
        } catch (err) {
          return null;
        }
      })
    );

    const pokemonObjects = rawList
      .filter((data) => data !== null)
      .map((data) => new Pokemon(data));

    let filteredList =
      type !== 'all'
        ? pokemonObjects.filter((p) => p.apiTypes.some((t) => t.name === type))
        : pokemonObjects;

    const sortBy = selectSort.value;
    filteredList.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'hp') return b.hp - a.hp;
      if (sortBy === 'attack') return b.attack - a.attack;
      if (sortBy === 'type') {
        const typeA = TYPE_TRANSLATIONS[a.apiTypes[0].name] || a.apiTypes[0].name;
        const typeB = TYPE_TRANSLATIONS[b.apiTypes[0].name] || b.apiTypes[0].name;
        return typeA.localeCompare(typeB);
      }
      return a.id - b.id;
    });

    main.innerHTML = '';

    if (filteredList.length === 0) {
      main.innerHTML = '<p style="text-align:center; width:100%;">Aucun Pokémon trouvé pour ce filtre.</p>';
      return;
    }

    for (const pokemon of filteredList) {
      main.appendChild(pokemon.displayCard());
    }
  } catch (error) {
    console.error(error);
    main.innerHTML = '<p style="color:red; text-align:center; width:100%;">Erreur lors du chargement des Pokémon.</p>';
  }
}

async function addFilterTypes() {
  typesContainer.innerHTML = '';

  try {
    const reponse = await fetch('https://pokeapi.co/api/v2/type');
    const data = await reponse.json();

    let allDiv = document.createElement('div');
    allDiv.textContent = 'Tous';
    allDiv.style.backgroundColor = '#ffffff';
    allDiv.style.color = '#000000';
    allDiv.addEventListener('click', () => {
      currentType = 'all';
      loadData(selectGen.value, currentType);
    });
    typesContainer.appendChild(allDiv);

    for (const typeData of data.results) {
      if (typeData.name === 'unknown' || typeData.name === 'shadow') continue;

      const typeObj = new Type(typeData.name);
      let div = document.createElement('div');
      div.textContent = TYPE_TRANSLATIONS[typeObj.name] || typeObj.name;

      div.style.backgroundColor = typeObj.color;
      div.style.color = '#ffffff';

      div.addEventListener('click', () => {
        currentType = typeObj.name;
        loadData(selectGen.value, currentType);
      });

      typesContainer.appendChild(div);
    }
  } catch (err) {
    console.error(err);
  }
}