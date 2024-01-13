import { defineStore } from 'pinia'
import { ref } from 'vue'

//计数器模块
export const useCounterStore = defineStore('big-counter', () => {
  const c = ref(1000)
  const add = (n) => {
    c.value = c.value + n
  }
  return { c, add }
})
