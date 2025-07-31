<template>
  <div class="fretboard-container">
    <!-- フレット番号 -->
    <div class="fret-numbers">
      <div
        v-for="f in displayFrets"
        :key="'fret-' + f"
        class="fret-number"
      >
        {{ f }}
      </div>
    </div>

    <!-- フレットボード -->
    <div class="fretboard">
 
      <div
        v-for="(string, sIndex) in displayStrings"
        :key="sIndex"
         class="string-row"
      >
        <div
        v-for="(fret, fIndex) in displayFrets"
        :key="fIndex"
        class="fret"
       >
      {{ getNoteName(string, fret) }}
      </div>
    </div>
 </div>


    

    <!-- ボタン -->
    <button @click="isReversed = !isReversed" class="reverse-btn">
      {{ isReversed ? "右利き表示" : "左利き表示" }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import '../styles/fretboard.css';

const props = defineProps({
  strings: Number,
  frets: Number,
  tuning: Array,
});

const isReversed = ref(false);

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNoteName(openNote, fret) {
  const key = (openNote + fret) % 12;
  return noteNames[key];
}

const stringsArray = computed(() =>
  Array.from({ length: props.strings }, (_, i) => props.tuning[i] ?? 4)
);

const displayFrets = computed(() => {
  const frets = Array.from({ length: props.frets + 1 }, (_, i) => i);
  return isReversed.value ? frets.reverse() : frets;
});

// const displayStrings = computed(() => {
//   return isReversed.value
//     ? [...stringsArray.value].reverse()
//     : stringsArray.value;
// });
const displayStrings = computed(() => {
  return [...stringsArray.value]; // ← 上から1弦
});
</script>