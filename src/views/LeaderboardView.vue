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

  sortedScores.value = [...scores].sort((a, b) => a.score - b.score);

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
  <div class="leaderboard-container">
    <h2 class="leaderboard-title">🏆 Tabla de Posiciones</h2>

    <div class="select-group">
      <div>
        <label>Dificultad:</label><br>
        <select v-model="selectedDifficulty">
          <option v-for="diff in difficulties" :key="diff">{{ diff }}</option>
        </select>
      </div>
      <div>
        <label>Región:</label><br>
        <select v-model="selectedRegion">
          <option v-for="reg in regions" :key="reg">{{ reg }}</option>
        </select>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Posición</th>
          <th>Jugador</th>
          <th>Puntaje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in sortedScores.slice(0, 5)" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.name }}</td>
          <td>{{ entry.score }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="currentPlayerPosition" class="player-position">
      🎉 Tu mejor partida:
      <p><strong>Puesto:</strong> {{ currentPlayerPosition.position }}</p>
      <p><strong>Nombre:</strong> {{ currentPlayerPosition.name }}</p>
      <p><strong>Puntaje:</strong> {{ currentPlayerPosition.score }}</p>
    </div>
  </div>
</template>


<style scoped>
.leaderboard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.leaderboard-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #f4c430;
}

.select-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

label {
    color: black;
}

select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

select:focus {
  border-color: #f4c430;
  outline: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

thead {
  background-color: #fef9e7;
  color: #333;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  color: black;
}

tbody tr:hover {
  background-color: #fff7d1;
}

.player-position {
  background-color: #e8f5e9;
  border-left: 5px solid #2e7d32;
  padding: 15px 20px;
  border-radius: 15px;
  font-weight: bold;
  color: #2e7d32;
}
</style>

