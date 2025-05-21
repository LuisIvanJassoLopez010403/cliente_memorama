import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => {
    return {
      userName: "",
      region: [],
      difficulty: "",
      counter: 0
    }
  },
  getters: {
    getUserName(state) {
      return state.userName;
    },
    getRegion(state) {
      return state.region;
    },
    getDifficulty(state) {
        return state.difficulty;
    }
  },
  actions: {
    setUserName(userName) {
        this.userName = userName;
    },
    setRegion(region) {
        this.region = region;
    },
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    },
    increment() {
      this.counter++
    }
  }
});
