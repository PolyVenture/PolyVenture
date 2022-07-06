import { createApp } from 'vue'
import App from './App.vue'
import Home from './components/Home.vue'
import { store } from './store/store.js'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {path: '/', component: Home},
]
  
  const r = createRouter({
    history: createWebHistory(),
    routes
  })

createApp(App)
.use(store)
.use(r)
.mount('#app')


// new Vue({
//     router,
//     render: h => h(App),
//   }).$mount('#app')
