// 作品類型、用途各 10 個選項（內容照 spec/features.md 第 0 節）。
// 之後後端好了會改從 GET /categories、GET /purposes 拿，到時候只要改這個檔。
// value ＝ 資料表的 id（category_id／purpose_id），label ＝ 畫面上顯示的名稱。
// imageUrl ＝ 首頁類型下拉面板的卡片圖，只有前 6 項有（後 4 項顯示成文字）。
// 這是前端自己加的欄位，CATEGORY／PURPOSE 資料表沒有圖片欄位，接後端時圖片仍由前端提供。

import characterArtImg from '@/assets/category/character-art.webp'
import illustrationImg from '@/assets/category/illustration.webp'
import avatarImg from '@/assets/category/avatar.webp'
import live2dImg from '@/assets/category/live2d.webp'
import comicImg from '@/assets/category/comic.webp'
import conceptArtImg from '@/assets/category/concept-art.webp'

import personalUseImg from '@/assets/purpose/personal-use.webp'
import commercialUseImg from '@/assets/purpose/commercial-use.webp'
import vtuberImg from '@/assets/purpose/vtuber.webp'
import gameArtImg from '@/assets/purpose/game-art.webp'
import socialMediaImg from '@/assets/purpose/social-media.webp'
import publishingImg from '@/assets/purpose/publishing.webp'

export const CATEGORY_OPTIONS = [
  { value: '1', label: '角色立繪', imageUrl: characterArtImg },
  { value: '2', label: '插畫', imageUrl: illustrationImg },
  { value: '3', label: '頭像／大頭貼', imageUrl: avatarImg },
  { value: '4', label: 'Live2D', imageUrl: live2dImg },
  { value: '5', label: '漫畫', imageUrl: comicImg },
  { value: '6', label: '概念設定', imageUrl: conceptArtImg },
  { value: '7', label: '場景／背景' },
  { value: '8', label: 'Q版貼圖' },
  { value: '9', label: '表情差分' },
  { value: '10', label: '3D 建模' },
]

export const PURPOSE_OPTIONS = [
  { value: '1', label: '個人收藏', imageUrl: personalUseImg },
  { value: '2', label: '商業授權', imageUrl: commercialUseImg },
  { value: '3', label: 'VTuber', imageUrl: vtuberImg },
  { value: '4', label: '遊戲美術', imageUrl: gameArtImg },
  { value: '5', label: '社群媒體', imageUrl: socialMediaImg },
  { value: '6', label: '出版品', imageUrl: publishingImg },
  { value: '7', label: '周邊商品' },
  { value: '8', label: '同人誌' },
  { value: '9', label: '品牌識別' },
  { value: '10', label: '直播素材' },
]
