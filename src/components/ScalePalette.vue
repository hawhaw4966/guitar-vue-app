<script setup>
import { watch } from 'vue'

// 親と双方向バインド
const scaleName = defineModel('scaleName', { type: [String, null], default: null })
const scalePcs  = defineModel('scalePcs',  { type: Array, default: () => [] })

// ルート（0..11 or null）
const props = defineProps({
  rootPc: { type: [Number, null], default: null },
})

// 半音インターバル定義（0 は必ずルート）
const SCALE_DEFS = [
  { id: 'major',        label: 'Major (Ionian)',     intervals: [0,2,4,5,7,9,11] },
  { id: 'dorian',       label: 'Dorian',             intervals: [0,2,3,5,7,9,10] },
  { id: 'phrygian',     label: 'Phrygian',           intervals: [0,1,3,5,7,8,10] },
  { id: 'lydian',       label: 'Lydian',             intervals: [0,2,4,6,7,9,11] },
  { id: 'mixolydian',   label: 'Mixolydian',         intervals: [0,2,4,5,7,9,10] },
  { id: 'naturalMinor', label: 'Natural Minor',      intervals: [0,2,3,5,7,8,10] },
  { id: 'locrian',      label: 'Locrian',            intervals: [0,1,3,5,6,8,10] },
  { id: 'harmMinor',    label: 'Harmonic Minor',     intervals: [0,2,3,5,7,8,11] },
  { id: 'melMinor',     label: 'Melodic Minor',      intervals: [0,2,3,5,7,9,11] },


  { id: 'pentMajor',    label: 'Pentatonic Major',   intervals: [0,2,4,7,9] },
  { id: 'pentMinor',    label: 'Pentatonic Minor',   intervals: [0,3,5,7,10] },
  { id: 'blues',        label: 'Blues',              intervals: [0,3,5,6,7,10] },
]

function toPcs(root, intervals) {
  return intervals.map(semi => (root + semi) % 12)
}

function selectScale(def) {
  if (props.rootPc === null) return
  scaleName.value = def.id
  scalePcs.value  = toPcs(props.rootPc, def.intervals)
}

function clearScale() {
  scaleName.value = null
  scalePcs.value  = []
}

// ルート変更で再計算
watch(() => props.rootPc, (nv) => {
  if (nv === null || !scaleName.value) {
    scalePcs.value = []
    return
  }
  const def = SCALE_DEFS.find(d => d.id === scaleName.value)
  if (def) scalePcs.value = toPcs(nv, def.intervals)
})
</script>

<template>
  <div class="scale-palette">
    <div class="group">
      <span class="group-title">Diatonic</span>
      <div class="btns">
        <!-- メジャー/マイナー/モード -->
        <button
          v-for="def in SCALE_DEFS.slice(0, 9)" 
          :key="def.id"
          class="scale-btn"
          :class="{ active: scaleName === def.id }"
          :disabled="rootPc === null"
          @click="selectScale(def)"
        >
          {{ def.label }}
        </button>
      </div>
    </div>

    <div class="group">
      <span class="group-title">Pentatonic / Blues</span>
      <div class="btns">
        <button
          v-for="def in SCALE_DEFS.slice(9)"
          :key="def.id"
          class="scale-btn"
          :class="{ active: scaleName === def.id }"
          :disabled="rootPc === null"
          @click="selectScale(def)"
        >
          {{ def.label }}
        </button>
      </div>
    </div>

    <div class="row">
      <button class="clear" :disabled="!scaleName" @click="clearScale">クリア</button>
    </div>
  </div>
</template>

<style scoped>
.scale-palette { display: grid; gap: 10px; margin-top: 12px; }
.group { display: grid; gap: 6px; }
.group-title { font-size: .9rem; opacity: .8; margin-right: 8px; }
.btns { display: flex; flex-wrap: wrap; gap: 8px; }
.scale-btn {
  padding: 6px 10px; min-width: 120px;
  border: 1px solid #ccc; border-radius: 6px;
  background: #f7f7f7; cursor: pointer;
}
.scale-btn.active { background: #7b3cff; color: #fff; border-color: #7b3cff; font-weight: 600; }
.scale-btn:disabled { opacity: .5; cursor: not-allowed; }
.row { display: flex; gap: 8px; }
.clear {
  padding: 6px 10px; border: 1px solid #bbb; border-radius: 6px;
  background: #fff; cursor: pointer;
}
</style>