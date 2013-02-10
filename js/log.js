
var logTimer;

function addToLog(string, selector) {
	var $div = $("<div/>").appendTo("#allInfo");
	var $container = $("<p/>").html(string).appendTo($div);

	$container.addClass(selector);

	$container.find('a').tooltip({html: true});

	clearTimeout(logTimer);
	logTimer = setTimeout( function() {
		$("#allInfo").animate( {scrollTop: $("#allInfo").height() }, 50);
	}, 100);

	$("#log .tab-pane > div").niceScroll();
	$("#log .tab-pane > div").css('overflow','hidden');

}