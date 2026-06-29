console.log("common.js已載入");

// 生成燈箱
function createLoginModal() {
  const modalHTML = `
     <form id="logInForm" class="login-light-box hidden">
      <div class="login-container">
        <div class="row">
          <div class="col01">
            <div class="lg-bg"></div>
          </div>
          <div class="col02">
            <div class="login-title-content">
              <div class="lg-logo">
                <img src="../Picture/Logo.png" alt="logo" />
              </div>
              <h1 class="lg-title">歡迎回來!</h1>
              <span class="lg-sub-title">請在下方輸入登入資訊</span>
            </div>
            <div class="input-container">
              <!--信箱(帳號)輸入-->
              <div class="input-content">
                <label class="input-label" for="email">Email</label>
                <input
                  type="email"
                  class="input-txt"
                  id="inputEmail"
                  name="email"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
              <!-- 密碼輸入框 -->
              <div class="input-content">
                <label class="input-label" for="password">密碼</label>
                <div class="input-content">
                  <input
                    type="password"
                    id="passWordInput"
                    class="input-txt"
                    name="password"
                    placeholder="請輸入密碼"
                    required
                  /><img
                    class="eye-style"
                    src="../Picture/icon/eyes-op.png"
                    alt="密碼顯示icon"
                  /><img
                    src="../Picture/icon/eyes-cls.png"
                    alt="密碼隱藏icon"
                    class="eye-style hidden"
                  />
                </div>
              </div>
              <div class="login-assist">
                <div class="remember-me">
                  <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    class="hidden"
                  />
                  <label for="remember" class="remember-me"
                    ><span>記住密碼</span></label
                  >
                </div>
                <div class="forgot-psw"><a href="#">忘記密碼?</a></div>
              </div>
              <div class="lg-btn">
                <button type="submit">
                  <span class="btn-local-lg">登入</span>
                </button>
              </div>
              <div class="lg-btn">
                <button type="submit">
                  <span class="btn-google-lg"
                    ><img
                      src="../Picture/icon/google-icon.png"
                      alt="google-logo"
                    />使用Google登入</span
                  >
                </button>
              </div>
            </div>
            <div class="btn-signup">
              <span>還沒有帳號嗎？</span><a href="#">點我註冊</a>
            </div>
          </div>
        </div>
      </div>
    </form>
    `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
createLoginModal();

const loginLightBox = document.querySelector(".login-light-box");

// 點擊登入啟動燈箱（移除hidden）
$("#web-login").on("click", function (e) {
  e.preventDefault();
  $(".login-light-box").removeClass("hidden");
});
$(".login-light-box").on("click", function () {
  $(this).addClass("hidden");
});
$(".login-light-box>.login-container").on("click", function (e) {
  e.stopPropagation();
});

//顯示登入後介面
function SwitchToLoginUI() {
  localStorage.setItem("isLoggedIn", "true"); //紀錄此狀態為"true"
  $(".btn-before-lg").addClass("hidden");
  $(".btn-after-lg").removeClass("hidden");
  $(".btn-md-red-withicon").removeClass("hidden");
  $(".btn-md-red-withicon-pd").removeClass("hidden");
  $("#beforeLoginBlock").addClass("hidden");
  // scrollLocked = false;
  // loginScrollObserver.disconnect();
}
//顯示登出後介面
function SwitchToLogoutUI() {
  localStorage.setItem("isLoggedIn", "false"); //紀錄此狀態為"true"
  $(".btn-before-lg").removeClass("hidden");
  $(".btn-after-lg").addClass("hidden");
  $(".btn-md-red-withicon").addClass("hidden");
  $(".btn-md-red-withicon-pd").addClass("hidden");
  $("#beforeLoginBlock").removeClass("hidden");
}

//用localstorage確認當前狀態(目前只有登入狀態)
$(function () {
  let loginStatus = localStorage.getItem("isLoggedIn");
  if (loginStatus === "true") {
    $(".btn-before-lg").addClass("hidden");
    $(".btn-after-lg").removeClass("hidden");
    $(".btn-md-red-withicon").removeClass("hidden");
    $(".btn-md-red-withicon-pd").removeClass("hidden");
    $("#beforeLoginBlock").addClass("hidden");
  }

  if (loginStatus === "false") {
    $(".btn-before-lg").removeClass("hidden");
    $(".btn-after-lg").addClass("hidden");
    $(".btn-md-red-withicon").addClass("hidden");
    $(".btn-md-red-withicon-pd").addClass("hidden");
    $("#beforeLoginBlock").removeClass("hidden");
  }
});

//點擊使用者頭像展開/收合選單
$(".btn-user-info").on("click", function (e) {
  e.preventDefault();
  $(".info-menu-content").toggleClass("hidden");
  $(".menu-user-info").toggleClass("hidden");
});

// 按登出切換回登入
$("#logout").on("click", function (e) {
  e.preventDefault;
  if (confirm("是否確定登出？")) {
    SwitchToLogoutUI();
    location.href = "../HTML/Amilu_index.html";
  } else {
  }
});

// ---- 登入驗證 ----
// input類別物件
const logInForm = document.getElementById("logInForm");
const emailInput = document.getElementById("inputEmail");
const passWordInput = document.querySelector("#passWordInput");

logInForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;

  // 確認信箱輸入
  const emailValue = emailInput.value.trim();
  if (emailValue === "") {
    isValid = false;
  } else if (checkEmail(emailValue) === false) {
    isValid = false;
  }

  // 確認密碼輸入
  const passwordValue = passWordInput.value.trim();
  if (passwordValue === "") {
    isValid = false;
  }

  if (isValid === true) {
    SwitchToLoginUI();
    $(loginLightBox).addClass("hidden");
  }
});

function checkEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// 點按登入前底部的導頁
$(".CTA-login-bottom").on("click", function () {
  $(".login-light-box").removeClass("hidden");
});

// 設定登入前制止瀏覽機制
const beforeLoginBlock = document.getElementById("beforeLoginBlock");

let scrollLocked = false;

const loginScrollObserver = new IntersectionObserver(
  function (e) {
    scrollLocked = e[0].isIntersecting; //完全進入範圍時轉換物件
  },
  {
    threshold: 0, // 100% 進入視口才觸發
  },
);

if (beforeLoginBlock) {
  loginScrollObserver.observe(beforeLoginBlock);
}

// wheel往下滾條件+容器完全進入視口皆成立
window.addEventListener(
  "wheel",
  function (e) {
    if (scrollLocked && e.deltaY > 0) {
      e.preventDefault();
    }
  },
  { passive: false },
);

// touchstart往下滾條件+容器完全進入視口皆成立
let touchStartY = 0; //點下去時的那一座標

window.addEventListener("touchstart", function (e) {
  touchStartY = e.touches[0].clientY; //clientY:紀錄視口頂端（０）到觸碰點的距離
});
window.addEventListener(
  "touchmove",
  function (e) {
    const currentTouch = e.touches[0].clientY;
    const scrollDown = currentTouch < touchStartY;

    if (scrollLocked && scrollDown) {
      e.preventDefault();
    }
  },
  { passive: false },
);
