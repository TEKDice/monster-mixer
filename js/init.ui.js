

var defaultPopupSize=500;
var extendPopupSize	=1200;
			
var height = 360;
var heightAdjust = 140;

var resizeTimer;

function limitFeatNums(uid) {
	$("#"+uid+"_mfeat_table .applyNum").each(function() {
		$(this).change(function() {
			var val = parseInt($(this).val());
			var max = clamp(0, 5, parseInt($("#"+uid+"_bab").attr('data-base-value')));
			if(val < 0) val = 0;
			if(val > max) val = max;
			$(this).val(val);
		});
		$(this).closest("td").attr('id', uid+'_calc_'+($(this).closest("td").prev().text() == 'Power Attack' ? "pa" : "ce"));
	});

	$("#"+uid+"_mfeat_table .inline-checkbox").each(function() {
		$(this).attr('id', uid+'_calc_'+($(this).closest("td").prev().text() == 'Awesome Blow' ? "ab" : "pbs"));
	});
}

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
	var uid = $parent.find("[data-uid]").attr('data-uid');
	$parent.find(".rollable").each(function() {

		var $roller = $("<i/>").addClass('icon-share-alt');
		$roller.click(function() {
			var $rollable = $(this).parent().find('.info');
			if($rollable.length === 0) {
				bootbox.alert("Please select a feature to roll.");
				return;
			}
			
			var isAttack = $rollable.attr('data-attack-roll');

			var result = 0;
			var resultText = '';
			var iters=1;
			var critStatus='';

			var spatkFor = $rollable.attr('data-spatk');
			var exprFor = $rollable.attr('data-roll-for');
			var idFor = $(this).closest('div[data-for]').attr('id');
			var nameFor = $("a[href='#"+idFor+"']").html();

			var powerAttackBonus;
			if(hasFeat(uid, 'Power Attack')) {
				powerAttackBonus = parseInt($("#"+uid+"_calc_pa").children("input").val());
			}

			if(typeof isAttack !== 'undefined' && isAttack !== false) {
				var attackRoll = rollDice($rollable.attr('data-attack-roll'));

				if(powerAttackBonus!=0 && !isNaN(powerAttackBonus))
					attackRoll["Power Attack"] = -powerAttackBonus;

				if(hasFeat(uid, 'Combat Expertise')) {
					var bonus = parseInt($("#"+uid+"_calc_ce").children("input").val());
					if(bonus!=0 && !isNaN(bonus))
						attackRoll["Combat Expertise"] = -bonus;
				}

				if(hasFeat(uid, 'Awesome Blow') && $("#"+uid+"_calc_ab").is(":checked")) 
					attackRoll["Awesome Blow"] = -4;

				if(hasFeat(uid, 'Point Blank Shot') && $("#"+uid+"_calc_pbs").is(":checked")) 
					attackRoll["Point Blank Shot"] = 1;

				for(var i in attackRoll) {
					if(attackRoll[i] == 0) continue;
					result += attackRoll[i];
					resultText += i + ": "+attackRoll[i]+"<br>";

					var threatRange = parseInt($rollable.attr('data-min-crit'));

					if(attackRoll[i] <= 1 && i.indexOf('1d20') != -1 && (i.indexOf('Base') != -1)) {
						critStatus='fail';
						
					} else if(attackRoll[i] >= threatRange && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1) {
						critStatus='threat';
						if(attackRoll[i] >= 20) critStatus = 'success';
						var threatRoll = rollDice($rollable.attr('data-attack-roll'));

						var threatData = _rollArray(threatRoll);

						var expr = $rollable.attr('data-roll');
						var roll = rollDice(expr);
						if(powerAttackBonus)
							roll["Power Attack"] = powerAttackBonus;

						var threatBasicAttack = _rollArray(roll);
						iters = parseInt($rollable.attr('data-crit-mult'));
					}
				}
				if(critStatus == 'threat' || critStatus == 'success') {
					addToLog(logMessages.critAttempt(nameFor, exprFor, resultText, result), critStatus, idFor);
					addToLog(logMessages.critMiss(nameFor,exprFor,threatBasicAttack.text,threatBasicAttack.result)+(spatkFor!=null ? " (apply "+spatkFor+")" : ''), critStatus, idFor);
					addToLog(logMessages.critSecond(nameFor,exprFor,threatData.text,threatData.result), critStatus, idFor);
				} else {
					addToLog(logMessages.initiate(nameFor, exprFor, resultText, result), critStatus, idFor);
				}
			}

			var expr = $rollable.attr('data-roll');

			result = 0;
			resultText = '';

			for(var x=0; x<iters; x++) {
				var roll = rollDice(expr);
				if(powerAttackBonus)
					roll["Power Attack"] = powerAttackBonus;

				if(hasFeat(uid, 'Point Blank Shot') && $("#"+uid+"_calc_pbs").is(":checked")) 
					roll["Point Blank Shot"] = 1;

				for(var i in roll) {
					if(roll[i] == 0) continue;
					result += roll[i];
					resultText += i + ": "+roll[i]+"<br>";

					if(roll[i] <= 1 && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1) {
						critStatus='fail';

					} else if(roll[i] >= 20 && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1) {
						critStatus='success';
					}
				}
			}

			if((critStatus == 'threat' || critStatus == 'success') && isAttack) {
				addToLog(logMessages.critSuccess(nameFor,exprFor,resultText,result)+(spatkFor!=null ? " (apply "+spatkFor+")" : ''), critStatus, idFor);
			} else {
				addToLog(logMessages.hit(nameFor, exprFor, resultText, result)+(spatkFor!=null ? " (apply "+spatkFor+")" : ''), critStatus, idFor);
			}
		});
		$(this).append($roller);
	});

}

function _rollArray(arr) {
	var ret = {result: 0, text: ''};
	for(var i in arr) {
		if(arr[i] == 0) continue;
		ret.result += arr[i];
		ret.text += i + ": "+arr[i]+"<br>";
	}
	return ret;
}

function setupGrids(uid) {
	$(".sortable").sortable({
		sort: function(e, u) {
			setupGrids(uid);
		}
	});
	$(".sortable").disableSelection();

	$(".draggable").not(".invisible").find(".minibox-content").each(function() {
		var nice = $(this).niceScroll({horizrailenabled: false, zindex: 9});
		$("#"+nice.id).attr('data-nice-uid', uid);
	});
	resizeGrids();
}

function resizeGrids() {
	$(".minibox-content").each(function() {
		$(this).height($(this).parent().height()-22);
	});
}

function setupGenButton() {
	$("#genButton").click(function() {

		$(this).button('loading');

		var $button = $(this);

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
			$button.button('reset');	
			if(monster==='') {
				bootbox.alert("No results were found with your filters. Try broadening your search.");
				return;
			}
			monster = $.parseJSON(monster);
			var uid = addNewMonster(monster);
			setupGrids(uid);
		});
	});
}

function rollableRowHighlighting($parent) {
}

function tabChangeScrollbars() {
	$('a[data-toggle="tab"]').on('shown', function (e) {
		$(this).find(".minibox-content").each(function() {
			var nice = $(this).niceScroll({horizrailenabled: false, zindex:9});
			$("#"+nice.id).attr('data-nice-uid', $(this).closest('tab-pane').attr('data-for'));
		});
		$(this).find(".minibox-content").css('overflow','hidden');

		var uid = $(this).attr('data-uid');

		$("#curMon > div[data-for='"+uid+"']").show().siblings().hide();

		//hide the popup if it's visible
		if($("#popup").is(":visible")) {
			_togglePopup(true);
		}
	});
}

function setupAddButton() {
	$("#newFilter").click(addNewFilter);
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

function _togglePopup(ext) {
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

	$("#monstersContainer > .row-fluid").first().css('height', $("#monsterListCont").height());

	resizeGrids();
}