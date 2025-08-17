<template>
  <div class="app">
    <h2>ギターフレットボード</h2>
    <!-- <Fretboard :strings="6" :frets="24" /> -->
  </div>
  <div>
    <SettingsPanel
    :strings="strings" @update:strings="strings = $event"
    :frets="frets"     @update:frets="frets = $event"
    :tuning="tuning"
    @apply:tuning="applyTuning"
  />
    <!-- <SettingsPanel
      v-model:strings="strings"
      v-model:frets="frets"
      :tuning="tuning"
      @update-tuning="tuning = $event"
    /> -->
    <Fretboard
      :strings="strings"
      :frets="frets"
      :tuning="tuning"
    />
  </div>
</template>

<!-- <template>
  <SettingsPanel
    :strings="strings"
    :frets="frets"
    :tuning="tuning"
    // 下記ボタンで変更時
    @update-strings="strings = $event"
    @update-frets="frets = $event"
    @update-tuning="tuning = $event"
  />
  <Fretboard :strings="strings" :frets="frets" :tuning="tuning" />
</template> -->

<script setup>
import { ref } from 'vue';
import Fretboard from './components/Fretboard.vue';
import SettingsPanel from './components/SettingsPanel.vue';


const strings = ref(6);
const frets = ref(24);
const tuning = ref([4, 11, 7, 2, 9, 4,11,6]); // E B G D A E B

function applyTuning(next) {
  // 参照を置き換えるのが肝心（中身を直接いじらない）
  tuning.value = [...next];
}
</script>

<style>
body {
  font-family: sans-serif;
  margin: 20px;
  background: #f5f5f5;
}
</style>





