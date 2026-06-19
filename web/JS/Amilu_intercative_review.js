$(".review-tabs").on("click", ".review-tab", function () {
  // 橘條分頁切換
  $(".review-tabs").find(".review-tab").removeClass("review-tab-active");
  $(this).addClass("review-tab-active");
  //頁籤頁跟著切換
  let selectedTab = $(this).data("tab");
  $(".review-tab-panel").removeClass("review-tab-panel-active");
  $("#panel-" + selectedTab).addClass("review-tab-panel-active");
});
