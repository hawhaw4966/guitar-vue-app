// src/composables/usePersistentSettings.ts
import { ref, reactive, watch, toRefs } from 'vue'

type DisplayMode = 'note' | 'note+octave' | 'midi' | 'degree' | 'degree+note'

export interface FretboardSettings {
  version: number
  strings: number
  frets: number
  tuning: number[]           // 各弦の開放音（MIDI番号）
  isReversed: boolean
  isFlat: boolean
  displayMode: DisplayMode
  rootPc: number | null      // 0..11
  chordName: string | null
  chordPcs: number[]         // 0..11
  scaleName: string | null
  scalePcs: number[]         // 0..11
  updated_at: string
}

export interface UsePersistentSettingsOptions {
  boardId?: string           // 複数ボードに備えてキーを分離
  autoWatch?: boolean        // trueなら自動保存
  migrate?: (raw: any) => FretboardSettings // 将来のマイグレーションフック
}

const DEFAULTS: FretboardSettings = {
  version: 1,
  strings: 6,
  frets: 24,
  tuning: [64, 59, 55, 50, 45, 40, 35, 30], // （ E B G D A E B F#）1弦→6弦）
  isReversed: false,
  isFlat: false,
  displayMode: 'note',
  rootPc: null,
  chordName: null,
  chordPcs: [],
  scaleName: null,
  scalePcs: [],
  updated_at: new Date().toISOString(),
}

function makeKey(boardId?: string) {
  const id = boardId ?? 'default'
  return `gva:${id}:settings`
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

function stamp(): string {
  return new Date().toISOString()
}

export function usePersistentSettings(options: UsePersistentSettingsOptions = {}) {
  const { boardId, autoWatch = true, migrate } = options
  const key = makeKey(boardId)

  // 1) ロード
  const loaded = safeParse<FretboardSettings>(localStorage.getItem(key), DEFAULTS)
  const state = reactive<FretboardSettings>({
    ...DEFAULTS,
    ...loaded,
    version: loaded.version ?? DEFAULTS.version,
  })

  // 2) マイグレーション（必要なら）
  if (migrate) {
    const migrated = migrate(state)
    Object.assign(state, migrated)
  }

  // 3) セーブ関数
  function save() {
    state.updated_at = stamp()
    localStorage.setItem(key, JSON.stringify(state))
  }

  // 4) リセット
  function reset() {
  // 1 localStorage 側をリセット
  // そのボード用のキーだけ消したいなら removeItem(key)
  localStorage.removeItem(key)
  // すべて消したいなら ↓
  // localStorage.clear()

  // 2 Vue の状態をデフォルトに戻す
  Object.assign(state, {
    ...DEFAULTS,
    updated_at: stamp(),
  })

  // 3  すぐに「デフォルト状態」で保存し直したいなら save() 呼ぶ
  save()
}

  // 5) 文字列数が変わったらチューニング配列長を追従（不足は E=40 で埋める）
  watch(() => state.strings, (n) => {
    const next = state.tuning.slice(0, n)
      while (next.length < n) {
      const def = DEFAULTS.tuning[next.length] ?? 40
      next.push(def)
    }
    state.tuning = next
    save()
  })

  // 6) 自動保存（深い変更も）
  if (autoWatch) {
    watch(state, () => save(), { deep: true })
  }

  // 7) 便利ヘルパ
  function replace(partial: Partial<FretboardSettings>) {
    Object.assign(state, partial)
    save()
  }

 
  return {
    ...toRefs(state), // strings, frets, tuning, isFlat などをそのままv-modelに使える
    save,
    reset,
    replace,
    key,
  }

  
}
