$(document).on("opening", ".remodal", function () {
	disableScroll();
});

$(document).on("closing", ".remodal", function () {
	enableScroll();
});

