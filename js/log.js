
var logTimer;

function addToLog(string, selector) {
	var $container = $("<p/>").html(string);

	$container.addClass(selector).appendTo("#allInfo");

	$container.find('a').tooltip({html: true});

	clearTimeout(logTimer);
	logTimer = setTimeout( function() {
		$("#allInfo").parent().animate( {scrollTop: $("#allInfo").height() }, 50);
	}, 200);
}