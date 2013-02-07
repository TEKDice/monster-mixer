
var logTimer;

function addToLog(string, selector) {
	$("<p/>", {
		text: string
	}).addClass(selector).appendTo("#allInfo");

	clearTimeout(logTimer);
	logTimer = setTimeout( function() {
		$("#allInfo").parent().animate( {scrollTop: $("#allInfo").height() }, 50);
	}, 200);
}