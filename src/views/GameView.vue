<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/game.js';
import CardPokemon from '@/components/CardPokemon.vue';

const router = useRouter();
const gameStore = useGameStore();

const numCards = ref(0);
const numColumns = ref(0);
const pokemons = ref([]);
const selectedCards = ref([]);
const isChecking = ref(false);
const isLoading = ref(true);
let revealedCards = 1;

const difficultyMap = {
  Facil: { cards: 12, columns: 4 },
  Medio: { cards: 20, columns: 5 },
  Dificil: { cards: 30, columns: 6 }
};

const regionRanges = {
  Kanto: [1, 151],
  Johto: [152, 251],
  Hoenn: [252, 386],
  Sinnoh: [387, 493],
  Unova: [494, 649],
  Kalos: [650, 721],
  Alola: [722, 809],
  Galar: [810, 905],
  Paldea: [906, 1025]
};

const initBoard = async () => {
  isLoading.value = true;

  const difficulty = gameStore.difficulty;
  const region = gameStore.region;
  const user = gameStore.userName;

  if (!difficulty || !region || !user) {
    router.push({ name: 'home' });
    return;
  }

  const config = difficultyMap[difficulty];
  numCards.value = config.cards;
  numColumns.value = config.columns;

  const [minId, maxId] = regionRanges[region];
  const pairsNeeded = numCards.value / 2;
  const usedIds = new Set();
  const tempPairs = [];

  while (tempPairs.length < pairsNeeded * 2) {
    const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

    if (randomId === 132 || usedIds.has(randomId)) continue;

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      const sprite = data.sprites.front_default;

      if (!sprite) continue;

      usedIds.add(randomId);
      const pair = { sprite, revealed: false, matched: false };
      tempPairs.push({ ...pair });
      tempPairs.push({ ...pair });
    } catch (err) {
      console.error(err);
    }
  }

  pokemons.value = shuffleArray(tempPairs);
  isLoading.value = false;
};


const shuffleArray = (array) => {
  return array
    .map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const showVictoryModal = ref(false);

const checkWinCondition = () => {
  const allMatched = pokemons.value.every(p => p.matched);
  if (allMatched) {
    gameStore.saveCurrentScore();
    showVictoryModal.value = true;
  }
};

const goToLeaderboard = () => {
  router.push({ name: 'leaderboard' });
};


const revealPokemon = (index) => {
  const card = pokemons.value[index];
  revealedCards = index;
  if (card.revealed || card.matched || isChecking.value) return;

  card.revealed = true;
  selectedCards.value.push({ ...card, index });

  if (selectedCards.value.length === 2) {
    gameStore.increment()
    isChecking.value = true;

    const [first, second] = selectedCards.value;

    if (first.sprite === second.sprite) {
      pokemons.value[first.index].matched = true;
      pokemons.value[second.index].matched = true;
      selectedCards.value = [];
      isChecking.value = false;
      revealedCards--;
      checkWinCondition();
    } else {
      setTimeout(() => {
        pokemons.value[first.index].revealed = false;
        pokemons.value[second.index].revealed = false;
        selectedCards.value = [];
        isChecking.value = false;
      }, 1000);
    }
  }
};

onMounted(() => {
  initBoard();
});
</script>

<template>
  <div class="container">
    <h2>Jugador: {{ gameStore.userName }}</h2>
    <h3>Región: {{ gameStore.region }} - Dificultad: {{ gameStore.difficulty }} - Puntaje: {{ gameStore.counter }}</h3>

     <div v-if="isLoading">Cargando tarjetas...</div>

    <div 
      class="grid"
      :style="`grid-template-columns: repeat(${numColumns}, 1fr)`"
    >
      <CardPokemon 
        v-for="(pokemon, index) in pokemons" 
        :key="index"
        :pokemon="pokemon"
        :index="index"
        @reveal="revealPokemon"
      />
    </div>

    <div v-if="showVictoryModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">¡Juego Completado!</h2>
        <p class="modal-text">Jugador: <strong>{{ gameStore.userName }}</strong></p>
        <p class="modal-text">Puntaje: <strong>{{ gameStore.counter }}</strong></p>
        <p class="modal-text">Dificultad: <strong>{{ gameStore.difficulty }}</strong></p>
        <button class="modal-button" @click="goToLeaderboard">
          Ver tabla de posiciones
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
  margin: auto;
}

.grid {
  display: grid;
  gap: 16px;
  justify-content: center;
  max-width: 1000px;
  margin: 30px auto 0 auto;
}

.card {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}
.card:hover {
  transform: scale(1.05);
}
.card.revealed {
  background-color: #d4f7dc;
}

img {
  width: 96px;
  height: 96px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 20px;
  padding: 30px 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-title {
  font-size: 24px;
  color: #28a745;
  margin-bottom: 15px;
  font-weight: bold;
}

.modal-text {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.modal-button {
  background-color: #2a75bb;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 15px;
}

.modal-button:hover {
  background-color: #1c4e8b;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}


</style>
