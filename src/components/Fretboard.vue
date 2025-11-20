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
            :class="{
              highlight: props.rootPc !== null && (midi % 12)=== props.rootPc,
             'in-chord': chordPcSet.has(midi % 12), 
             'in-scale': scalePcSet.has(midi % 12)  
             }"
            >
             <!-- {{ formatNote(midi, props.displayMode, props.isFlat) }} -->
            {{ renderCellLabel(midi, props.displayMode, props.isFlat, props.rootPc) }}
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
  displayMode: String, // 'note' | 'note+octave' | 'midi' | 'degree' | 'degree+note'|
  isReversed: Boolean,
  isFlat: Boolean,
  rootPc: { type: [Number, null], default: null },
  chordPcs: { type: Array, default: () => [] }, 
  scalePcs: { type: Array, default: () => [] },
});

const isReversed = ref(false);

// 12音階
const NOTE_NAMES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const NOTE_NAMES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']

// 表示文字を変換する関数
function formatNote(midi, mode, isFlat) {
  if (mode === 'midi') return midi
  const names = isFlat ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP
  const name = names[midi % 12]
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
})
// 高速判定用セット
const chordPcSet = computed(() => new Set(props.chordPcs))
const scalePcSet = computed(() => new Set(props.scalePcs))

// 共有定数（毎回作らないように関数外へ）
const DEG_FLAT = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'] //♭
const DEG_SHRP = ['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', '#6', '7']
const NAMES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const NAMES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']

/**
 * 半音値(0..11)をディグリー文字列に変換
 * @param {number} semiFromRoot 0..11
 * @param {boolean} isFlat
 * @returns {string}
 */
function intervalToDegreeLabel(semiFromRoot, isFlat) {
  switch (semiFromRoot) {
    case 1:  return isFlat ? 'b2' : '#1'
    case 3:  return isFlat ? 'b3' : '#2'
    case 6:  return isFlat ? 'b5' : '#4'
    case 8:  return isFlat ? 'b6' : '#5'
    case 10: return isFlat ? 'b7' : '#6'
    default:
      // それ以外はどちらでも同じ配列でOK
      return (isFlat ? DEG_FLAT : DEG_SHRP)[semiFromRoot]
  }
}

/**
 * セル表示用ラベル生成
 * mode: 'midi' | 'note' | 'note+octave' | 'degree' | 'degree+note'
 * @param {number} midi
 * @param {string} mode
 * @param {boolean} isFlat
 * @param {number|null} rootPc 0..11 or null
 * @returns {string}
 */
function renderCellLabel(midi, mode, isFlat, rootPc) {
  if (mode === 'midi') return String(midi)

  const names = isFlat ? NAMES_FLAT : NAMES_SHARP
  const note = names[midi % 12]
  const oct  = Math.floor(midi / 12) - 1

  if (mode === 'note') return note
  if (mode === 'note+octave') return `${note}${oct}`

  if (mode === 'degree' || mode === 'degree+note') {
    if (rootPc == null) {
      // ルート未選択時は音名系にフォールバック
      return mode === 'degree' ? note : `${note}${oct}`
    }
       const semi = ( (midi % 12) - rootPc + 12 ) % 12
       const deg  = intervalToDegreeLabel(semi, isFlat)
     return mode === 'degree' ? deg : `${deg}${note}`
  }

  // 未知のmodeは安全に音名へ
  return note
}

</script>

