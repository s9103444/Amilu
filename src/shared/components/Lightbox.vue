<template>
  <!-- Teleport 到 body：燈箱不受所在頁面的 overflow、z-index 影響，一定蓋在最上層 -->
  <Teleport to="body">
    <!-- 【點黑底時觸發】.self：只有點到黑底本身才關，點框裡面不會 -->
    <div class="overlay" @click.self="emit('close')">
      <div class="frame" role="dialog" aria-modal="true">
        <slot></slot>
        <!-- 【點 ✕ 時觸發】放在 slot 後面，才會疊在內容上面 -->
        <button type="button" class="close" aria-label="關閉" @click="emit('close')">
          <img :src="base + 'icons/close-lightbox.svg'" alt="" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/*
元件名稱：燈箱外框（黑底遮罩＋白色圓角框＋右上角 ✕）
範例：
使用前先 import：import Lightbox from '@/shared/components/Lightbox.vue'
<Lightbox v-if="isOpen" @close="isOpen = false">內容</Lightbox>
開關由外面用 v-if 控制：掛上去＝打開、拿掉＝關閉；元件自己不記開關。
關閉的三種方式（點 ✕、點黑底、按 Esc）都只送出 close，由外面把 v-if 的值改掉。
打開期間背景頁面不能捲動。
框的大小固定（桌機 Figma 1200×724，螢幕矮時跟著縮），內容自己決定怎麼排、哪裡要捲動。
*/
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{ close: [] }>()
const base = import.meta.env.BASE_URL

// 【按鍵盤時觸發】只處理 Esc
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// 【燈箱打開（元件掛上）時】開始聽鍵盤、鎖住背景捲動
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})
// 【燈箱關閉（元件拿掉）時】一定要拆掉，不然關了以後按 Esc 還會觸發、頁面也捲不動
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as bp;

// 黑底蓋滿整個視窗，框置中
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--grid-margin);
  background: var(--color-overlay);

  @include bp.desktop-up {
    padding: var(--space-5) 120px; // Figma 左右各留 120
  }
}

// 白框：高度固定，內容超出由內容自己捲；overflow: hidden 讓內容跟著圓角裁切
.frame {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  max-height: 724px;
  overflow: hidden;
  border-radius: var(--radius-lightbox);
  background: var(--color-bg-lightbox);
}

// ✕：Figma 在右欄右上角（距上 24、距右 32），12×12
.close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-4);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; // 圖示只有 12，按鈕放大一點比較好點
  height: 24px;
  margin: -6px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  img {
    display: block;
    width: 12px;
    height: 12px;
  }
}
</style>
