import type { StageNo } from './types'

// 階段名稱由 stage_no 對照（data-model.md 4.2）。三點分段只有 1／4／5，
// 所以不能用「第N階段」，一律用這張表。
export const STAGE_LABEL: Record<StageNo, string> = {
  1: '草稿',
  2: '線稿',
  3: '彩稿',
  4: '精稿',
  5: '完稿',
}
