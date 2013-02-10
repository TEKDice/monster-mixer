
var logTimer;

function addToLog(string, selector) {
	var $div = $("<div/>").appendTo("#allInfo");
	var $container = $("<p/>").addClass('pull-left').html(string).appendTo($div);
	$div.append("<div class='pull-right threat-status "+selector+"'></div><div class='clearfix'></div>");
	$container.addClass(selector);

	$container.find('a').tooltip({html: true});

	clearTimeout(logTimer);
	logTimer = setTimeout( function() {
		$("#allInfo").animate( {scrollTop: $("#allInfo")[0].scrollHeight }, 50);
	}, 100);

	$("#log .tab-pane > div").niceScroll();
	$("#log .tab-pane > div").css('overflow','hidden');

}