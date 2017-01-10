$(".accordion__title").on("click", function(){
	$(this).parents(".accordion__item").toggleClass("open");
	$(this).next(".accordion__content").slideToggle(200);
});
