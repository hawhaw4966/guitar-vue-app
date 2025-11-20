<script setup>
import { computed } from 'vue'
const rootPc = defineModel('rootPc', { default: null }) // 0..11 or null
const props = defineProps({
  isFlat: { type: Boolean, default: false },
})

const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
const names = computed(() => (props.isFlat ? FLAT : SHARP))

function select(pc) {
  rootPc.value = pc
}
function clear() {
  rootPc.value = null
}
</script>

<template>
  <div class="note-palette">
    <button
      v-for="(label, pc) in names"
      :key="pc"
      class="note-btn"
      :class="{ active: rootPc === pc }"
      @click="select(pc)"
    >
      {{ label }}
    </button>
    <button class="note-btn clear" v-if="rootPc !== null" @click="clear">
      クリア
    </button>
  </div>
</template>

<style scoped>
.note-palette {
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;
}
.note-btn {
  min-width: 40px; padding: 6px 10px;
  border: 1px solid #ccc; border-radius: 6px;
  background: #f7f7f7; cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI";
}
.note-btn.active { 
  background: #2b7cff; color: white; border-color: #2b7cff;
  font-weight: 600;
}
.note-btn.clear { opacity: .8; }
</style>