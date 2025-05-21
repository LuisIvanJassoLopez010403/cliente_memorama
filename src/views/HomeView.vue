<script setup>
import router from "@/router/index.js";
import axios from 'axios';
import { ref } from 'vue';
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/game.js';
import { authStore } from '@/stores/auth.js'

const gameStore = useGameStore();
const auth = authStore();

const regions = ref([]);
const userName = ref('');
const gameRegion = ref('');
const gameDifficulty = ref('');
const options = ['Facil', 'Medio', 'Dificil'];

const startGame = () => {
  gameStore.setUserName(userName.value);
  gameStore.setRegion(gameRegion.value);
  gameStore.setDifficulty(gameDifficulty.value);

  router.push({ name: 'game' }); 
};

const setRegion = (choice) => {
  gameRegion.value = choice;
};

const setDifficulty = (choice) => {
  gameDifficulty.value = choice;
};

const getUser = async () => {
  const response = await axios.post('http://localhost:5173/get-user');
  if (response && response.data && response.data.authToken) {
    auth.setAuthToken(response.data.authToken);
  }
};


const getRegions = async () => {
  try {
    const response = await axios.get('http://localhost:5173/get-regions');
    if (response?.data?.regions) {
      regions.value = response.data.regions;
    }
  } catch (error) {
    console.error('Error al obtener regiones', error);
  }
};

onMounted(() => {
  getUser()
})

getRegions();
</script>

<template>
  <div class="home-container">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" 
      alt="Pokémon" 
      class="logo"
    />

    <h2>¿Eres el mejor maestro Pokémon del mundo?</h2>
    <h3>¡Encuentra todos los pokémons ocultos y demuéstralo!</h3>

    <section class="instructions">
      <h1>Instrucciones:</h1>
      <p>Da click en un pokémon para revelar qué hay detrás de Ditto, y encuentra todos los pares.</p>
    </section>

    <div class="form-section">
      <label>Nombre de usuario:</label>
      <input v-model="userName" type="text" placeholder="Ash Ketchum..." />
    </div>

    <div v-if="userName" class="form-section">
      <h2>Selecciona una Región</h2>
      <div class="button-group">
        <button 
          v-for="region in regions" 
          :key="region" 
          @click="setRegion(region)" 
          :class="{ selected: gameRegion === region }"
        >
          {{ region }}
        </button>
      </div>
    </div>

    <div v-if="userName && gameRegion" class="form-section">
      <h2>Selecciona Dificultad</h2>
      <div class="button-group">
        <button 
          v-for="option in options" 
          :key="option" 
          @click="setDifficulty(option)" 
          :class="{ selected: gameDifficulty === option }"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <button 
      class="start-button"
      @click="startGame"
      v-if="userName && gameRegion && gameDifficulty && auth.authToken"
    >
      ¡Comenzar Juego!
    </button>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 30px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logo {
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

h1 {
  color: black;
}

h2, h3 {
  margin: 10px 0;
}

p {
  color: black;
}

.instructions {
  background-color: #fef9e7;
  border: 1px solid #f4d03f;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.form-section {
  margin: 20px 0;
}

input[type="text"] {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 60%;
  max-width: 300px;
  margin-top: 10px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

button:hover {
  background-color: #ddd;
  transform: scale(1.05);
}

button.selected {
  background-color: #ffcb05;
  color: #2a75bb;
  border: 2px solid #2a75bb;
}

.start-button {
  background-color: #2a75bb;
  color: white;
  font-size: 18px;
  margin-top: 30px;
  padding: 12px 30px;
  border-radius: 12px;
  transition: background-color 0.3s, transform 0.2s;
}

.start-button:hover {
  background-color: #1c4e8b;
  transform: scale(1.05);
}
</style>
