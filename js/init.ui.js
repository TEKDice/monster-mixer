

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
		var isAttack = $(this).hasClass('attacks');
		var $roller = $("<i/>").addClass('icon-share-alt');
		$roller.click(function() {
			var $rollable = $(this).parent().find('.info');
			if($rollable.length === 0) {
				bootbox.alert("Please select a feature to roll.");
				return;
			}

			var result = 0;
			var resultText = '';
			var iters=1;

			var exprFor = $rollable.attr('data-roll-for');
			var idFor = $(this).closest('div[data-for]').attr('id');
			var nameFor = $("a[href='#"+idFor+"']").text();

			if(isAttack) {
				var attackRoll = rollDice($rollable.attr('data-attack-roll'));
				for(var i in attackRoll) {
					if(attackRoll[i] == 0) continue;
					result += attackRoll[i];
					resultText += i + ": "+attackRoll[i]+"<br>";

					var critStatus='';
					var threatRange = parseInt($rollable.attr('data-min-crit'));

					if(attackRoll[i] <= 1) {
						critStatus='fail';

					} else if(attackRoll[i] >= 20) {
						critStatus='success';
						iters = parseInt($rollable.attr('data-crit-mult'));

					} else if(attackRoll[i] >= threatRange) {
						critStatus='threat';
						var threatRoll = rollDice($rollable.attr('data-attack-roll'));

						var threatData = _rollArray(threatRoll);

						var expr = $rollable.attr('data-roll');
						var roll = rollDice(expr);

						var threatBasicAttack = _rollArray(roll);
						iters = parseInt($rollable.attr('data-crit-mult'));
					}
				}
				if(critStatus == 'threat') {
					addToLog(logMessages.critAttempt(nameFor, exprFor, resultText, result), critStatus);
					addToLog(logMessages.critMiss(nameFor,exprFor,threatBasicAttack.text,threatBasicAttack.result), critStatus);
					addToLog(logMessages.critSecond(nameFor,exprFor,threatData.text,threatData.result), critStatus);
				} else {
					addToLog(logMessages.initiate(nameFor, exprFor, resultText, result), critStatus);
				}
				if(critStatus == 'fail') return;
			}

			var expr = $rollable.attr('data-roll');

			result = 0;
			resultText = '';

			for(var x=0; x<iters; x++) {
				var roll = rollDice(expr);
				result += _rollArray(roll).result;
				resultText += _rollArray(roll).text;
			}

			if(critStatus == 'threat') {
				addToLog(logMessages.critSuccess(nameFor,exprFor,resultText,result), critStatus);
			} else {
				addToLog(logMessages.hit(nameFor, exprFor, resultText, result));
			}
		});
		$(this).append($roller);
	});

}

var logMessages = {
	hit: function(ent, att, text, num) {
		return ent + " rolled \""+att+"\" for <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	initiate: function(ent, att, text, num) {
		return ent + " initiated \""+att+"\" with <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critAttempt: function(ent, att, text, num) {
		return ent + " attempted to crit using \""+att+"\" with <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critSecond: function(ent, att, text, num) {
		return ent + " attempted to finish crit using \""+att+"\" with <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critMiss: function(ent, att, text, num) {
		return ">> If "+ent+" fails critical hit, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critSuccess: function(ent, att, text, num) {
		return ">> If "+ent+" succeeds critical hit, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	}
};

function _rollArray(arr) {
	var ret = {result: 0, text: ''};
	for(var i in arr) {
		if(arr[i] == 0) continue;
		ret.result += arr[i];
		ret.text += i + ": "+arr[i]+"<br>";
	}
	return ret;
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

	$("#log .tab-pane > div").css('height', $("#log").height()-38);

	resizeGrids();
}