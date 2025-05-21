<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

const leaderboard = ref({});
const selectedDifficulty = ref(gameStore.difficulty || 'Facil');
const selectedRegion = ref(gameStore.region || 'Kanto');
const currentPlayerPosition = ref(null);

const difficulties = ['Facil', 'Medio', 'Dificil'];
const regions = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'];

const sortedScores = ref([]);

const updateLeaderboard = () => {
  const data = JSON.parse(localStorage.getItem('leaderboard') || '{}');
  leaderboard.value = data;

  const scores = data[selectedDifficulty.value]?.[selectedRegion.value] || [];

  // Orden ascendente (menos clics es mejor)
  sortedScores.value = [...scores].sort((a, b) => a.score - b.score);

  // Posición del jugador actual
  const index = sortedScores.value.findIndex(entry =>
    entry.name === gameStore.userName &&
    entry.score === gameStore.counter
  );

  currentPlayerPosition.value = index !== -1
    ? { position: index + 1, ...sortedScores.value[index] }
    : null;
};

onMounted(updateLeaderboard);
watch([selectedDifficulty, selectedRegion], updateLeaderboard);
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">🏆 Tabla de posiciones</h2>

    <div class="flex gap-4 mb-6">
      <div>
        <label class="block mb-1 font-semibold">Dificultad:</label>
        <select v-model="selectedDifficulty" class="border p-2 rounded">
          <option v-for="diff in difficulties" :key="diff">{{ diff }}</option>
        </select>
      </div>
      <div>
        <label class="block mb-1 font-semibold">Región:</label>
        <select v-model="selectedRegion" class="border p-2 rounded">
          <option v-for="reg in regions" :key="reg">{{ reg }}</option>
        </select>
      </div>
    </div>

    <table class="w-full text-left border-collapse mb-8">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border-b">Posición</th>
          <th class="p-2 border-b">Jugador</th>
          <th class="p-2 border-b">Puntaje</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(entry, index) in sortedScores.slice(0, 5)"
          :key="index"
          class="hover:bg-gray-50"
        >
          <td class="p-2 border-b">{{ index + 1 }}</td>
          <td class="p-2 border-b">{{ entry.name }}</td>
          <td class="p-2 border-b">{{ entry.score }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="currentPlayerPosition" class="bg-green-100 p-4 rounded-xl shadow">
      <h3 class="text-lg font-semibold text-green-700">🎉 Tu posición:</h3>
      <p><strong>Puesto:</strong> {{ currentPlayerPosition.position }}</p>
      <p><strong>Nombre:</strong> {{ currentPlayerPosition.name }}</p>
      <p><strong>Puntaje:</strong> {{ currentPlayerPosition.score }}</p>
    </div>
  </div>
</template>
