<script setup>
import { computed } from 'vue'

// 親と双方向
const chordName = defineModel('chordName', { type: [String, null], default: null })
const chordPcs  = defineModel('chordPcs',  { type: Array, default: () => [] })

// 入力
const props = defineProps({
  rootPc:    { type: [Number, null], default: null }, // 0..11
  scaleName: { type: [String, null], default: null }, // 'major','naturalMinor',… (ScalePaletteと合わせる)
  isFlat:    { type: Boolean, default: false },
  isReversed:{ type: Boolean, default: false },
})

// 音名
const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
const names = computed(() => (props.isFlat ? FLAT : SHARP))

// ScalePalette と同じIDで 7音スケールを定義（半音インターバル）
const SCALE_DEFS = {
  major:        [0,2,4,5,7,9,11],
  naturalMinor: [0,2,3,5,7,8,10],
  harmMinor:    [0,2,3,5,7,8,11],
  melMinor:     [0,2,3,5,7,9,11],
  dorian:       [0,2,3,5,7,9,10],
  phrygian:     [0,1,3,5,7,8,10],
  lydian:       [0,2,4,6,7,9,11],
  mixolydian:   [0,2,4,5,7,9,10],
  locrian:      [0,1,3,5,6,8,10],
  pentMajor:    null, // 5音 → 本コンポでは非対象（7音スケールのみ扱う）
  pentMinor:    null,
  blues:        null,
}

/** ルートとスケール名から pitch class 配列（7音）を返す */
function buildScalePcs(rootPc, scaleName) {
  const intervals = SCALE_DEFS[scaleName]
  if (rootPc == null || !intervals) return null
  return intervals.map(semi => (rootPc + semi) % 12) // 長さ7
}

/** ある度 i で 3度堆積: 度0,2,4,6 を取る（%7 で循環）→ PC配列 */
function buildSeventhOnDegree(scalePcs, degreeIndex) {
  const pick = [0, 2, 4, 6]
  return pick.map(k => scalePcs[(degreeIndex + k) % 7])
}

/** 構成音PC → ルート相対の半音セット → 品質判定 */
function classifySeventhQuality(pcs) {
  // ルートを pcs[0] とし、相対インターバル（ソート済）を求める
  const root = pcs[0]
  const rel  = pcs.map(pc => (pc - root + 12) % 12).sort((a,b) => a-b).join(',')
  // 代表的な 4和音
  switch (rel) {
    case '0,4,7,11': return 'maj7'     // 1 3 5 7
    case '0,3,7,10': return 'm7'       // 1 ♭3 5 ♭7
    case '0,4,7,10': return '7'        // 1 3 5 ♭7
    case '0,3,6,10': return 'm7♭5'     // 1 ♭3 ♭5 ♭7
    case '0,3,6,9' : return 'dim7'     // 1 ♭3 ♭5 𝄫7（＝6）
    case '0,3,7,11': return 'mMaj7'    // 1 ♭3 5 7（メロミ等）
    case '0,4,8,11': return 'maj7#5'   // 1 3 #5 7
    case '0,4,8,10': return '7#5'      // 1 3 #5 ♭7
    default:          return '7th'      // 予備
  }
}

/** 表示用ラベル生成（例: Cmaj7, Dm7, Em7, …） */
function chordLabel(pc, quality, isFlat) {
  const rootName = (isFlat ? FLAT : SHARP)[pc]
  // Minorは "m"、半減は "m7♭5" と表記
  return `${rootName}${quality === 'm7' ? 'm7' : quality}`
}

const diatonic = computed(() => {
  if (!props.scaleName) return []
  const scale = buildScalePcs(props.rootPc, props.scaleName)
  if (!scale) return []
  // 7度分作る
  const items = scale.map((pc, i) => {
    const pcs = buildSeventhOnDegree(scale, i)
    const q   = classifySeventhQuality(pcs)
    return {
      degree: i,            // 0..6
      rootPc: pc,           // その和音の根音PC
      pcs,                  // 和音のPC集合（4音）
      quality: q,           // 'maj7','m7','7','m7♭5',...
      label: chordLabel(pc, q, props.isFlat), // 表示文字列
      id: `${pc}:${q}`,     // 内部ID
    }
  })
  return props.isReversed ? items.slice().reverse() : items
})

function selectChord(item) {
  chordName.value = item.label
  chordPcs.value  = item.pcs
}
</script>

<template>
  <div class="diatonic-chords" v-if="diatonic.length">
    <div class="chord-item"
         v-for="ch in diatonic"
         :key="ch.id"
         @click="selectChord(ch)"
         :title="`度数: ${ch.degree+1}`">
      {{ ch.label }}
    </div>
  </div>
  <div v-else class="hint">
    スケール（7音）とルートを選ぶと、ダイアトニック4和音が並びます。
  </div>
</template>

<style scoped>
.diatonic-chords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.chord-item {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fafafa;
  cursor: pointer;
  user-select: none;
  min-width: 70px;
  text-align: center;
  font-weight: 600;
}
.chord-item:hover {
  background: #eef5ff;
  border-color: #9ec3ff;
}
.hint { opacity: .7; font-size: .9rem; margin-top: 8px; }
</style>