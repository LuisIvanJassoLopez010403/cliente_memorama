import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
