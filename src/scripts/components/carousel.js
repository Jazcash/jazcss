// http://bxslider.com/options

if ($(".carousel__bxslider").length > 0){
	var script = document.createElement('script');
	// this only loads the bxslider library for pages where the carousel is used
	script.src = "https://cdnjs.cloudflare.com/ajax/libs/bxslider/4.2.12/jquery.bxslider.min.js";
	script.onload = function () {
		$(".carousel").each(function(i, el){
			let carousel = $(this).find(".carousel__bxslider").bxSlider({
				pager: false,
				controls: false
			});

			$(this).find(".carousel__control-left").on("click", function(){
				carousel.goToPrevSlide();
			});

			$(this).find(".carousel__control-right").on("click", function(){
				carousel.goToNextSlide();
			});
		});
	};

	document.head.appendChild(script);
}
