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
			
var myScroll;
var resizeTimer;
var height = 360;
var heightAdjust = 140;

function setupRollables() {
	$(".rollable").append('<i class="icon-share-alt" />');
}

function setupGrids() {
	$(".sortable").sortable();
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
	var root = monster.data[0];

	var uid = new Date().getTime();

	var $li = $("<li/>");
	$li.appendTo($("#monsterList"));

	var $a = $("<a/>",{
		href: "#"+uid,
		text: "["+$("#monsterList").children().size()+"] "+root.name
	}).attr('data-toggle','tab');

	$a.appendTo($li);

	var newHtml = $("#dummyData").html();
	$("#monsterData").append(newHtml);

	var $parent = $("[data-for='none']").not("#dummyData > [data-for='none']");

	$parent.attr('id', uid);
	$parent.attr('data-for', uid);

	$parent.find("*[id*='1A']").each(function() {
		var attr = $(this).attr('data-attr');
		if(root.hasOwnProperty(attr)) {
			$(this).text(root[attr]);
		}
		$(this).attr('id', $(this).attr('id').replace('1A', uid));
	});

	$('#monsterList').niceScroll({horizrailenabled: false});
	$('#monsterList').css('overflow','hidden');

	tabChangeScrollbars();
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
	$(".cScrollbarV").css('height',height-heightAdjust+'px');

	resizeGrids();
}