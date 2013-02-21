$(function() {

	if($("#ie").length != 0) {
		//hide stuff
		return;
	}

	handleResizing();

	initializeArrowToggler();

	initializePopupToggler();

	initializeFilterSelect();

	makeSpansRemovable();

	initializeAutocomplete();

	setupAddButton();

	setupGenButton();

	$("#filters").find('option[value="Challenge Rating"]').attr('selected','selected');

	$("#hasScript").show();

	setupGrids();

	setupRoller();

	bodyBinding();

	loadFilters();

	sessionManagement();

	changeLogEntrySize();
	
	overlayLoadingGif();

});