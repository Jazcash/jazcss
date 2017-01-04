function checkFadeSlide(){
	let thisScroll = $(window).scrollTop() + $(window).outerHeight();
	$("[class*=fadeslide]").each(function(e, el){
		let elPos = $(this).offset().top;
		if (thisScroll > elPos){
			$(this).addClass("fadeslide-active");
		}
	});
}

checkFadeSlide();

$(window).scroll(checkFadeSlide);
