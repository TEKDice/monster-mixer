$(function() {

	handleResizing();

	initializeArrowToggler();

	initializePopupToggler();

	initializeFilterSelect();

	makeSpansRemovable();

	initializeAutocomplete();

	setupAddButton();

	setupGenButton();

	setupRollables();

	$("#filters").find('option[value="Challenge Rating"]').attr('selected','selected');

	$("#hasScript").show();

	setupGrids();

});

var defaultPopupSize=500;
var extendPopupSize	=1200;
			
var height = 360;
var heightAdjust = 140;

function setupRollables() {
	$(".rollable").append('<i class="icon-share-alt" />');
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
			filterObj[attr] = new Array();
			$(this).children(".badge").each(function() {
				filterObj[attr].push({sign: $(this).attr('data-sign'), value: $(this).attr('data-value')});
			});
		});

		//POST filters
		$.post('ajax.php', {action: "gen", data: JSON.stringify(filterObj)}, function(monster) {
			monster = $.parseJSON(monster);
			if(monster=='') {
				alert("No results");
				return;
			}
			addNewMonster(monster);
			setupGrids();
		});
	});
}

function addNewMonster(monster) {

	var uid = new Date().getTime();

	var $li = $("<li/>");
	$li.appendTo($("#monsterList"));

	var $a = $("<a/>",{
		href: "#"+uid,
		text: "["+$("#monsterList").children().size()+"] "+monster.data[0].name
	}).attr('data-toggle','tab');

	$a.appendTo($li);

	var newHtml = $("#dummyData").html();
	$("#monsterData").append(newHtml);

	var $parent = $("[data-for='none']").not("#dummyData > [data-for='none']");

	$parent.attr('id', uid);
	$parent.attr('data-for', uid);

	addDataToMonster($parent, monster, uid);

	$('#monsterList').niceScroll({horizrailenabled: false});
	$('#monsterList').css('overflow','hidden');

	tabChangeScrollbars();

	rollableRowHighlighting($parent);
}

function rollableRowHighlighting($parent) {
	$parent.find("tr[data-roll]").each(function() {
		$(this).click(function() {
			$(this).siblings(".info").removeClass('info');
			if($(this).hasClass('info'))
				$(this).removeClass('info');
			else
				$(this).addClass('info');
		});
	});
}

function addDataToMonster($parent, monster, uid) {
	var root = monster.data[0];

	//all of the base attributes in the data object
	$parent.find("*[id*='1A']").each(function() {
		var attr = $(this).attr('data-attr');
		if(root.hasOwnProperty(attr)) {
			$(this).text(root[attr] + (attr=='base_spd' ? 'ft' : ''));
		}
		$(this).attr('id', $(this).attr('id').replace('1A', uid));
	});

	$parent.find(".stats tr").each(function() {
		var num = get_bonus($(this).children("td").eq(1).text());
		$(this).attr('data-roll', '1d20'+(num<0 ? num : "+"+num));
	});

	$parent.find(".cstats tr").each(function() {
		var num = parseInt($(this).children("td").eq(1).text());
		$(this).attr('data-roll', '1d20'+(num<0 ? num : "+"+num));
	});

	for(var prop in monster) {
		if(prop!='data' && isNaN(parseInt(prop))) {
			var $table = $("#"+uid+"_"+prop+"_table");
			if($table.length == 0 || monster[prop].length == 0) continue;
			appendToTable($table, root.name, prop, monster[prop]);
		}
	}
}

var defaultFunction = function() {
	return "THIS IS AN ERROR";
}

var formatting = {
	madvanc: 	defaultFunction,
	malign: 	defaultFunction,
	marmor: 	function(obj) {
		return obj.aname + (obj.enchantment_bonus != "0" ? " +"+obj.enchantment_bonus : "");
	},
	mattack:  	function(obj) {
		return obj.aname + "</td><td>"+obj.hitdc;
	},
	mdmgred: 	function(obj) {
		return obj.name + "</td><td>" + (obj.reduction_amount=="0" ? "--" : obj.reduction_amount);
	},
	mfeat: 		function(obj) {
		return obj.name;
	},
	mfatk: 		defaultFunction,
	mlang: 		defaultFunction,
	mmove:    	function(obj) {
		return obj.movement_type + "</td><td>" + obj.movement_speed+"ft";
	},
	morgani: 	defaultFunction,
	mqualit:  	function(obj) {
		return obj.name + "</td><td>" + (obj.value != "0" ? obj.value+"ft" : "");
	},
	mskill: 	function(obj) {
		return obj.name + (obj.sub_skill!="" ? " ("+obj.sub_skill+")" : "") + "</td><td>" + (parseInt(obj.skill_level)<0 ? obj.skill_level : "+"+obj.skill_level);
	},
	mspatk: 	function(obj) {
		return obj.name + "</td><td>" + (obj.range != "0" ? obj.range+"ft" : "") + "</td><td>" + (obj.hit_dice != "0" ? obj.hit_dice : "");
	},
	msubcat: 	defaultFunction,
	mterr: 		defaultFunction,
	mtype: 		defaultFunction,
	mweapon: 	function(obj) {
		return obj.extra_wsize + " " + obj.wname + (obj.enchantment_bonus != "0" ? " +"+obj.enchantment_bonus : "") + "</td><td>" + obj.hitdc + "</td><td class='rightalign'>" + (obj.dmgname != null ? "+"+obj.dmgred_hd + " " + obj.dmgname : "");
	}
};

function get_bonus(num) {
	num=parseInt(num);
	if(num == 0) return 0;
	return Math.floor(num/2)-5;
}

var rollable = {
	mattack: function(obj) {
		return obj.hitdc;
	},
	mskill: function(obj) {
		return "1d20+"+(obj.skill_level<0 ? obj.skill_level : "+"+obj.skill_level);
	},
	mweapon: function(obj) {
		return obj.hitdc + (obj.dmgname != null ? "+"+obj.dmgred_hd : "");
	}

}

function appendToTable($table, monsterName, attr, arr) {
	if(attr!='mmove')
		$table.empty();
	$.each(arr, function(i, obj) {
		var $tr = $("<tr/>");
		if(rollable.hasOwnProperty(attr)) 
			$tr.attr('data-roll', rollable[attr](obj));
		$tr.appendTo($table);
		var inner = formatting[attr](obj);
		if(inner.indexOf(monsterName) != -1) inner = inner.substring(monsterName.length);
		$tr.append("<td"+(obj.hasOwnProperty('descript') ? " class='has-tooltip' data-desc='"+obj.descript.split("\n").join("<br>")+"'" : "")+">"+inner+"</td>");
	});
	$table.find("td.has-tooltip").each(function() {
		var text = $(this).text();
		$(this).text('');
		$(this).prepend('<i class="icon-bookmark"></i><a href="#" rel="tooltip" title="'+$(this).attr('data-desc')+'">'+text+"</a>");
		$(this).find('a').tooltip({html: true, placement: 'bottom'});
	});

}

function tabChangeScrollbars() {
	$('a[data-toggle="tab"]').on('shown', function (e) {
		$(".minibox-content").niceScroll();
		$(".minibox-content").css('overflow','hidden');
	});
}

function _cleanName(str) {
	return str.split(' ').join('');
}

function addNewFilter() {

	var filterName = $("#filters").val();

	var newFilter = {name: filterName};

	//is joinable
	if(filterData[filterName] instanceof Array) {
		newFilter.value=$("#joinSelect").val();

	//is numeric
	} else if(filterData[filterName]){
		var num = $("#numberInput").val();
		if(num == 0) return;
		newFilter.value = $("#numberInput").val();
		newFilter.sign = $("#signChooser").val();

	//is name
	} else {
		newFilter.value=$("#autocompleteName").val();

	}
	
	var cleanName=_cleanName(newFilter.name);

	var $filterDivContainer = $("#"+cleanName+"_filters");

	//we have one
	if($filterDivContainer.length) {

		var hasDuplicate = false;
		$("."+cleanName+"-filter").each(function() {
			if($(this).attr('data-sign') == newFilter.sign &&
			   $(this).attr('data-value') == newFilter.value) {
				$(this).animate({boxShadow: "0 0 15px #f00"}, 1000, function() {
					$(this).animate({boxShadow: "none"});
				});
				hasDuplicate = true;
				return;
			}
		});

		if(hasDuplicate) return;

		var $filterSpan = $("<span/>", {
			class: "badge badge-info "+cleanName+"-filter",
			text: getFilterText(newFilter)+" "
		}).attr('data-value',newFilter.value).attr('data-sign',newFilter.sign);
		var $removal = $("<sup/>", {
			class: "filter-remover",
			text: "[x]"
		});

		$filterSpan.appendTo($filterDivContainer);
		$removal.appendTo($filterSpan);

	//there are none in the DOM already
	} else {
		var $newTr = $("<tr/>", {}).attr('data-attr', newFilter.name);
		var $labelTd = $("<td/>", {});
		var $label = $("<span/>", {
			class: "label filter-label",
			text: newFilter.name
		});

		$newTr.appendTo("#filterTable");
		$labelTd.appendTo($newTr);
		$label.appendTo($labelTd);

		var $filterTd = $("<td/>", {});
		var $filterDiv = $("<div/>", {
			id: cleanName+"_filters",
			class: "inner-filter-container"
		}).attr('data-attr', newFilter.name);
		var $filterSpan = $("<span/>", {
			class: "badge badge-info "+cleanName+"-filter",
			text: getFilterText(newFilter)+" "
		}).attr('data-value',newFilter.value).attr('data-sign',newFilter.sign);
		var $removal = $("<sup/>", {
			class: "filter-remover",
			text: "[x]"
		});

		$filterTd.appendTo($newTr);
		$filterDiv.appendTo($filterTd);
		$filterSpan.appendTo($filterDiv);
		$removal.appendTo($filterSpan);
	}

	makeSpansRemovable()
}

function getFilterText(obj) {
	if(obj.hasOwnProperty('sign')) {
		return obj.sign + obj.value;
	} 
	return obj.value;
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

function initializeAutocomplete() {
	$("#autocompleteName").autocomplete( {
		source: autocompleteList,
		select: function(event, ui) {
			$("#autocompleteName").val(ui.item.label);
			addNewFilter();
			$("#autocompleteName").val('');
			return false;
		}
	});
}

function initializeFilterSelect() {
	for(var o in filterData) {
		$("#filters").append("<option value='"+o+"'>"+o+"</option>");
	}

	$("#filters").change(function() {

		$(".joinOpt, .numericOpt, .nameOpt").hide();
		$("#numberInput, #autocompleteName").val('');
		$("#joinSelect").empty();

		//is joinable
		if(filterData[$(this).val()] instanceof Array) {
			$(".joinOpt").fadeIn();

			var arr = filterData[$(this).val()];
			for(var o in arr) {
				$("#joinSelect").append("<option value='"+arr[o]+"'>"+arr[o]+"</option>");
			}

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
				$("#extra").animate({width: extendPopupSize-defaultPopupSize});
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
				$("#popup").attr('display','inline-block');
				$("#filterContainer").niceScroll({zindex: 14});
				$("#filterContainer").css('overflow','hidden');
			} else {
				$("#filterIcon").attr('class', 'icon-arrow-down');
			}
		});
	});
}

function handleResizing() {
	$(window).resize(timedResizeElements);
	resizeElements();
}

var resizeTimer;

//don't instantly automatically refresh everything, that's going to lag
function timedResizeElements() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(resizeElements, 100);
}

function resizeElements() {
	height = $(window).height();

	$("#log").css('height', height-50-heightAdjust+'px');
	$("#monsterListCont").css('height',height-50-heightAdjust+'px');
	$("#monsterList").css('height',height-50-heightAdjust+'px');

	resizeGrids();
}