const subSwiper = new Swiper(".sub-section", {
  slidesPerView: "auto",
  spaceBetween: 0,
  slidesOffsetBefore: 26,
  slidesOffsetAfter: 50,
  simulateTouch: true,
  grabCursor: true,
  freeMode: {
    enabled: true,
    momentum: false,
  },
});

const mainSwiper = new Swiper(".main-tabs", {
  slidesPerView: "auto",
  spaceBetween: 0,
  slidesOffsetBefore: 10,
  slidesOffsetAfter: 50,
  freeMode: {
    enabled: true,
    momentum: false,
  },
});
