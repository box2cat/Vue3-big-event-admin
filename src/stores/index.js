import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// const pinia = createPinia()
// pinia.use(persist)

export const pinia = createPinia().use(persist)

export * from './modules/counter'
export * from './modules/user'
