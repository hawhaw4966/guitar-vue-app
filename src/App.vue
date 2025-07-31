<template>
  <div class="app">
    <h2>ギターフレットボード</h2>
    <!-- <Fretboard :strings="6" :frets="24" /> -->
  </div>
  <div>
    <SettingsPanel
      :strings="strings"
      :frets="frets"
      :tuning="tuning"
      @update-strings="strings = $event"
      @update-frets="frets = $event"
      @update-tuning="tuning = $event"
    />
    <Fretboard
      :strings="strings"
      :frets="frets"
      :tuning="tuning"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Fretboard from './components/Fretboard.vue';
import SettingsPanel from './components/SettingsPanel.vue';


const strings = ref(6);
const frets = ref(24);
const tuning = ref([4, 11, 7, 2, 9, 4]); // E B G D A E
</script>

<style>
body {
  font-family: sans-serif;
  margin: 20px;
  background: #f5f5f5;
}
</style>

