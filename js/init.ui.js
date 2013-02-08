

var defaultPopupSize=500;
var extendPopupSize	=1200;
			
var height = 360;
var heightAdjust = 140;

var resizeTimer;

function setupRoller() {
	$("#roll").keyup(function(e) {
		if(e.keyCode == 27) {
			$("#roll").val('');
		}
		if(e.which != 13) return;
		e.preventDefault();
		var toRoll = $(this).val();
		var roll = rollDice(toRoll);
		if(roll === 0) return;
		addToLog("Custom roll: "+toRoll+" rolled "+roll+".", "customRoll");
	});

	$("#dice button").click(function() {
		var val = $("#roll").val() == '' ? "1"+$(this).text() : "+1"+$(this).text();
		$("#roll").val($("#roll").val() + val);
	});
}

function setupRollables($parent) {
	$parent.find(".rollable").each(function() {
		var $roller = $("<i/>").addClass('icon-share-alt');
		$roller.click(function() {
			var $rollable = $(this).parent().find('.info');
			if($rollable.length === 0) {
				bootbox.alert("Please select an attribute to roll.");
				return;
			}
			var expr = $rollable.attr('data-roll');
			var exprFor = $rollable.attr('data-roll-for');
			var roll = rollDice(expr);

			var idFor = $(this).closest('div[data-for]').attr('id');
			var nameFor = $("a[href='#"+idFor+"']").text();

			var result = 0;
			var resultText = '';

			for(var i in roll) {
				result += roll[i];
				resultText += i + ": "+roll[i]+"<br>";
			}

			addToLog(nameFor + " rolled \""+exprFor+"\" for <a rel='tooltip' href='#' title='"+resultText+"'>"+result+"</a>.");
		});
		$(this).append($roller);
	});

}

function setupGrids() {
	$(".sortable").sortable({
		sort: function(e, u) {
			setupGrids();
		}
	});
	$(".sortable").disableSelection();

	$(".minibox-content").niceScroll();

	resizeGrids();
}

function resizeGrids() {
	$(".minibox-content").each(function() {
		$(this).height($(this).parent().height()-22);
	});
}

function setupGenButton() {
	$("#genButton").click(function() {

		//build filters
		var filterObj = {};
		$(".inner-filter-container").each(function() {
			var attr = $(this).attr('data-attr');
			filterObj[attr] = [];
			$(this).children(".badge").each(function() {
				filterObj[attr].push({sign: $(this).attr('data-sign'), value: $(this).attr('data-value')});
			});
		});

		//POST filters
		$.post('ajax.php', {action: "gen", data: JSON.stringify(filterObj)}, function(monster) {
			if(monster==='') {
				bootbox.alert("No results were found with your filters. Try broadening your search.");
				return;
			}
			monster = $.parseJSON(monster);
			addNewMonster(monster);
			setupGrids();
		});
	});
}

function rollableRowHighlighting($parent) {
	$parent.find("tr[data-roll]:not(.unrollable)").each(function() {
		$(this).click(function() {
			$(this).siblings(".info").removeClass('info');
			if($(this).hasClass('info'))
				$(this).removeClass('info');
			else
				$(this).addClass('info');
		});
	});
}

function tabChangeScrollbars() {
	$('a[data-toggle="tab"]').on('shown', function (e) {
		$(".minibox-content").niceScroll();
		$(".minibox-content").css('overflow','hidden');

		//hide the popup if it's visible
		if($("#popup").is(":visible")) {
			_togglePopup();
		}
	});
}

function setupAddButton() {
	$("#newFilter").click(addNewFilter);
}

function makeSpansRemovable() {
	$(".filter-remover").click(function() {
		$(this).parent().fadeOut(function() {
			var siblingsLeft = $(this).siblings().size();
			if(siblingsLeft == 0) {
				$(this).closest("tr").remove();
			}
			$(this).remove();
		});
	});
}

function initializePopupToggler() {
	//toggle the sizes between the two popup possibilities
	$("#medianArrowContainer").click(_togglePopupInsides);
}

function _togglePopupInsides() {
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
			$("#extra").animate({width: extendPopupSize-defaultPopupSize});
			$("#extraToggle").attr('class', 'icon-arrow-left');	
			$("#medianArrowContainer").attr('title', 'Less options');	
		});
	}
}

function initializeArrowToggler() {
	//change the arrow from up to down
	$("#showFilters").click(_togglePopup);
}

function _togglePopup() {
	$("#popup").slideToggle(400, function() {
		if($(this).is(":visible")) {
			$("#filterIcon").attr('class', 'icon-arrow-up');	
			$("#popup").attr('display','inline-block');
			$("#filterContainer").niceScroll({zindex: 14});
			$("#filterContainer").css('overflow','hidden');
		} else {
			$("#filterIcon").attr('class', 'icon-arrow-down');
		}
	});
}

function timedResizeElements() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(resizeElements, 100);
}

function handleResizing() {
	$(window).resize(timedResizeElements);
	resizeElements();
}

function resizeElements() {
	height = $(window).height();

	$("#log").css('height', height-80-heightAdjust+'px');
	$("#monsterListCont").css('height',height-50-heightAdjust+'px');
	$("#monsterList").css('height',height-50-heightAdjust+'px');

	$(".tab-content").css('height', $("#log").height()-38);

	resizeGrids();
}