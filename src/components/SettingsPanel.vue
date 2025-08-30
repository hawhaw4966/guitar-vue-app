<script setup>
import { ref, watch } from 'vue';
// import { defineProps, defineEmits } from 'vue';
import '../styles/settingspanel.css';

/**
 * 親⇔子の双方向同期（v-model）を defineModel で超短縮
 * - 親の <SettingsPanel v-model:strings="strings" v-model:frets="frets" />
 *   に対応して、子では defineModel('strings'), defineModel('frets') を用意するだけ。
 */
const strings = defineModel('strings', { type: Number, default: 6 })
const frets   = defineModel('frets',   { type: Number, default: 24 })

/**
 * チューニングは「ローカルで編集→適用ボタンで親へ反映」するワークフロー
 * 親から受け取る現在値は props.tuning（配列）
 */

// const props = defineProps({
//   strings: Number,
//   frets: Number,
//   tuning: Array,
// });
 // 親からの現在値（確定値）
const props = defineProps({
  tuning: { type: Array, default: () => [] },//defaultのところが付け加えられたが？
})

const emit = defineEmits(['apply:tuning'])//前回はupdate？
// const emit = defineEmits(['update:strings', 'update:frets', 'update:tuning']);// ← 適用時にだけ飛ばすイベント

// 弦数・フレット数は即時反映（v-model でも @input でもOK）
// function onStrings(e) { emit('update:strings', Number(e.target.value)); }
// function onFrets(e)   { emit('update:frets',   Number(e.target.value)); }

/** ローカル編集用のバッファ */
const localTuning = ref([...props.tuning]); 

// 親から確定値が変わったら UI も追随（手動で巻き戻したい時に備える）
watch(() => props.tuning, (nv) => { localTuning.value = [...nv]; }, { deep: true });

/** 弦数が変わったら、ローカルの配列長を合わせる（足りなければE=4で埋める） */
watch(strings, (n) => {
  const next = localTuning.value.slice(0, n)
  while (next.length < n) next.push(4) // デフォルト E
  localTuning.value = next
})

// 個々のセレクトでローカルだけ書き換える
function onChangeTuning(i, e) {
  const val = Number(e.target.value);
  // 破壊的更新でもOKだが、配列を複製してから代入すると安全
  const next = [...localTuning.value];
  next[i] = val;
  localTuning.value = next;
}
// 「適用」時に *新しい配列* を emit するのがポイント
function applyTuning() {
  emit('apply:tuning', [...localTuning.value]);
}
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

// function applyChanges() {
//    emit('update:strings', localStrings.value);
//   emit('update:frets', localFrets.value);
//   emit('update:tuning', localTuning.value.slice(0, localStrings.value));
// }
</script>

<template>
  <section class="settings-panel">
    <div class="row">
      <label>弦数:
      <input type="number" min="4" max="8" v-model.number="strings" />
      </label>
    </div>
     <!-- <label>弦数: <input type="number" :value="strings" @input="onStrings" min="4" max="8" /></label> -->
      <div class="row">
      <label>フレット数:
      <input type="number" min="18" max="27" v-model.number="frets" />
      </label>
      </div>
    <!-- <label>フレット数: <input type="number" :value="frets" @input="onFrets" min="18" max="27" /></label> -->


   <div class="tuning">
      <h4>チューニング</h4>
      <div class="tuning-row"
         v-for="(v, i) in localTuning" :key="i">
         <label>{{ i + 1 }}弦:</label>
          <select :value="v" @change="onChangeTuning(i, $event)">
            <!-- {{ console.log('弦', i+1, 'の現在値:', v) }} -->
          <option v-for="n in 12" :key="n-1" :value="n-1">
              {{ NOTE_NAMES[n-1] }}
          </option>
         </select>

      </div>
       <button class="apply" @click="applyTuning">適用</button>
   </div>
  </section>
</template>





<!-- <template>
  <div class="settings-panel">
    <label>弦数:
      <input type="number" v-model.number="localStrings" min="4" max="8" />
    </label>

    <label>フレット数:
      <input type="number" v-model.number="localFrets" min="18" max="24" />
    </label>
vue
    <div v-for="(note, i) in localTuning" :key="i">
      <label>弦{{ i + 1 }}の開放音:
        <select v-model.number="localTuning[i]">
          <option v-for="(n, idx) in noteNames" :value="idx">{{ n }}</option>
        </select>
      </label>
    </div>

    <button @click="applyChanges">適用</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import '../styles/settingspanel.css';

const props = defineProps({
  strings: Number,
  frets: Number,
  tuning: Array,
});

const emit = defineEmits(['update-strings', 'update-frets', 'update-tuning']);

const localStrings = ref(props.strings);
const localFrets = ref(props.frets);
const localTuning = ref([...props.tuning]); // コピーしてから編集

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

watch(() => props.tuning, (newVal) => {
  localTuning.value = [...newVal];
});

function applyChanges() {
  emit('update-strings', localStrings.value);
  emit('update-frets', localFrets.value);
  emit('update-tuning', localTuning.value.slice(0, localStrings.value));
}
</script> -->








