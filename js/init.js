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

	$("#showFilters").click(function() {
		$("#popup").slideToggle(400, function() {
			if($(this).is(":visible")) {
				$("#filterIcon").attr('class', 'icon-arrow-up');	
			} else {
				$("#filterIcon").attr('class', 'icon-arrow-down');
			}
		});
	});

	$("#extraToggle").click(function() {
		if($("#extra").is(":visible")) {
			$("#popup").animate({width: defaultPopupSize});
			$("#simple").animate({width: defaultPopupSize});
			$("#extra").animate({width: 0}, function() {
				$("#extra").css('display', 'none');
			});
		} else {
			$("#popup").animate({width: extendPopupSize}, function() {
				$("#simple").animate({width: defaultPopupSize});
				$("#extra").css('display', 'block');
				$("#extra").animate({width: extendPopupSize-defaultPopupSize-10});
			});
		}
	});

	$("#hasScript").show();
});

var defaultPopupSize=300;
var extendPopupSize	=1000;
			
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