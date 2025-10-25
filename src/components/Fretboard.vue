<template>
 <div class="fretboard-container" :class="{ reversed: props.isReversed }">
    
    <!-- フレット番号 -->
    <div class="fret-numbers">
      <div v-for="f in fretsArray" :key="'fret-' + f" class="fret-number">
        {{ f }}
      </div>
    </div>
    <!-- フレットボード -->
    <div class="fretboard">
       <!-- 各弦 -->
       <div
         v-for="(string, sIndex) in displayStrings"
         :key="sIndex"
         class="string-row"
         >
        <div class="string-row">
              <!-- 弦番号セルは常に一個だけ、先頭に置く -->
           <div class="string-label">{{ sIndex + 1 }}弦</div>
           <div
            v-for="(midi, fIndex) in string"
            :key="fIndex"
            class="fret"
            >
             {{ formatNote(midi, props.displayMode) }}
           </div>
        </div>
        
      </div>
   </div>
      <!-- 左右反転ボタン -->
    <!-- <button @click="isReversed = !isReversed" class="reverse-btn">
      {{ isReversed ? "右利き表示" : "左利き表示" }}
    </button> -->
  </div>
</template>


<script setup>
import { ref,computed } from 'vue'
import '../styles/fretboard.css';

const props = defineProps({
  strings: Number,
  frets: Number,
  tuning: Array,       // 各弦の開放弦MIDI番号
  displayMode: String, // 'note' | 'note+octave' | 'midi'
  isReversed: Boolean
});

const isReversed = ref(false);

// 12音階
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// 表示文字を変換する関数
function formatNote(midi, mode) {
  if (mode === 'midi') return midi
  const name = NOTE_NAMES[midi % 12]
  const octave = Math.floor(midi / 12) - 1
  if (mode === 'note') return name
  if (mode === 'note+octave') return `${name}${octave}`
  return midi
}

// フレット番号配列
const fretsArray = computed(() =>
  Array.from({ length: props.frets + 1 }, (_, i) => i)
)

// 弦ごとの開放弦MIDIから全フレットの音を計算
const stringsArray = computed(() =>
  Array.from({ length: props.strings }, (_, i) => {
    const openMidi = props.tuning[i]
    return fretsArray.value.map(fret => openMidi + fret)
  })
)
const displayStrings = computed(() => {
  return [...stringsArray.value]; // ← 上から1弦
});

</script>

