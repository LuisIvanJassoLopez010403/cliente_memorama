import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/*export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})*/

export const authStore = defineStore('auth', () => {
  const authToken = ref('')

  function getAuthToken() {
    return authToken.value
  }

  function setAuthToken(value) {
    authToken.value = value
  }

  const isAuthenticated = computed(() => !!authToken.value)

  return { authToken, getAuthToken, setAuthToken, isAuthenticated }
})