<template>

  <!-- test -->
  <!-- <div class="note-display"> -->
    <!-- 音名とオクターブを両方表示 -->
    <!-- <p>現在のノート: {{ fullNoteName }}</p> -->
    <!-- 音名だけ（画面で使う用） -->
    <!-- <p class="note-only">{{ noteName }}</p> -->
    <!-- <p>{{ note.midi }}</p>
    <p>{{ octave }}</p> -->
  <!-- </div> -->
<!-- test -->

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
         class="string-row">
         <div class="string-row">
            <!-- 弦番号セルは常に一個だけ、先頭に置く -->
           <div class="string-label">{{ sIndex + 1 }}弦</div>

             <!-- フレットは「昇順のまま」並べる（JSでreverseしない） -->
              <div v-for="f in displayFrets" :key="f" class="fret">
                {{ getNoteName(string, f) }}
              </div>
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
import { ref,reactive, computed } from 'vue';
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

const displayStrings = computed(() => {
  return [...stringsArray.value]; // ← 上から1弦
});

// // 音名テーブル（MIDI番号 0〜127 に共通）
// const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// // MIDIノート番号（例：60 = C4）
// const note = reactive({ midi: 55 })

// // 表示用：音名だけ（例："C", "D#", etc）
// const noteName = computed(() => NOTE_NAMES[note.midi % 12])

// // 表示用：オクターブ（例：4）
// const octave = computed(() => Math.floor(note.midi / 12) - 1)

// // フル表示：C4, D#3, など
// const fullNoteName = computed(() => `${noteName.value}${octave.value}`)

</script>