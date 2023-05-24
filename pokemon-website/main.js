import { fetchPokemon } from "./fetchPokemon.js"

const body = document.querySelector('body')
// body.style.display = 'flex'

const tag = document.createElement('p')
tag.textContent = "Enter pokemon with a comma separation, i.e. 'Pikachu,ditto'"
body.appendChild(tag)

const input = document.createElement('input')
input.setAttribute('type', 'text')
input.setAttribute('name', 'input-field')
const submit = document.createElement('input')
submit.setAttribute('type', 'submit')
submit.setAttribute('value', 'Submit')

const form = document.createElement('form')
form.appendChild(input)
form.appendChild(submit)
form.style.paddingBottom = '20px'
body.appendChild(form)

const pokemonContainer = document.createElement('div')
pokemonContainer.style.display = 'flex';
body.appendChild(pokemonContainer)

// create and append pokemon cards to the pokemonContainer
form.addEventListener('submit', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Do something with the form data here...

  const formData = new FormData(event.target);
  const inputFieldValue = formData.get('input-field');
  const pokeArray = inputFieldValue.split(',')
  console.log(pokeArray)
  // clear existing container
  while (pokemonContainer.firstChild) {
    pokemonContainer.removeChild(pokemonContainer.firstChild);
  }

  createPokemonCards(fetchPokemon(pokeArray))
});

const createPokemonCards = (pokemons) => {
  console.log(pokemons)
  pokemons.then((data) => {
    data.forEach((pokemon) => {
      // div
          // h1 => name (id)
          // h3 => weight 
          // h3 => height 
          // p => abilities[0].name
      const div = document.createElement('div')
      div.style.border = '1px solid black'
      div.style.padding = '20px'
      div.style.width = '200px'
      pokemonContainer.appendChild(div)

      const name = document.createElement('h1')
      name.textContent = `${pokemon.name} (${pokemon.id})`
      div.appendChild(name)

      const weight = document.createElement('h3')
      weight.textContent = `Weight: ${pokemon.weight}`
      div.appendChild(weight)

      const height = document.createElement('h3')
      height.textContent = `Height: ${pokemon.height}`
      div.appendChild(height)

      const abilities = document.createElement('p')
      const abilitiesArr = []
      pokemon.abilities.forEach((ability) => {
        abilitiesArr.push(ability.ability.name)
      })
      abilities.textContent = `Abilities: ${abilitiesArr.toString('')}`
      div.appendChild(abilities)
      
      const image = document.createElement('img')
      image.src = pokemon.sprites.front_shiny
      div.appendChild(image)
    })
  })
}