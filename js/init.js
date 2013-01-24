$(function() {

	initializeScrollbars();

	initializeArrowToggler();

	initializePopupToggler();

	initializeFilterSelect();

	$("#filters").find('option[value="Challenge Rating"]').attr('selected','selected');

	$("#hasScript").show();

});

var defaultPopupSize=500;
var extendPopupSize	=1200;
			
var myScroll;
var resizeTimer;
var height = 360;
var heightAdjust = 140;

function initializeFilterSelect() {
	for(var o in filterData) {
		$("#filters").append("<option value='"+o+"'>"+o+"</option>");
	}

	$("#filters").change(function() {

		$(".joinOpt, .numericOpt, .nameOpt").hide();

		//is joinable
		if(filterData[$(this).val()] instanceof Array) {
			$(".joinOpt").fadeIn();

		//is numeric
		} else if(filterData[$(this).val()]){
			$(".numericOpt").fadeIn();

		//is name
		} else {
			$(".nameOpt").fadeIn();

		}
	});
}

function initializePopupToggler() {
	//toggle the sizes between the two popup possibilities
	$("#medianArrowContainer").click(function() {
		if($("#extra").is(":visible")) {
			$("#popup").animate({width: defaultPopupSize});
			$("#popupLeft").animate({width: defaultPopupSize});
			$("#extra").animate({width: 0}, function() {
				$("#extra").css('display', 'none');
				$("#extraToggle").attr('class', 'icon-arrow-right');	
				$("#medianArrowContainer").attr('title', 'More options');	
			});
		} else {
			$("#popup").animate({width: extendPopupSize}, function() {
				$("#popupLeft").animate({width: defaultPopupSize});
				$("#extra").css('display', 'block');
				$("#extra").animate({width: extendPopupSize-defaultPopupSize-10});
				$("#extraToggle").attr('class', 'icon-arrow-left');	
				$("#medianArrowContainer").attr('title', 'Less options');	
			});
		}
	});
}

function initializeArrowToggler() {
	//change the arrow from up to down
	$("#showFilters").click(function() {
		$("#popup").slideToggle(400, function() {
			if($(this).is(":visible")) {
				$("#filterIcon").attr('class', 'icon-arrow-up');	
			} else {
				$("#filterIcon").attr('class', 'icon-arrow-down');
			}
		});
	});
}

function initializeScrollbars() {
	//scrollbar for the monster list
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
}

//don't instantly automatically refresh everything, that's going to lag
function timedResizeElements() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(resizeElements, 100);
}

function resizeElements() {
	height = $(window).height();

	$("#log").css('height', height-50-heightAdjust+'px');
	$("#monsterListCont").css('height',height-50-heightAdjust+'px');
	$(".cScrollbarV").css('height',height-heightAdjust+'px');

	myScroll.refresh();
}