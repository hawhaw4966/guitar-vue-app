<template>
  <div class="fretboard-container" :class="{ reversed: isReversed }">
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
<div class="string-row">
  <!-- 弦番号セルは常に一個だけ、先頭に置く -->
  <div class="string-label">{{ sIndex + 1 }}弦</div>

  <!-- フレットは「昇順のまま」並べる（JSでreverseしない） -->
  <div v-for="f in displayFrets" :key="f" class="fret">
    {{ getNoteName(string, f) }}
  </div>
</div>
       <!-- 弦番号セル左 -->
          <!-- <template v-if="!isReversed">
          <div class="string-label">{{sIndex +1}}弦</div>
         </template> -->
       <!-- フレット音名 -->
         <!-- <div
          v-for="(fret, fIndex) in displayFrets"
          :key="fIndex"
          class="fret"
          >
          {{ getNoteName(string, fret) }}
         </div> -->
       <!-- 弦番号セル右 -->
       <!-- <template v-if="isReversed">
        <div class="string-label">{{ sIndex +1 }}弦</div>
       </template> -->
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
  tuning: Array, // 親からの確定値を受け取る
});

const isReversed = ref(false);

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const stringsArray = computed(() =>
  Array.from({ length: props.strings }, (_, i) => props.tuning[i] ?? 4)
);

const displayFrets = computed(() => {
  const frets = Array.from({ length: props.frets + 1 }, (_, i) => i);
  return  frets;
});

function getNoteName(openNote, fret) {
  return noteNames[(openNote + fret) % 12];
}

// const displayStrings = computed(() => {
//   return isReversed.value
//     ? [...stringsArray.value].reverse()
//     : stringsArray.value;
// });
const displayStrings = computed(() => {
  return [...stringsArray.value]; // ← 上から1弦
});
</script>