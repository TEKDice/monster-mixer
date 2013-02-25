
function loadFilters() {
	if(!Data.hasVar("filters")) return;

	var filters = Data.getVar("filters");

	$.each(filters, function(i, e) {
		_addNewFilter(e);
	});
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

	if(_addNewFilter(newFilter)) 
		_trackFilter(newFilter, true);

}

function _addNewFilter(newFilter) {

	var filterName = newFilter.name;
	
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

		if(hasDuplicate) return false;

		var $filterSpan = $("<span/>", {
			text: getFilterText(newFilter)+" "
		}).attr('data-value',newFilter.value).attr('data-sign',newFilter.sign).addClass('badge').addClass('badge-info').addClass(cleanName+'-filter');
		var $removal = $("<sup/>", {
			text: "[x]"
		}).addClass('filter-remover');

		$filterSpan.appendTo($filterDivContainer);
		$removal.appendTo($filterSpan);

	//there are none in the DOM already
	} else {
		var $newTr = $("<tr/>", {}).attr('data-attr', newFilter.name);
		var $labelTd = $("<td/>", {});
		var $label = $("<span/>", {
			text: newFilter.name
		}).addClass('label filter-label');

		$newTr.appendTo("#filterTable");
		$labelTd.appendTo($newTr);
		$label.appendTo($labelTd);

		var $filterTd = $("<td/>", {});
		var $filterDiv = $("<div/>", {
			id: cleanName+"_filters"
		}).attr('data-attr', newFilter.name).addClass('inner-filter-container');
		var $filterSpan = $("<span/>", {
			text: getFilterText(newFilter)+" "
		}).attr('data-value',newFilter.value).attr('data-sign',newFilter.sign).addClass('badge badge-info '+cleanName+"-filter");
		var $removal = $("<sup/>", {
			text: "[x]"
		}).addClass('filter-remover');

		$filterTd.appendTo($newTr);
		$filterDiv.appendTo($filterTd);
		$filterSpan.appendTo($filterDiv);
		$removal.appendTo($filterSpan);
	}

	makeSpansRemovable();

	return true;
}

function _trackFilter(filter, add) {
	if(!Data.hasVar("filters")) {
		Data.setVar("filters",[]);
	}

	var filters = Data.getVar("filters");
	var filtFound = false;

	$.each(filters, function(i, e) {
		if(!e) return;
		if( filter.name == e.name &&
			filter.sign == e.sign &&
			filter.value == e.value) {
			if(!add) 
				filters.splice(i,1);
			else
				filtFound = true;
		}
	});

	if(!filtFound && add)
		filters.push(filter);

	Data.setVar("filters", filters);
}

function makeSpansRemovable() {
	$(".filter-remover").click(function() {
		$(this).parent().fadeOut(function() {
			var siblingsLeft = $(this).siblings().size();
			if(siblingsLeft == 0) {
				$(this).closest("tr").remove();
			}
			_trackFilter({
				name: $(this).closest("[data-attr]").attr('data-attr'), 
				value: $(this).closest("[data-value]").attr('data-value'),
				sign: $(this).closest("[data-sign]").attr('data-sign')
			}, false);
			$(this).remove();
		});
	});
}

function getFilterText(obj) {
	if(obj.hasOwnProperty('sign')) {
		return obj.sign + obj.value;
	} 
	return obj.value;
}

function initializeAutocomplete() {
	$("#autocompleteName").autocomplete( {
		source: autocompleteList,
		minLength: 2,
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