<template>
  <div class="playground">
    <section>
      <h2>Button</h2>
      <p>primary / full</p>
      <Button>登入</Button>
      <p>primary / hug</p>
      <Button width="hug">登入</Button>
    </section>

    <section>
      <p>secondary / full</p>
      <Button variant="secondary">登入</Button>
      <p>secondary / hug</p>
      <Button variant="secondary" width="hug">登入</Button>
    </section>

    <section>
      <p>primary / disabled</p>
      <Button disabled>登入</Button>
      <p>secondary / disabled</p>
      <Button variant="secondary" disabled>登入</Button>
      <p>primary / hug / disabled</p>
      <Button width="hug" disabled>登入</Button>
    </section>
    <br />
    <section>
      <h2>UserMenuButton</h2>
      <p>點一下切換開關（目前：{{ isMenuOpen ? '打開' : '關閉' }}）</p>
      <UserMenuButton :open="isMenuOpen" @click="isMenuOpen = !isMenuOpen" />
    </section>
    <br />
    <section>
      <h2>UserMenu</h2>
      <p>點頭像打開選單；點「上傳作品」展開子項目；點選單外面關閉</p>
      <div class="user-menu-demo">
        <UserMenu />
      </div>
    </section>
    <br />
    <section>
      <h2>個人選單：開通創作者</h2>
      <ActivateCreatorButton />
    </section>
    <br />
    <section>
      <h2>SearchBar</h2>
      <SearchBar v-model="searchText" @search="lastSearch = $event" />
      <p>測試文字：{{ searchText }}</p>
      <p>最近一次搜尋文字：{{ lastSearch }}</p>
    </section>
    <br />
    <section>
      <h2>NotificationItem</h2>
      <p>點頁籤切換（目前：{{ notifyTab === 'notify' ? '通知' : '聊天' }}）</p>
      <div class="row">
        <NotificationItem
          button-type="notify"
          :active="notifyTab === 'notify'"
          :notice-number="999"
          @click="notifyTab = 'notify'"
        />
        <NotificationItem
          button-type="chat"
          :active="notifyTab === 'chat'"
          @click="notifyTab = 'chat'"
        />
      </div>
    </section>
    <br />
    <section>
      <h2>NotificationMenuItem</h2>
      <p>未讀（10 分鐘前）／已讀（昨天）／已讀（超過一個月顯示日期）</p>
      <div class="notification-menu-demo">
        <NotificationMenuItem
          unread
          type="notify"
          text="乙方使用者暱稱 已上傳「頭像（肩膀以上）」第一階段稿件，請於 5 天內確認。"
          :past-timestamp="Date.now() - 10 * 60 * 1000"
        />
        <NotificationMenuItem
          text="系統已代為確認「Q 版貼圖」第二階段稿件。"
          type="notify"
          :past-timestamp="Date.now() - 30 * 60 * 60 * 1000"
        />
        <NotificationMenuItem
          text="系統公告：平台將於週日凌晨進行維護。"
          type="notify"
          :past-timestamp="Date.now() - 40 * 24 * 60 * 60 * 1000"
        />
      </div>
      <p>對話：短訊息／長訊息（超出寬度變成「…」）</p>
      <div class="notification-menu-demo">
        <NotificationMenuItem
          type="chat"
          :user-photo="demoImage"
          user-name="XXX"
          order-title="頭像（肩膀以上）"
          chat-content="嗨嗨～您好"
          :past-timestamp="Date.now() - 10 * 60 * 1000"
        />
        <NotificationMenuItem
          type="chat"
          :user-photo="demoImage"
          user-name="使用者名稱"
          order-title="Q 版貼圖（一套 8 張）"
          chat-content="嗨嗨～您好，我現在準備好初稿了，麻煩您有空的時候看一下，有需要修改的地方再跟我說"
          :past-timestamp="Date.now() - 30 * 60 * 60 * 1000"
        />
      </div>
    </section>
    <br />
    <section>
      <h2>NotificationMenu</h2>
      <p>點鈴鐺打開；切換「通知／聊天」頁籤；按「全部標為已讀」後紅點和數字消失；點外面關閉</p>
      <div class="user-menu-demo">
        <NotificationMenu />
      </div>
    </section>
    <br />
    <section>
      <h2>Follow Button</h2>
      <p>點一下切換追蹤（目前：{{ isFollowed ? '已追蹤' : '未追蹤' }}）</p>
      <FollowButton :followed="isFollowed" @click="isFollowed = !isFollowed" />
    </section>
    <br />
    <section>
      <h2>GoogleAuthButton</h2>
      <GoogleAuthButton />
    </section>
    <br />
    <section>
      <h2>OrderFloatingButton</h2>
      <p>chat</p>
      <OrderFloatingButton status="chat" />
      <p>info</p>
      <OrderFloatingButton status="info" />
    </section>
    <br />
    <section>
      <h2>FormInput</h2>
      <FormInput v-model="input" type="text">使用者ID</FormInput>
      <p>測試同步文字：{{ input }}</p>
      <p>email + 錯誤訊息（輸入 error 會出現錯誤）</p>
      <FormInput
        v-model="email"
        type="email"
        :error="email === 'error' ? '此 email 已被註冊' : ''"
      />
      <p>password</p>
      <FormInput v-model="password" type="password" />
      <p>readonly</p>
      <FormInput v-model="readonlyAccount" readonly>帳號</FormInput>
    </section>

    <section>
      <h2>FormTextarea</h2>
      <FormTextarea v-model="description">委託說明</FormTextarea>
      <p>測試同步文字：{{ description }}</p>
      <p>必填 + 字數上限 10（打到 10 個字就打不進去）</p>
      <FormTextarea v-model="limitedDescription" requirement="necessary" :text-limit="10">
        備註
      </FormTextarea>
      <p>選填</p>
      <FormTextarea v-model="optionalDescription" requirement="optional">補充說明</FormTextarea>
    </section>

    <section>
      <h2>FormSelect</h2>
      <p>必填</p>
      <FormSelect v-model="category" requirement="required" :options="CATEGORY_OPTIONS"
        >作品類型</FormSelect
      >
      <p>選填</p>
      <FormSelect v-model="purpose" requirement="optional" :options="PURPOSE_OPTIONS"
        >作品用途</FormSelect
      >
    </section>

    <section>
      <h2>FormCheckbox</h2>
      <FormCheckbox v-model="agreed">我了解刪除後無法復原，仍要刪除帳號</FormCheckbox>
      <p>目前：{{ agreed ? '已勾選' : '未勾選' }}</p>
    </section>

    <section>
      <h2>OptionButton</h2>
      <div class="row">
        <OptionButton v-model="deposit" name="deposit" value="30">30%</OptionButton>
        <OptionButton v-model="deposit" name="deposit" value="50">50%</OptionButton>
        <OptionButton v-model="deposit" name="deposit" value="0">無需先支付</OptionButton>
      </div>
      <p>目前：{{ deposit || '未選' }}</p>
    </section>

    <h2>ImageUploadSlot</h2>

    <section class="row">
      <div>
        <p>uploaded-cover</p>
        <ImageUploadSlot status="uploaded-cover" />
      </div>
      <div>
        <p>uploaded</p>
        <ImageUploadSlot status="uploaded" />
      </div>
      <div>
        <p>add</p>
        <ImageUploadSlot status="add" />
      </div>
    </section>

    <section>
      <p>uploaded-cover / 標記改序號</p>
      <ImageUploadSlot status="uploaded-cover" badge="1" />
      <p>uploaded-cover / 不顯示標記</p>
      <ImageUploadSlot status="uploaded-cover" :show-badge="false" />
    </section>

    <h2>AvatarUpload</h2>

    <section>
      <AvatarUpload />
    </section>

    <h2>DropZone</h2>

    <section>
      <DropZone />
    </section>

    <h2>FilterChip</h2>

    <section class="row">
      <div>
        <p>filled</p>
        <FilterChip>一般貼文</FilterChip>
      </div>
      <div>
        <p>outline</p>
        <FilterChip variant="outline">半厚塗</FilterChip>
      </div>
    </section>

    <h2>HashtagLabel</h2>

    <section class="row">
      <div>
        <p>button</p>
        <HashtagLabel>#厚塗</HashtagLabel>
      </div>
      <div>
        <p>post</p>
        <HashtagLabel variant="post">#厚塗</HashtagLabel>
      </div>
    </section>

    <h2>CommercialTag</h2>

    <section>
      <CommercialTag />
    </section>

    <h2>StepNumber</h2>

    <section>
      <StepNumber :number="5" />
    </section>

    <h2>OpenStatusTag</h2>

    <section class="row">
      <div>
        <p>open</p>
        <OpenStatusTag :open="true" />
      </div>
      <div>
        <p>closed</p>
        <OpenStatusTag :open="false" />
      </div>
    </section>

    <h2>CategoryCard</h2>

    <!-- 卡片寬度跟著外層；這裡用 Figma 的 180px 測試。正式的類型圖片之後放 src/assets/ -->
    <section class="category-card-demo">
      <CategoryCard name="角色立繪" :image-url="demoImage" />
    </section>

    <h2>CategorySelect</h2>

    <!-- 面板會和最近一個有 position 的外層一樣寬，這裡模擬首頁放按鈕的那一列 -->
    <section class="row category-select-demo">
      <CategorySelect v-model="pickedCategory" button-type="category" />
      <CategorySelect v-model="pickedPurpose" button-type="purpose" />
    </section>
    <p>選到的 category_id：{{ pickedCategory || '（還沒選）' }}</p>
    <p>選到的 purpose_id：{{ pickedPurpose || '（還沒選）' }}</p>

    <h2>InfoBox</h2>

    <section>
      <InfoBox>請於 2026/10/03 23:59 前使用 ATM 轉帳至收款帳號付款。</InfoBox>
    </section>

    <h2>WarningBox</h2>

    <section>
      <p>paragraph</p>
      <WarningBox title="你還有尚未結束的委託">
        請等委託完成、取消或終止合作，並補齊所有款項後，再刪除帳號。
      </WarningBox>
      <p>list</p>
      <WarningBox
        title="刪除後無法復原"
        :items="[
          '將無法再登入此帳號，帳號 ID 也無法再次註冊使用',
          '個人頁、作品與可委託項目將不再公開顯示',
          '已完成或已取消的委託紀錄會保留，對方看到的是「已刪除的使用者」',
          '有進行中的委託或尚未補齊的款項時，無法刪除帳號',
        ]"
      />
    </section>

    <h2>SavedToast</h2>

    <section>
      <SavedToast />
    </section>

    <h2>DividerWithText</h2>

    <section>
      <DividerWithText />
    </section>

    <h2>MenuDivider</h2>

    <section>
      <MenuDivider />
    </section>

    <h2>OrderStatusTag</h2>

    <section class="row">
      <div>
        <p>awaiting-quote</p>
        <OrderStatusTag status="awaiting-quote" />
      </div>
      <div>
        <p>awaiting-payment</p>
        <OrderStatusTag status="awaiting-payment" />
      </div>
      <div>
        <p>in-progress</p>
        <OrderStatusTag status="in-progress" />
      </div>
      <div>
        <p>completed</p>
        <OrderStatusTag status="completed" />
      </div>
      <div>
        <p>cancelled</p>
        <OrderStatusTag status="cancelled" />
      </div>
      <div>
        <p>incomplete</p>
        <OrderStatusTag status="incomplete" />
      </div>
      <div>
        <p>awaiting-top-up</p>
        <OrderStatusTag status="awaiting-top-up" />
      </div>
      <div>
        <p>top-up-pending-confirm</p>
        <OrderStatusTag status="top-up-pending-confirm" />
      </div>
      <div>
        <p>terminated</p>
        <OrderStatusTag status="terminated" />
      </div>
    </section>

    <h2>StageTag</h2>

    <section class="row">
      <div>
        <p>未確認 / 1</p>
        <StageTag :stage_no="1" />
      </div>
      <div>
        <p>已確認 / 1</p>
        <StageTag :stage_no="1" confirmed />
      </div>
      <div>
        <p>已確認 / 4</p>
        <StageTag :stage_no="4" confirmed />
      </div>
      <div>
        <p>未確認 / 5</p>
        <StageTag :stage_no="5" />
      </div>
    </section>

    <section>
      <h2>StageProgress</h2>
      <p>五點分段：目前在草稿</p>
      <div class="narrow"><StageProgress :current="1" /></div>
      <p>目前在線稿</p>
      <div class="narrow"><StageProgress :current="2" /></div>
      <p>目前在彩稿</p>
      <div class="narrow"><StageProgress :current="3" /></div>
      <p>目前在精稿</p>
      <div class="narrow"><StageProgress :current="4" /></div>
      <p>目前在完稿</p>
      <div class="narrow"><StageProgress :current="5" /></div>
      <p>三點分段：目前在精稿</p>
      <div class="narrow"><StageProgress :stages="[1, 4, 5]" :current="4" /></div>
    </section>

    <section class="wide">
      <h2>OrderCard</h2>
      <p>creator / 有金額 + 次要按鈕（查看類）</p>
      <OrderCard
        role="creator"
        status="awaiting-quote"
        title="頭像（肩膀以上）"
        counterpart="創作者暱稱 @creator_id"
        time-info="申請時間 2026 / 10 / 01　・　等待創作者報價"
        amount="NT$ 4,500"
      >
        <template #action>
          <Button variant="secondary" width="hug">查看委託</Button>
        </template>
      </OrderCard>
      <p>commissioner / 主要按鈕（需要使用者動手）</p>
      <OrderCard
        role="commissioner"
        status="awaiting-quote"
        title="全身立繪"
        counterpart="委託人暱稱 @commissioner_id"
        time-info="申請時間 2026 / 10 / 02　・　等待你報價"
        amount="NT$ 8,000"
      >
        <template #action>
          <Button width="hug">前往報價</Button>
        </template>
      </OrderCard>
      <p>沒有按鈕，改顯示狀態說明</p>
      <OrderCard
        role="creator"
        status="awaiting-payment"
        title="頭像（肩膀以上）"
        counterpart="創作者暱稱 @creator_id"
        time-info="申請時間 2026 / 10 / 01　・　等待委託人付款"
        amount="NT$ 4,500"
        status-note="等待委託人付款"
      />
      <p>標題太長會截斷</p>
      <OrderCard
        role="creator"
        status="in-progress"
        title="這是一個非常非常非常非常非常非常非常非常非常非常非常長的案件標題"
        counterpart="創作者暱稱 @creator_id"
        time-info="申請時間 2026 / 10 / 01"
        amount="NT$ 12,000"
      >
        <template #action>
          <Button variant="secondary" width="hug">查看委託</Button>
        </template>
      </OrderCard>
    </section>

    <section>
      <h2>WorkInfo</h2>
      <p>有標籤</p>
      <WorkInfo
        title="作品標題"
        description="這是一段用於版面設計與介面視覺測試的預設佔位文字，用來呈現真實的排版樣式、字體比例與文案行距效果。"
        :tags="['厚塗', '半厚塗', '賽璐珞', 'dsadas']"
      />
      <p>沒有標籤（標籤列不顯示）</p>
      <WorkInfo title="作品標題" description="只有標題與說明。" />
    </section>

    <section>
      <h2>SideMenuItem</h2>
      <p>點一下切換選中（目前：{{ activeSide }}）；灰字項目一樣可以點</p>
      <div class="narrow">
        <SideMenuItem
          v-for="item in sideMenu"
          :key="item.key"
          :title="item.title"
          :status="activeSide === item.key ? 'selected' : item.secondary ? 'secondary' : 'default'"
          @click="activeSide = item.key"
        />
      </div>
    </section>

    <section>
      <h2>FollowUserRow</h2>
      <p>點按鈕切換追蹤；點頭像或名字（最後點的：{{ lastSelectedUser || '還沒點' }}）</p>
      <FollowUserRow
        v-for="user in MOCK_USERS"
        :key="user.id"
        :avatar-url="user.avatar_url"
        :nickname="user.nickname"
        :user-id="user.id"
        :followed="followedIds.includes(user.id)"
        @toggle-follow="toggleFollow(user.id)"
        @select="lastSelectedUser = user.nickname"
      />
    </section>

    <section>
      <h2>UserInfoBar</h2>
      <p>直式（預設）</p>
      <UserInfoBar
        :avatar-url="MOCK_USERS[0]!.avatar_url"
        :nickname="MOCK_USERS[0]!.nickname"
        :user-id="MOCK_USERS[0]!.id"
      />
      <p>橫式</p>
      <UserInfoBar
        :avatar-url="MOCK_USERS[0]!.avatar_url"
        :nickname="MOCK_USERS[0]!.nickname"
        :user-id="MOCK_USERS[0]!.id"
        layout="horizontal"
      />
      <p>沒有大頭照（顯示預設圖）</p>
      <UserInfoBar
        :avatar-url="MOCK_USERS[1]!.avatar_url"
        :nickname="MOCK_USERS[1]!.nickname"
        :user-id="MOCK_USERS[1]!.id"
      />
    </section>

    <section>
      <h2>WorkCard</h2>
      <p>點卡片：{{ lastWorkClick || '還沒點' }}</p>
      <div class="row work-card-demo">
        <div>
          <p>橫圖</p>
          <WorkCard
            :image-url="illustrationImg"
            title="作品名稱"
            :author-id="MOCK_USERS[0]!.id"
            :author-avatar-url="MOCK_USERS[0]!.avatar_url"
            @click="lastWorkClick = '橫圖'"
          />
        </div>
        <div>
          <p>直圖（高度跟著圖片比例）</p>
          <WorkCard
            :image-url="sampleAvatarImg"
            title="作品名稱很長很長很長很長很長"
            :author-id="MOCK_USERS[1]!.id"
            :author-avatar-url="MOCK_USERS[1]!.avatar_url"
            @click="lastWorkClick = '直圖'"
          />
        </div>
        <div>
          <p>可委託項目（type="commission-item"）</p>
          <WorkCard
            type="commission-item"
            :image-url="characterArtImg"
            title="委託項目名稱"
            :author-id="MOCK_USERS[0]!.id"
            :author-avatar-url="MOCK_USERS[0]!.avatar_url"
            @click="lastWorkClick = '可委託項目'"
          />
        </div>
      </div>
    </section>

    <section>
      <h2>ProfileWorkCard</h2>
      <p>最後一次事件：{{ lastProfileCardEvent || '還沒點' }}</p>
      <div class="row profile-work-card-demo">
        <div>
          <p>自己的專頁（有「⋯」）</p>
          <ProfileWorkCard
            :image-url="characterArtImg"
            title="作品標題"
            category="作品類型・用途"
            @select="lastProfileCardEvent = 'select'"
            @more="lastProfileCardEvent = 'more'"
          />
        </div>
        <div>
          <p>別人的專頁（沒有「⋯」）</p>
          <ProfileWorkCard
            :image-url="characterArtImg"
            title="作品標題很長很長很長很長很長很長"
            category="作品類型・用途"
            :show-more-menu="false"
            @select="lastProfileCardEvent = 'select'"
          />
        </div>
      </div>
    </section>

    <section>
      <h2>CommissionRules</h2>
      <p>點標題展開／收合</p>
      <CommissionRules title="作者簡介">
        你好，我是自由插畫家
        [姓名/筆名]。專注於角色設計、繪本創作與視覺插畫，擅長將抽象的情感與概念轉化為具體的視覺語言。作品曾參與多個品牌合作與展出，注重畫面細節與色彩的和諧。這裡是我紀錄靈感與發表新作的空間，歡迎私訊交流，接案與合作請聯繫
        [Email]。
      </CommissionRules>
    </section>

    <section class="wide">
      <h2>PaymentPlanCard</h2>
      <p>目前：{{ paymentPlan || '未選' }}</p>
      <div class="payment-plan-demo">
        <PaymentPlanCard
          v-model="paymentPlan"
          name="payment-plan"
          value="deposit"
          title="先付訂金（30%）"
          amount="NT$ 540"
          note="其餘 NT$ 1,260 於最終結算時補齊"
        />
        <PaymentPlanCard
          v-model="paymentPlan"
          name="payment-plan"
          value="full"
          title="一次付清"
          amount="NT$ 1,800"
          note="全額由平台託管，最終結算時無需補款"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/components/Button.vue'
import UserMenuButton from '@/layouts/components/header/UserMenuButton.vue'
import UserMenu from '@/layouts/components/header/UserMenu.vue'
import ActivateCreatorButton from '@/layouts/components/header/ActivateCreatorButton.vue'
import SearchBar from '@/layouts/components/header/SearchBar.vue'
import NotificationItem from '@/layouts/components/header/NotificationItem.vue'
import NotificationMenuItem from '@/layouts/components/header/NotificationMenuItem.vue'
import NotificationMenu from '@/layouts/components/header/NotificationMenu.vue'
import FollowButton from '@/shared/components/FollowButton.vue'
import FormInput from '@/shared/components/FormInput.vue'
import FormTextarea from '@/shared/components/FormTextarea.vue'
import FormSelect from '@/shared/components/FormSelect.vue'
import FormCheckbox from '@/shared/components/FormCheckbox.vue'
import OptionButton from '@/features/profile/components/OptionButton.vue'
import GoogleAuthButton from '@/features/account/components/GoogleAuthButton.vue'
import OrderFloatingButton from '@/features/order/components/OrderFloatingButton.vue'
import OrderStatusTag from '@/features/order/components/OrderStatusTag.vue'
import StageTag from '@/features/order/components/StageTag.vue'
import StageProgress from '@/features/order/components/StageProgress.vue'
import OrderCard from '@/features/order/components/OrderCard.vue'
import WorkInfo from '@/features/explore/components/WorkInfo.vue'
import ImageUploadSlot from '@/shared/components/ImageUploadSlot.vue'
import AvatarUpload from '@/shared/components/AvatarUpload.vue'
import DropZone from '@/shared/components/DropZone.vue'
import FilterChip from '@/shared/components/FilterChip.vue'
import HashtagLabel from '@/shared/components/HashtagLabel.vue'
import CommercialTag from '@/shared/components/CommercialTag.vue'
import StepNumber from '@/shared/components/StepNumber.vue'
import OpenStatusTag from '@/features/explore/components/OpenStatusTag.vue'
import CategoryCard from '@/features/explore/components/CategoryCard.vue'
import CategorySelect from '@/features/explore/components/CategorySelect.vue'
import InfoBox from '@/shared/components/InfoBox.vue'
import WarningBox from '@/shared/components/WarningBox.vue'
import SavedToast from '@/shared/components/SavedToast.vue'
import DividerWithText from '@/shared/components/DividerWithText.vue'
import MenuDivider from '@/shared/components/MenuDivider.vue'
import SideMenuItem from '@/shared/components/SideMenuItem.vue'
import FollowUserRow from '@/features/explore/components/FollowUserRow.vue'
import UserInfoBar from '@/features/explore/components/UserInfoBar.vue'
import WorkCard from '@/features/explore/components/WorkCard.vue'
import ProfileWorkCard from '@/features/explore/components/ProfileWorkCard.vue'
import CommissionRules from '@/features/explore/components/CommissionRules.vue'
import PaymentPlanCard from '@/features/order/components/PaymentPlanCard.vue'
import illustrationImg from '@/assets/category/illustration.webp'
import characterArtImg from '@/assets/category/character-art.webp'
import sampleAvatarImg from '@/assets/user/sample-avatar.png'
import { MOCK_USERS } from '@/mocks/user'
import { ref } from 'vue'
import { CATEGORY_OPTIONS, PURPOSE_OPTIONS } from '@/mocks/classification'
const searchText = ref('')
const lastSearch = ref('')
const isMenuOpen = ref(false)
// NotificationItem 測試：記住目前選中哪個頁籤
const notifyTab = ref<'notify' | 'chat'>('notify')
const isFollowed = ref(false)
const input = ref('')
const email = ref('')
const password = ref('')
const readonlyAccount = ref('amilu_user')
const description = ref('')
const limitedDescription = ref('')
const optionalDescription = ref('')
const category = ref('2')
const purpose = ref('')
const pickedCategory = ref('')
const pickedPurpose = ref('')
const agreed = ref(false)
const deposit = ref('30')
// 測試圖借用 public/ 裡現有的圖。public/ 的檔案要由使用的地方自己接上 BASE_URL
const demoImage = import.meta.env.BASE_URL + 'picture/default-user-pic.png'
// SideMenuItem 測試：委託討論牆的左側選單（spec/features.md 4.4）
const sideMenu = [
  { key: 'wall', title: '委託討論牆' },
  { key: 'item', title: '委託項目檢視' },
  { key: 'terminate', title: '申請終止合作', secondary: true },
]
const activeSide = ref('wall')
// FollowUserRow 測試：記住哪些人被追蹤
const followedIds = ref<string[]>(['painter_01'])
const lastSelectedUser = ref('')
// 第二批組合元件測試：記住最後一次點擊、付款方案的選擇
const lastWorkClick = ref('')
const lastProfileCardEvent = ref('')
const paymentPlan = ref('deposit')
function toggleFollow(id: string) {
  followedIds.value = followedIds.value.includes(id)
    ? followedIds.value.filter((followedId) => followedId !== id)
    : [...followedIds.value, id]
}
</script>

<style lang="scss" scoped>
.playground {
  max-width: 500px;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

section {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

// 案件卡設計稿寬 888，比頁面的 500 寬，所以這一區放寬（小螢幕時不超出視窗）
.wide {
  width: min(888px, calc(100vw - 2 * var(--space-3)));
}

// 進度條設計稿寬 352
.narrow {
  width: 352px;
  max-width: 100%;
}
// 個人選單的面板對齊按鈕右邊、往左長，按鈕靠右放才看得到整個面板；
// 高度先撐開，展開後的面板才不會蓋到下一段元件
.user-menu-demo {
  display: flex;
  justify-content: flex-end;
  // min-height: 600px;
}
// 通知視窗寬 340px（Figma 514:1617）
.notification-menu-demo {
  width: 340px;
}
.category-card-demo {
  width: 180px;
}

// 測試頁整頁限制 500px 寬，這一段刻意超出，才看得出平板／桌機的欄數
.category-select-demo {
  position: relative;
  width: min(1290px, calc(100vw - 2 * var(--space-3)));
}

// 瀑布流卡片設計稿寬 309；兩張並排、上緣對齊，才看得出高度跟著圖片比例
.work-card-demo {
  align-items: flex-start;
  & > div {
    width: 220px;
  }
}

// 個人頁作品卡設計稿寬 250
.profile-work-card-demo {
  align-items: flex-start;
  & > div {
    width: 220px;
  }
}

// 付款方案卡兩張並排（features.md 4.3），外層灰底同 Figma 展示
.payment-plan-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: 16px;
  background: var(--color-bg-main);
}

// 小元件並排顯示
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  // gap: var(--space-3);
}
</style>
