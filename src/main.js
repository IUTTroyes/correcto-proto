import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import {initializeData} from "@/initializeData.js";

const app = createApp(App)

app.use(createPinia())
app.use(router)

await initializeData().then(() => {
    console.log('Data initialized successfully')
});

app.mount('#app')
