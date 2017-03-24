// https://www.tjvantoll.com/2012/06/30/creating-a-native-html5-datepicker-with-a-fallback-to-jquery-ui/

if (!Modernizr.inputtypes.date) {
	$('input[type=date]').each(function(i, el) {
		$(el).attr("type", "text");
		new Pikaday({
			field: el,
			format: 'YYYY-MM-DD',
		});
	});
}
