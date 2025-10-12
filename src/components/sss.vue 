<template>
  <div class="settings-panel">
    <label>弦数:
      <input type="number" v-model.number="localStrings" min="1" max="8" />
    </label>

    <label>フレット数:
      <input type="number" v-model.number="localFrets" min="1" max="24" />
    </label>

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
</script>

<style scoped>
.settings-panel {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.settings-panel label {
  display: block;
  margin: 8px 0;
}
</style>