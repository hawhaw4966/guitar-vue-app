<script setup>
import { computed, watch } from 'vue'

// 親と双方向バインド
const chordName = defineModel('chordName', { type: [String, null], default: null })
const chordPcs  = defineModel('chordPcs',  { type: Array, default: () => [] })

// ルート（0..11 or null）
const props = defineProps({
  rootPc: { type: [Number, null], default: null },
})

// よく使うコードの度数（半音単位）
// 0 は必ずルート（rootPc）を表す（最終的に rootPc + interval → %12）
const CHORD_DEFS = [
  { id: 'maj',   label: 'maj',   intervals: [0, 4, 7] },
  { id: 'min',   label: 'min',   intervals: [0, 3, 7] },
  { id: 'maj7',  label: 'maj7',  intervals: [0, 4, 7, 11] },
  { id: 'm7',    label: 'm7',    intervals: [0, 3, 7, 10] },
  { id: '7',     label: '7',     intervals: [0, 4, 7, 10] },
  { id: 'm7b5',  label: 'm7♭5',  intervals: [0, 3, 6, 10] }, 
  { id: 'dim',   label: 'dim',   intervals: [0, 3, 6] },
  { id: 'dim7',  label: 'dim7',  intervals: [0, 3, 6, 9] },
  { id: 'aug',   label: 'aug',   intervals: [0, 4, 8] },
  { id: 'sus2',  label: 'sus2',  intervals: [0, 2, 7] },
  { id: 'sus4',  label: 'sus4',  intervals: [0, 5, 7] },
  { id: '6',     label: '6',     intervals: [0, 4, 7, 9] },
  { id: 'm6',    label: 'm6',    intervals: [0, 3, 7, 9] },
  { id: 'add9',  label: 'add9',  intervals: [0, 4, 7, 14] }, // 9 = 14半音
  // 追加したくなったらここに増やすだけ
]

// ルートが無い時はボタンをdisable
const disabled = computed(() => props.rootPc === null)

function toPcs(root, intervals) {
  return intervals.map(semi => (root + semi) % 12)
}

function selectChord(def) {
  // ルート未選択なら何もしない
  if (props.rootPc === null) return
  chordName.value = def.id
  chordPcs.value  = toPcs(props.rootPc, def.intervals)
}

function clearChord() {
  chordName.value = null
  chordPcs.value  = []
}

// ルートが変わったら chordPcs を再計算（同じ chord を保つ）
watch(() => props.rootPc, (nv) => {
  if (nv === null || !chordName.value) {
    chordPcs.value = []
    return
  }
  const def = CHORD_DEFS.find(d => d.id === chordName.value)
  if (def) chordPcs.value = toPcs(nv, def.intervals)
})

// chordName が変わった時も再計算
watch(chordName, (name) => {
  if (props.rootPc === null || !name) {
    chordPcs.value = []
    return
  }
  const def = CHORD_DEFS.find(d => d.id === name)
  if (def) chordPcs.value = toPcs(props.rootPc, def.intervals)
})
</script>

<template>
  <div class="chord-palette">
    <div class="group">
      <span class="group-title">basic chord</span>
      <div class="btns">
        <button
          v-for="def in CHORD_DEFS.slice(0, 8)"  
          :key="def.id"
          class="chord-btn"
          :class="{ active: chordName === def.id }"
          :disabled="disabled"
          @click="selectChord(def)"
        >
        <!-- maj/min/7/maj7/m7 -->
          {{ def.label }}
        </button>
      </div>
    </div>

    <div class="group">
      <span class="group-title">others</span>
      <div class="btns">
        <button
          v-for="def in CHORD_DEFS.slice(8)"      
          :key="def.id"
          class="chord-btn"
          :class="{ active: chordName === def.id }"
          :disabled="disabled"
          @click="selectChord(def)"
        >
        <!-- 残りのカラー系 -->
          {{ def.label }}
        </button>
      </div>
    </div>

    <div class="row">
      <button class="clear" :disabled="!chordName" @click="clearChord">クリア</button>
    </div>
  </div>
</template>

<style scoped>
.chord-palette { display: grid; gap: 10px; margin-top: 12px; }
.group-title { font-size: .9rem; opacity: .8; margin-right: 8px; }
.btns { display: flex; flex-wrap: wrap; gap: 8px; }
.chord-btn {
  min-width: 54px; padding: 6px 10px;
  border: 1px solid #ccc; border-radius: 6px;
  background: #f7f7f7; cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI";
}
.chord-btn.active { background: #2b7cff; color: #fff; border-color: #2b7cff; font-weight: 600; }
.chord-btn:disabled { opacity: .5; cursor: not-allowed; }
.row { display: flex; gap: 8px; }
.clear {
  padding: 6px 10px; border: 1px solid #bbb; border-radius: 6px;
  background: #fff; cursor: pointer;
}
</style>