import './assets/main.css'
// Import our custom CSS
import './assets/scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router'
import App from './App.vue'

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')