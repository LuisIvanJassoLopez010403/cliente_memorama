import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

async function prepare() {
  if (import.meta.env.MODE === 'development' || window.Cypress) {
    const { worker } = await import('./mocks/browser')
    await worker.start()
    console.log('MSW activo en modo desarrollo o pruebas Cypress')
  }
  app.mount('#app')
}

prepare()
