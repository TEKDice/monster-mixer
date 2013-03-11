

var defaultPopupSize=500;
var extendPopupSize	=1200;
			
var height = 360;
var heightAdjust = 140;

var resizeTimer;

function limitFeatNums(uid) {
	$("#"+uid+"_mfeat_table .applyNum").each(function() {
		var cbName = $(this).closest("td").prev().text();
		var isPowerAttack = cbName == 'Power Attack';
		$(this).change(function() {
			var val = parseInt($(this).val());
			var paMax = parseInt($("#"+uid+"_bab").text());
			var max = clamp(0, (isPowerAttack ? paMax : 5), parseInt($("#"+uid+"_bab").attr('data-base-value')));
			val = clamp(0, max, val);

			$(this).val(val);

			if(val > -1 && cbName == 'Combat Expertise') {
				incdecACStat(uid, "ac", "Combat Expertise", null, val);
				incdecACStat(uid, "touch_ac", "Combat Expertise", null, val);
			}
		});
		$(this).closest("td").attr('id', uid+'_calc_'+(isPowerAttack ? "pa" : "ce"));
	});

	$("#"+uid+"_mfeat_table .inline-checkbox").each(function() {
		var cbName = checkboxName($(this).closest("td").prev().text());
		$(this).attr('id', uid+'_calc_'+(cbName));

		if(cbName == 'dodge') {
			var $this = $(this);
			$(this).click(function() {

				if($this.is(':checked')) {
					incdecACStat(uid, "ac", "Dodge", true);
					incdecACStat(uid, "touch_ac", "Dodge", true);
				} else {
					incdecACStat(uid, "ac", "Dodge", false);
					incdecACStat(uid, "touch_ac", "Dodge", false);
				}
			});
		}
	});
}

function incdecACStat(uid, acType, adder, isIncrement, value, canBeNegative) {
	var $ac = $("#"+uid+"_"+acType);
	var ac = $.parseJSON($ac.attr('data-ac'));

	if(ac[adder] == undefined) ac[adder] = 0;
	else ac[adder] = parseInt(ac[adder]);

	if(value) ac[adder] = value;
	else 	  ac[adder] = isIncrement ? ac[adder]+1 : ac[adder]-1;

	if(!canBeNegative && ac[adder] < 0) ac[adder] = 0;

	$ac.attr('data-ac',JSON.stringify(ac));
	refreshAc($ac);

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
			
			attack($rollable, $(this), uid);
		});
		$(this).append($roller);
	});

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
	$("#seeMoreButton").button('loading');
	$("#finalAddButton").button('loading');

	$("#finalAddButton").click(function() {
		_addAllSuggestedMonsters($(this));
	});

	$("#seeMoreButton").click(function() {
		_seeMoreButtonFunctionality($(this))
	});
	$("#genButton").click(function() {
		_genButtonFunctionality($(this))
	});
}

function _addAllSuggestedMonsters($button) {
	$button.button('generating');
	setTimeout(function() {$button.attr('disabled', 'disabled').addClass('disabled')}, 10);

	$("#overlay").fadeIn();
	$("#advGenFinalContainer tr").each(function() {
		var monster = $(this).data('monster');
		var count = parseInt($(this).children(":nth-child(2)").text());
		_hidePopup();

		setTimeout(function() {
			for(var i=0; i<count; i++) {
				setTimeout(function() {addNewMonster(monster);}, 100);
			}
		}, 500);
	});
	$("#overlay").fadeOut();

	setTimeout(function() {$button.removeAttr('disabled').removeClass('disabled')}, 10);
	$button.button('reset');
}

function _seeMoreButtonFunctionality($button) {

	$button.button('generating');
	setTimeout(function() {$button.attr('disabled', 'disabled').addClass('disabled')}, 10);

	var ct = 0;

	var advObj = {orgs: [], singles: []};
	var singlesCt = [];

	$("#advGenMonsters input[type='checkbox']").each(function() {
		if($(this).is(":checked")) {
			var $tr = $(this).closest("tr");
			var baseCt = $tr.find(".only-positive").val() || null;
			var orgGen = $tr.find("select").val();
			
			if((baseCt!=null && baseCt!='0') || orgGen!="null")
				ct++;

			if(baseCt != null && baseCt!='0') {
				singlesCt[$tr.attr('data-monster-name')] = baseCt;
				advObj.singles.push($tr.attr('data-monster-id'));
			}
			if(orgGen!="null") {
				advObj.orgs.push(orgGen);
			}
		}
	});

	if(ct == 0) {
		setTimeout(function() {$button.removeAttr('disabled').removeClass('disabled')}, 10);
		$button.button('reset');
		bootbox.alert("Please select some monsters to create.");
		return;
	}

	$.post('ajax.php', {action: "gen", orgs: JSON.stringify(advObj)}, function(monsters) {
		_parseSuggestedMonsters($.parseJSON(monsters), singlesCt);
		$("#finalAddButton").button('reset');

	}).always(function() {
		setTimeout(function() {$button.removeAttr('disabled').removeClass('disabled')}, 10);
		$button.button('reset');
	});
}

function _parseSuggestedMonsters(monsters, singlesCt) {

	var $container = $("#advGenFinalContainer");
	var $monsters = $("#advGenFinal");
	$container.children().not("#advGenFinal").remove();
	$monsters.empty();

	if(Object.keys(singlesCt).length) {
		$monsters.show();
		$monsters.append("<caption>Monsters</caption>");
	} else
		$monsters.hide();

	$.each(monsters, function(i, e) {
		if(e.hasOwnProperty("name")) {
			var $table = $("<table/>").addClass('table table-condensed table-striped').css('position','relative').appendTo($container);
			$table.append("<caption>"+e.name+"</caption>");
			$.each(e.monsters, function(i, e){
				var $tr = $("<tr/>").appendTo($table);
				$tr.attr('data-gen-min', e.minimum).attr('data-gen-max', e.maximum);
				$tr.append("<td>"+e.monster.data[0].name+"</td><td class='rightalign'></td>");
				$tr.data('monster', e.monster);
			});

			var $roller = $("<i/>").addClass('icon-share-alt').appendTo($table);
			$roller.click(function() {
				_rerollTable($table);
			});
			_rerollTable($table);

		} else {
			var $tr = $("<tr/>");
			var monName = e.data[0].name;
			var monCt = singlesCt[monName];
			$tr.append("<td>"+monName+"</td><td class='rightalign'>"+monCt+"</td>").appendTo($monsters);
			$tr.attr('data-gen-min', monCt).attr('data-gen-max', monCt);
			$tr.data('monster',e);
		}
	});
	$("#advGenFinalContainer").niceScroll({zindex: 14, horizrailenabled: false});
	$('#advGenFinalContainer').css('overflow','hidden');
}

function _rerollTable($table) {
	$table.find("tr").each(function() {
		var max = parseInt($(this).attr('data-gen-max'));
		var min = parseInt($(this).attr('data-gen-min'));
		var num = Math.floor(Math.random() * (max-min+1)) + min;
		$(this).children(":nth-child(2)").text(num);
	});
}

function _genButtonFunctionality($button) {

	$button.button('loading');

	//build filters
	var filterObj = {};
	$(".inner-filter-container").each(function() {
		var attr = $(this).attr('data-attr');
		filterObj[attr] = [];
		_gaq.push(['_trackEvent', 'Filter', attr]);
		$(this).children(".badge").each(function() {
			filterObj[attr].push({sign: $(this).attr('data-sign'), value: $(this).attr('data-value')});
		});
	});

	var advMode = $("#extra").is(":visible");

	//POST filters
	$.post('ajax.php', {action: "gen", data: JSON.stringify(filterObj), adv: advMode}, function(monster) {
		$button.button('reset');	
		if(monster==='') {
			bootbox.alert("No results were found with your filters. Try broadening your search.");
			return;
		}
		if(!advMode) {
			monster = $.parseJSON(monster);
			var uid = addNewMonster(monster);
			setupGrids(uid);
			return;
		}
		$("#advGenMonsters").empty();
		$.each($.parseJSON(monster), function(i, e) {
			addNewSuggestedRow(i, e);
		});
		$(".only-positive").change(function() {
			var val = parseInt($(this).val());
			if(val < 0) val = 0;
			$(this).val(val);
		});
		$("tr[data-monster-name] select, tr[data-monster-name] .only-positive").change(function() {
			$(this).closest("tr").find("input[type='checkbox']").prop('checked',true);
		});
		$("#seeMoreButton").button('reset');
	});
}

function addNewSuggestedRow(monster, data) {
	var template = $("#advGenTemplate").html();
	$("#advGenMonsters").append("<tr data-monster-name='"+monster+"' data-monster-id='"+data.id+"'><td>"+template+"</td></tr>");
	_makeSelect(monster, data.orgs);
	$("[data-monster-name='"+monster+"'] .monsterName").attr('title',monster).text(monster).tooltip({delay: 500});
	$("#advGenContainer").niceScroll({zindex: 14, horizrailenabled: false});
	$('#advGenContainer').css('overflow','hidden');
}

function _makeSelect(monster, data) {
	var $select = $("[data-monster-name='"+monster+"'] select");
	$.each(data, function(i, e) {
		if(e.organization.indexOf(monster) != -1) e.organization = e.organization.substring(monster.length+1);
		$select.append("<option value='"+e.id+"'>"+e.organization+"</option>");
	});
	$select.append("<option value='null' selected>No Org.</option>");
}

function rollableRowHighlighting($parent) {
}

function tabChangeScrollbars() {
	$('a[data-toggle="tab"]').on('shown', function (e) {
		$("#"+$(this).attr('data-uid')).find(".minibox-content").each(function() {
			var nice = $(this).niceScroll({horizrailenabled: false, zindex:9});
			$("#"+nice.id).attr('data-nice-uid', $(this).closest('tab-pane').attr('data-for'));
			$(this).css('overflow','hidden');
		});

		var uid = $(this).attr('data-uid');

		$("#curMon > div[data-for='"+uid+"']").show().siblings().hide();

		//hide the popup if it's visible
		_hidePopup();
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

function _hidePopup() {
	$("#popup").slideUp(400, function() {
		$("#filterIcon").attr('class', 'icon-arrow-down');
	})
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

	changeLogEntrySize();
}