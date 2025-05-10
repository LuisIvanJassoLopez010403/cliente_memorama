<script setup>
  import axios from 'axios';
  import { ref } from 'vue';

  // Inicializacion de variables
  const getRegions = async () => {
    const response = await axios.get('http://localhost:5173/get-regions');

    if (response) {
      regions.value = response.data.regions;
    } else {
      return [];
    }
  }

  let regions = ref([]);
  const options = ['Facil', 'Medio', 'Dificil'];
  const gameRegion = ref('');
  const gameDifficulty = ref('');
  const userName = defineModel();

  const setRegion = async (choice) => {
    gameRegion.value = choice;
  };

  const setDifficulty = async (choice) => {
    gameDifficulty.value = choice;
  };

  getRegions()

</script>

<template>
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" alt="Pokémon" class="logo" style="width: 600px; height: auto;">

  <h2>¿Eres el mejor maestro pokemon del mundo?</h2>
  <h3 >Encuentra todos los pokemons ocultos y demuestralo!!</h3>

  <h1>Instrucciones:</h1>

  <p>Para mostrar al pokemon detrás del Ditto da click en el pokemon deseado, después elige otra opción para encontrar el par</p>
  <p>Una vez que hayas encontrado todos los pares, el juego te mostrará tu puntaje</p>
  <p>Nombre usuario: <input v-model="userName" type="text"></p>
  <div v-show="userName !=='' && userName !==null && userName !== undefined">
    <h2>Region</h2>
    <button v-for="region in regions" v-on:click="setRegion(region)">
      {{ region }}
    </button>
  </div>

  <div v-show="userName !=='' && gameRegion !== ''">
    <h2>Dificultad</h2>
    <button v-for="option in options" v-on:click="setDifficulty(option)">
      {{ option }}
    </button>
  </div>

  <button v-if="userName !== '' && gameRegion !== '' && gameDifficulty !== ''">
    Start Game
  </button>
</template>
