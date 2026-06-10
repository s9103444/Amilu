// 作品資料陣列物件
const works = [
  {
    artistId: "artist01",
    src: "../Picture/Art_work/image 19.png",
    name: "泡泡太空衣",
    user: "@test_name",
    tag: "3D-modeling",
    style: "Soft-focus",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist01",
    src: "../Picture/Art_work/image 18.png",
    name: "花帽少女",
    user: "@test_name",
    tag: "head-portrait",
    style: "realistic",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist01",
    src: "../Picture/Art_work/image 17.png",
    name: "鯨魚星球",
    user: "@test_name",
    tag: "concept-art",
    style: "abstract",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist01",
    src: "../Picture/Art_work/image 16.png",
    name: "翼之精靈",
    user: "@test_name",
    tag: "original-character",
    style: "realistic",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist02",
    src: "../Picture/Art_work/image 15.png",
    name: "藍龍與海",
    user: "@test_name",
    tag: "illustration",
    style: "Jp-style",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist02",
    src: "../Picture/Art_work/image 14.png",
    name: "蘋果與面容",
    user: "@test_name",
    tag: "illustration",
    style: "soft-focus",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist02",
    src: "../Picture/Art_work/image 13.png",
    name: "草莓泡泡",
    user: "@test_name",
    tag: "illustration",
    style: "soft-focus",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist02",
    src: "../Picture/Art_work/image 12.png",
    name: "金框美人",
    user: "@test_name",
    tag: "illustration",
    style: "thick coating",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist03",
    src: "../Picture/Art_work/image 11.png",
    name: "復古肖像",
    user: "@test_name",
    tag: "illustration",
    style: "US-style",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist04",
    src: "../Picture/Art_work/image 10.png",
    name: "粉紅少女",
    user: "@test_name",
    tag: "illustration",
    style: "Jp-style",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist04",
    src: "../Picture/Art_work/image 9.png",
    name: "月之魔法師",
    user: "@test_name",
    tag: "illustration",
    style: "Jp-style",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist03",
    src: "../Picture/Art_work/image 8.png",
    name: "向日葵側顏",
    user: "@test_name",
    tag: "head-portrait",
    style: "US-style",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist03",
    src: "../Picture/Art_work/image 7.png",
    name: "綠葉少女",
    user: "@test_name",
    tag: "illustration",
    style: "Chinese-style",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist03",
    src: "../Picture/Art_work/image 6.png",
    name: "花叢托腮",
    user: "@test_name",
    tag: "head-portrait",
    style: "abstract",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist01",
    src: "../Picture/Art_work/image 5.png",
    name: "花田少女",
    user: "@test_name",
    tag: "illustration",
    style: "US-style",
    description: "這是一段說明文字，最多可打30個字。",
  },
  {
    artistId: "artist02",
    src: "../Picture/Art_work/image 4.png",
    name: "櫻樹仕女",
    user: "@test_name",
    tag: "illustration",
    style: "Chinese-style",
    description: "這是一段說明文字，最多可打30個字。",
  },
];

// 作者陣列
const artists = [
  {
    id: "artist01",
    user: "@test_name01",
    name: "小帥",
    profilepic: "../Picture/01.png",
    status: "接案中",
    tiers: [
      { label: "頭像（肩膀以上）", price: 1500 },
      { label: "半身（腰部以上）", price: 2500 },
      { label: "全身", price: 3500 },
    ],
    terms: {
      numRev: "草稿階段 2 次、線稿階段 1 次，超出每次酌收 NT$200。",
      authorScope: "個人使用為主；商業用途請於委託時註明，費用另議。",
      estTimes: "約 14~21 個工作天，依當前排單狀況浮動。",
    },
  },
  {
    id: "artist02",
    user: "@test_name02",
    name: "小美",
    profilepic: "../Picture/02.png",
    status: "接案中",
    tiers: [
      { label: "頭像（肩膀以上）", price: 2500 },
      { label: "半身（腰部以上）", price: 3600 },
      { label: "全身", price: 4800 },
    ],
    terms: {
      numRev: "全程只得免費修改兩次，若超出則按修改比例另議追加費用。",
      authorScope: "個人使用為主；商業用途請於委託時註明，費用另議。",
      estTimes: "約 7~14 個工作天（假日不納入），依當前排單狀況浮動。",
    },
  },
  {
    id: "artist03",
    user: "@test_name03",
    name: "小胖",
    profilepic: "../Picture/03.png",
    status: "接案中",
    tiers: [
      { label: "純背景", price: 4000 },
      { label: "背景+概念設定", price: 7000 },
    ],
    terms: {
      numRev: "全程只得免費修改兩次，若超出則按修改比例另議追加費用。",
      authorScope: "個人使用為主；商業用途請於委託時註明，費用另議。",
      estTimes: "約 7~14 個工作天（假日不納入），依當前排單狀況浮動。",
    },
  },
  {
    id: "artist04",
    user: "@test_name04",
    name: "小瘦",
    profilepic: "../Picture/04.jpg",
    status: "接案中",
    tiers: [
      { label: "角色設計/單人", price: 6000 },
      { label: "角色設計/單人+拆件", price: 12000 },
      { label: "整套（角色設計+拆件+live2d綁骨架", price: 25000 },
    ],
    terms: {
      numRev: "全程只得免費修改兩次，若超出則按修改比例另議追加費用。",
      authorScope: "個人使用為主；商業用途請於委託時註明，費用另議。",
      estTimes: "約 30 個工作天（假日不納入），依當前排單狀況浮動。",
    },
  },
];
// 瀑布流抓取器
const gallery = document.getElementById("gallery");

// 首頁展示燈箱元素抓取器
const lightbox = document.getElementById("lightbox");

//作品展示燈箱--------------

//點卡片時，抓取創作者id回傳值（輸入展示燈箱用）
function checkArtistIdReturn(artistId) {
  for (let i = 0; i < artists.length; i++) {
    if (artistId === artists[i].id) {
      return artists[i]; //這邊是送整個作者的資料集合物件回傳。
    }
  }
  return null;
}

//作品展示燈：委託項目條生成
function tierBuild(tiers) {
  let tier01 = document.createElement("div");
  tier01.className = "tier";
  tier01.innerHTML = `<span>${tiers.label}</span>
  <span>NT$${tiers.price}+</span>`;
  return tier01;
}

function openLightBox(index) {
  let work = works[index]; //帶作品資料
  let artist = checkArtistIdReturn(work.artistId); //帶作者相關資料（指定的人）
  let tierContent = document.createElement("div");
  for (let index = 0; index < artist.tiers.length; index++) {
    let tier01 = tierBuild(artist.tiers[index]);
    tierContent.appendChild(tier01);
  }

  let lightBoxDisplay = document.createElement("div");
  lightBoxDisplay.className = "light-box-display";
  lightBoxDisplay.innerHTML = `
        <div class="col"><img id="lbImage" src="${work.src}"  alt="${work.name}" /></div>
        <div class="col">
          <!--主標及作者資訊區-->
          <div><img id="lbClose"
                src="../Picture/icon/Type=Cancel, Color=Black, Direction=Default, Status=open.svg"註冊會員"
            /></div>
            <h3>${work.name}</h3>
            <p class="description">${work.description}</p>
            <span class="status">${artist.status}</span>
            <div class="info-bar">
              <div class="profilepic"><img src="${artist.profilepic}"></div>
              <h6>${artist.name}</h6>
              <span>${artist.user}</span>
              <button class="Follow">Follow</button>
            </div>
            <!-- 委託項目區 -->
            <div id="lightboxProject">
              <div class="project-info-bar">
                <h4 class="info-title">開放委託項目</h4>
                <button>非商用價格<img src="../Picture/icon/Type=QA, Color=Black, Direction=Default, Status=open.svg"></button>
              </div>
              <div class="lbComProject">
                <div class="lb-com-content">${tierContent.innerHTML}</div>
              </div>
            </div>
            <!-- 接案規範區 -->
            <div id="lightboxSpecification">
              <h4 class="info-title">接案規範</h4>
              <h5 class="info-sub-title">修改次數</h5>
              <p id="numRev">${artist.terms.numRev}</p>
              <h5 class="info-sub-title">授權範圍</h5>
              <p id="authorScope">${artist.terms.authorScope}</p>
              <h5 class="info-sub-title">預估工作日</h5>
              <p id="estTimes">${artist.terms.estTimes}</p>
            </div>
              <div class="com-submit"><a href="../HTML/Amilu_Application_page.html" class="comSubmit">我要委託</a></div>
    
  `;
  lightBoxDisplay.style.display = "flex";
  lightbox.innerHTML = "";
  lightbox.appendChild(lightBoxDisplay);
  lightbox.style.display = "flex";
}
//點擊gallery任何一張選定卡變去觸發生成該品對應的展示燈箱
gallery.addEventListener("click", function (e) {
  let card = e.target.closest(".card");
  if (card === null) {
    return;
  }
  let index = Number(card.dataset.index); //Number():把字串轉成數字，這邊轉的是變成片時給每張標記的引所號（字串："1","2"）
  openLightBox(index);
});

lightbox.addEventListener("click", (e) => {
  if (e.target.id === "lbClose" || e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

//瀑布流：把物件變成卡片
function createCard(works, index) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.tag = works.tag;
  card.dataset.style = works.style;
  card.dataset.index = index; //產出的卡片的引所編號
  card.innerHTML = `
  <div>
    <img src="${works.src}" alt="${works.name}">
    <div class="info">
    <h3 class="name">${works.name}</h3>
    <p class="user">${works.user}</p>
    </div>
  </div>`;
  return card;
}
//把卡片一組裝進gallery
function toGallery() {
  for (let index = 0; index < works.length; index++) {
    let work = works[index];
    let card = createCard(work, index);
    gallery.appendChild(card);
  }
  return gallery;
}
toGallery();

// 瀑布流
const checkPoint = document.getElementById("checkPoint");

const observer = new IntersectionObserver(batchPic);
if (checkPoint) {
  observer.observe(checkPoint);
}

function batchPic(e) {
  if (e[0].isIntersecting) {
    toGallery();
  }
}

//篩選器

//首頁主選單按鈕

// let tabs = document.querySelectorAll(".tab");
// let menuContent = document.querySelectorAll(".menu-content");

// // 移除active
// function changContnet(tabs, menuContent) {
//   tabs.forEach((tab) => {
//     tab.classList.remove("active");
//   });
//   menuContent.forEach((mc) => {
//     mc.classList.remove("active");
//   });
//   targetTab.classList.add("active");
//   menuContent.forEach((mc)=>{
//     if(mc.dataset.content===targetTab){
//       mc.classList.add("active");
//     }
//   }
// });

// for (i = 0; i < tabs.length; i++) {
//   tab[i].addEventListener("click", ()=>changeContnet(tabs, menuContent));
// }
