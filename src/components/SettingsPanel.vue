<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import '../styles/settingspanel.css';

const props = defineProps({
  strings: Number,
  frets: Number,
  tuning: Array,
}); // 親からの現在値（確定値）

const emit = defineEmits(['update:strings', 'update:frets', 'update:tuning']);// ← 適用時にだけ飛ばすイベント

// 弦数・フレット数は即時反映（v-model でも @input でもOK）
function onStrings(e) { emit('update:strings', Number(e.target.value)); }
function onFrets(e)   { emit('update:frets',   Number(e.target.value)); }

const localTuning = ref([...props.tuning]); 

// 親から確定値が変わったら UI も追随（手動で巻き戻したい時に備える）
watch(() => props.tuning, (nv) => { localTuning.value = [...nv]; }, { deep: true });

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
// function applyChanges() {
//    emit('update:strings', localStrings.value);
//   emit('update:frets', localFrets.value);
//   emit('update:tuning', localTuning.value.slice(0, localStrings.value));
// }
</script>

<template>
  <div class="settings-panel">
     <label>弦数: <input type="number" :value="strings" @input="onStrings" min="4" max="8" /></label>
    <label>フレット数: <input type="number" :value="frets" @input="onFrets" min="18" max="27" /></label>

     <div v-for="(v, i) in localTuning" :key="i">
      <label>弦{{ i + 1 }}の開放音:
          <select :value="v" @change="onChangeTuning(i, $event)">
            {{ console.log('弦', i+1, 'の現在値:', v) }}
          <option v-for="n in 12" :key="n-1" :value="n-1">
            {{ ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][n-1] }}
          </option>
         </select>
     
      </label>
    </div>
    <button @click="applyTuning">適用</button>
  </div>
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








