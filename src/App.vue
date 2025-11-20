<template>
<div class="app ">
  <main>
    <h2>ギターフレットボード</h2>
     <!-- 設定パネルの表示切替ボタン -->
    <button @click="showSettings = !showSettings" class="settings-toggle ">
      {{ showSettings ? "設定を隠す" : "設定を開く" }}
    </button>
    <SettingsPanel
     v-if="showSettings"
      v-model:strings="strings"
      v-model:frets="frets"
      v-model:tuning="tuning"
      v-model:isReversed="isReversed"
      v-model:isFlat="isFlat" 
    />

    <div class="mode-buttons">
      <button @click="displayMode = 'note'">Note</button>
      <button @click="displayMode = 'note+octave'">Note + Octave</button>
      <button @click="displayMode = 'midi'">MIDI</button>
      <button @click="displayMode = 'degree'">Degree</button>
      <button @click="displayMode = 'degree+note'">Degree+Note</button>
      <!-- ♯/♭切り替えボタン -->
      <button @click="isFlat = !isFlat">
        {{ isFlat ? '♭ 表示' : '♯ 表示' }}
      </button>
    </div>

    <Fretboard
      :strings="strings"
      :frets="frets"
      :tuning="tuning"
      :display-mode="displayMode"
      :is-reversed="isReversed"
      :is-flat="isFlat" 
      :root-pc="rootPc"
      :chord-pcs="chordPcs"
      :scale-pcs="scalePcs"  
    />
        <!-- ▼ フレットボードの下に配置 -->
    <NotePalette
      v-model:rootPc="rootPc"
      :isFlat="isFlat"
      />
    <ChordPalette
      v-model:chordName="chordName"
      v-model:chordPcs="chordPcs"
      :root-pc="rootPc"
    />
    <DiatonicChords
    v-model:chordName="chordName"
    v-model:chordPcs="chordPcs"
    :root-pc="rootPc"
    :scale-name="scaleName"
    :is-flat="isFlat"
    :is-reversed="isReversed"
    />
    <ScalePalette 
   v-model:scaleName="scaleName" 
   v-model:scalePcs="scalePcs" 
   :root-pc="rootPc"
    /> 

   
   </main>
  </div>
  <button
  class="px-2 py-1 text-xs rounded border border-red-400 text-red-200 hover:bg-red-500/10"
  @click="reset()"
>
  設定リセット
</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Fretboard from './components/Fretboard.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import NotePalette from './components/NotePalette.vue'
import ChordPalette from './components/ChordPalette.vue'
import ScalePalette from './components/ScalePalette.vue'
import DiatonicChords from './components/DiatonicChords.vue'

import { usePersistentSettings } from './composables/usePersistentSettings.ts'

const {
  strings, frets, tuning,
  isReversed, isFlat, displayMode,
  rootPc, chordName, chordPcs, scaleName, scalePcs,
  reset, save, // ★ ここで composable から受け取っている
} = usePersistentSettings({ boardId: 'board-1' })

// const strings = ref(6)
// const frets = ref(24)
// // MIDIノートでチューニングを初期化（ E B G D A E B F#）
// const tuning = ref([64, 59, 55, 50, 45, 40, 35, 30])
// // 表示モード: 'note', 'note+octave', 'midi'
// const displayMode = ref('note')
// // 左右反転の状態をApp.vueで管理
// const isReversed = ref(false)   
// const isFlat = ref(false) 
// //#/b

// /** 0..11 のピッチクラス or null で未選択 */
// const rootPc = ref(null)       // 0..11 or null（NotePalette から）
// const chordName = ref(null)    // 'maj' など
// const chordPcs  = ref([])      // [0,4,7] 等（ChordPalette から）
// const scaleName = ref(null)    //スケール
// const scalePcs  = ref([])      //スケールノート

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
