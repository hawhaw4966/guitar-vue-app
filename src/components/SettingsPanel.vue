<script setup>
import '../styles/settingspanel.css';

const strings = defineModel('strings', { type: Number, default: 6 })
const frets   = defineModel('frets',   { type: Number, default: 24 })
const tuning  = defineModel('tuning',  { type: Array,  default: () => [] })
// 双方向バインディングでフレットボードと連動
const isReversed = defineModel('isReversed', { type: Boolean, default: false })
// const props = defineProps({
//   strings: Number,
//   frets: Number,
//   tuning: Array,
// })

// const emit = defineEmits(['update:strings', 'update:frets', 'update:tuning'])

// const isReversed = defineModel('isReversed', { type: Boolean, default: false })

// note名テーブル
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

// MIDI番号から note+octave 文字列を生成
function formatNote(midi) {
  const name = NOTE_NAMES[midi % 12]
  const octave = Math.floor(midi / 12) - 1
  return `${name}${octave}`
}

// 各弦の選択肢（現在のチューニングの前後±6）
function getOptions(current) {
  return Array.from({ length: 13 }, (_, i) => current - 6 + i)
    .filter(m => m >= 0 && m <= 127)
}
</script>

<template>
  <section class="settings-panel">
    <div class="row">
      <label>弦数:</label>
      <input
        type="number"
        min="4"
        max="8"
        v-model.number="strings"
        />
        <!-- :value="strings"
        @input="emit('update:strings', Number($event.target.value))" -->
    </div>
    <div class="row">
      <label>フレット数:</label>
      <input
        type="number"
        min="18"
        max="36"
        v-model.number="frets"
        />
        <!-- :value="frets"//旧タイプ
        @input="emit('update:frets', Number($event.target.value))" -->
    </div>
    <div class="tuning">
      <h4>チューニング</h4>
      <div
        class="tuning-row"
        v-for="(midi, i) in tuning"
        :key="i"
      >
        <label>弦{{ i + 1 }}:</label>
        
          <!-- ▼ tuning[i] と直接バインド -->
        <select v-model.number="tuning[i]">

        <!-- <select
          :value="midi"
          @change="
            emit('update:tuning', [
              ...tuning.slice(0, i),
              Number($event.target.value),
              ...tuning.slice(i + 1)
            ]) "
         > -->
          <option
            v-for="m in getOptions(midi)"
            :key="m"
            :value="m"
          >
            {{ formatNote(m)}}
          </option>
        </select>
      </div>
    </div>
        <!-- 左右反転ボタン -->
           <button @click="isReversed = !isReversed" class="reverse-btn">
                 {{ isReversed ? '右利き表示' : '左利き表示' }}
           </button>
  </section>
</template>

<!-- <style scoped>
.settings { display: grid; gap: 12px; }
.row { display: flex; align-items: center; gap: 8px; }
.tuning { display: grid; gap: 8px; }
.tuning-row { display: flex; align-items: center; gap: 8px; }
select { padding: 2px 6px; }
</style> -->
