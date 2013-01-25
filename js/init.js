$(function() {

	initializeScrollbars();

	initializeArrowToggler();

	initializePopupToggler();

	initializeFilterSelect();

	makeSpansRemovable();

	initializeAutocomplete();

	setupAddButton();

	$("#filters").find('option[value="Challenge Rating"]').attr('selected','selected');

	$("#hasScript").show();

});

var defaultPopupSize=500;
var extendPopupSize	=1200;
			
var myScroll;
var resizeTimer;
var height = 360;
var heightAdjust = 140;

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
	
	var cleanName=newFilter.name.split(' ').join('');

	var $filterDivContainer = $("#"+cleanName+"_filters");

	//we have one
	if($filterDivContainer.length) {

		//CHECK DUPES
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
		});
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
		minLength: 3,
		select: function(event, ui) {
			return true;
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