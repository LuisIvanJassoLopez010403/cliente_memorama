<script setup>
defineProps({
  pokemon: Object,
  index: Number
});

const emit = defineEmits(['reveal']);
</script>

<template>
  <div 
    class="card"
    :class="{ revealed: pokemon.revealed || pokemon.matched }"
    @click="$emit('reveal', index)"
  >
    <img 
      v-if="pokemon.revealed || pokemon.matched" 
      :src="pokemon.sprite" 
      alt="pokemon" 
    />
    <img 
      v-else 
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png" 
      alt="Ditto oculto" 
    />
  </div>
</template>

<style scoped>
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
</style>
