// 進度條變長;
$(document).ready(function () {
  $(".progress-fill").each(function () {
    let length = $(this).data("progress");
    $(this).css("width", length + "%");

    if ($(this).data("status") === "待確認") {
      $(this).css("background-color", "var(--color-red)");
    } else if ($(this).data("status") === "進行中") {
      $(this).css("background-color", "var(--color-green)");
    } else if ($(this).data("status") === "已完成") {
      $(this).css("background-color", "var(--color-Secondary)");
    }
  });

  // page tabs的切換
  $(".tab").on("click", function () {
    $(".tab").removeClass("active");
    $(this).addClass("active");
  });

  // filter-bar的切換
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
  });
});
