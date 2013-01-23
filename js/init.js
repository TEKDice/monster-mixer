$(function() {
		
	window.addEventListener('load', function() {
		setTimeout(function () {
			myScroll = new iScroll('monsterListCont', {
				hScroll: false,
				scrollbarClass: "cScrollbar"
			});
			resizeElements();
		}, 100);
	}, false);

	$(window).resize(timedResizeElements);
	$("#hasScript").show();
});
			
var myScroll;
var resizeTimer;
var height = 360;
var heightAdjust = 140;

//don't instantly automatically refresh everything, that's going to lag
function timedResizeElements() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(resizeElements, 100);
}

function resizeElements() {
	height = $(window).height();

	$("#log").css('height', height-50-heightAdjust+'px');
	$("#monsterListCont").css('height',height-heightAdjust+'px');
	$(".cScrollbarV").css('height',height-heightAdjust+'px');

	myScroll.refresh();
}