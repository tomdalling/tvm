<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl">Tom's Virtual Machine</h1>
    <div class="flex">
      <div class="w-1/2 pr-2">
        <textarea v-model="sourceCode" rows="10" class="block font-mono border rounded mt-2 w-full" />
        <button @click="load" class="border mt-2 px-4 py-1">
          Load
        </button>
        <button @click="run" v-if="isPaused" class="border ml-2 mt-2 px-4 py-1">
          Run
        </button>
        <button @click="pause" v-if="!isPaused" class="border ml-2 mt-2 px-4 py-1">
          Pause
        </button>
      </div>
      <div class="w-1/2 pl-2">
        <table>
          <tr v-for="(row, rowIdx) in display" :key="rowIdx">
            <Cell
              v-for="(cell, cellIdx) in row"
              :color="cell"
              :key="cellIdx"
            />
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/tailwind.css'
import Cell from './components/Cell.vue'
import VirtualMachine from './VirtualMachine.js'

export default {
  name: 'app',
  components: { Cell },
  created() {
    requestAnimationFrame(() => this.frame())
  },
  data() {
    const virtualMachine = new VirtualMachine
    return {
      virtualMachine,
      sourceCode: "PIX red; FRM\nPIX green; FRM\nPIX blue; FRM\nJMP 0",
      display: virtualMachine.display,
      timer: null,
      isPaused: true,
    }
  },
  methods: {
    run() {
      this.isPaused = false
    },
    pause() {
      this.isPaused = true
    },
    load() {
      this.virtualMachine.load(this.sourceCode)
    },
    frame() {
      requestAnimationFrame(() => this.frame())
      if(this.isPaused) return
      this.virtualMachine.frame()
      this.display = [...this.virtualMachine.display]
    }
  }
}
</script>
