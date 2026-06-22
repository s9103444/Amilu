console.log("common.js已載入");

// 生成燈箱
function createLoginModal() {
  const modalHTML = `
     <div class="login-light-box hidden">
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
                  id="email"
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
                    id="password"
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
    </div>
    `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
createLoginModal();

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
}
//顯示登出後介面
function SwitchToLogoutUI() {
  localStorage.setItem("isLoggedIn", "false"); //紀錄此狀態為"true"
  $(".btn-before-lg").removeClass("hidden");
  $(".btn-after-lg").addClass("hidden");
  $(".btn-md-red-withicon").addClass("hidden");
  $(".btn-md-red-withicon-pd").addClass("hidden");
}

//送出登入表
$(".btn-local-lg").on("click", function (e) {
  e.preventDefault;
  //驗證方法之後補
  $(".login-light-box").toggleClass("hidden");
  SwitchToLoginUI();
});

//用localstorage確認當前狀態(目前只有登入狀態)
$(function () {
  let loginStatus = localStorage.getItem("isLoggedIn");
  if (loginStatus === "true") {
    $(".btn-before-lg").addClass("hidden");
    $(".btn-after-lg").removeClass("hidden");
    $(".btn-md-red-withicon").removeClass("hidden");
    $(".btn-md-red-withicon-pd").removeClass("hidden");
  }

  if (loginStatus === "false") {
    $(".btn-before-lg").removeClass("hidden");
    $(".btn-after-lg").addClass("hidden");
    $(".btn-md-red-withicon").addClass("hidden");
    $(".btn-md-red-withicon-pd").addClass("hidden");
  }
});

//點擊使用者頭像展開/收合選單
$(".field-user-info").on("click", function (e) {
  e.preventDefault();
  $(".info-menu-content").toggleClass("hidden");
  $(".menu-user-info").toggleClass("hidden");
});

// 按登出切換回登入
$("#logout").on("click", function (e) {
  e.preventDefault;
  confirm("是否確定登出？");
  SwitchToLogoutUI();
  location.href = "../HTML/Amilu_index.html";
});
