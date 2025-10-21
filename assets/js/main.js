$(".header__hamburger").on("click", function () {
  $(this).toggleClass("active");
  $(".header__menu").toggleClass("active");
});
// steps
$(".steps_header").on("click", function () {
  const parent = $(this).closest(".steps_item");
  if (parent.hasClass("active")) {
    parent.removeClass("active");
  } else {
    $(".steps_item").removeClass("active");
    parent.addClass("active");
  }
});
