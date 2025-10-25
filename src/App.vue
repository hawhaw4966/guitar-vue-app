<template>
<div class="app">
  <main>
    <h2>ギターフレットボード</h2>
     <!-- 設定パネルの表示切替ボタン -->
    <button @click="showSettings = !showSettings" class="settings-toggle">
      {{ showSettings ? "設定を隠す" : "設定を開く" }}
    </button>
    <SettingsPanel
     v-if="showSettings"
      v-model:strings="strings"
      v-model:frets="frets"
      v-model:tuning="tuning"
      v-model:isReversed="isReversed"
    />

    <div class="mode-buttons">
      <button @click="displayMode = 'note'">Note</button>
      <button @click="displayMode = 'note+octave'">Note + Octave</button>
      <button @click="displayMode = 'midi'">MIDI</button>
    </div>

    <Fretboard
      :strings="strings"
      :frets="frets"
      :tuning="tuning"
      :display-mode="displayMode"
      :is-reversed="isReversed"
    />
   </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Fretboard from './components/Fretboard.vue'
import SettingsPanel from './components/SettingsPanel.vue'

const strings = ref(6)
const frets = ref(24)
// MIDIノートでチューニングを初期化（ E B G D A E B F#）
const tuning = ref([64, 59, 55, 50, 45, 40, 35, 30])
// 表示モード: 'note', 'note+octave', 'midi'
const displayMode = ref('note')
// 左右反転の状態をApp.vueで管理
const isReversed = ref(false)   

// function applyTuning(newTuning) {
//   tuning.value = [...newTuning]
// } 非v-model用

// 設定パネルの表示状態
const showSettings = ref(false);
</script>

<style scoped>
.mode-buttons {
  display: flex;
  gap: 12px;
  margin: 12px 0;
}
button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f8f8f8;
  cursor: pointer;
}
.settings-toggle {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
}
</style>
