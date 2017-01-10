$(".tabarea__tab").on("click", function(){
	var $index = $(".tabarea__tab").index($(this));
	var marginLeft = -(100 * $index) + "%";
	$(".tabarea__content:first-child").animate({marginLeft: marginLeft}, 300);
	$(".tabarea__tab").removeClass("active");
	$(".tabarea__tab").eq($index).addClass("active");
});
