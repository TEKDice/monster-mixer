$(function() {

	if($("#ie").length != 0) {
		//hide stuff
		return;
	}

	$.pnotify.defaults.history = false;

	handleResizing();

	initializeArrowToggler();

	initializePopupToggler();

	initializeFilterSelect();

	makeSpansRemovable();

	initializeAutocomplete();

	$("#newFilter").click(addNewFilter);

	setupGenButton();

	$("#filters").find('option[value="Challenge Rating"]').attr('selected','selected');

	$("#hasScript").show();

	setupRoller();

	bodyBinding();

	loadFilters();

	initialiseSessionManager();
	
	changeLogEntrySize();
	
	overlayLoadingGif();

	initHotkeys();
});

function bodyBinding() {

	$("body").on('click', '.reroll-hp', function () {
		var uid = $(this).attr('data-uid');
		monsters[uid].hp.hp().reroll();
	});

	$("body").on('click', '.left', prevMonster);

	$("body").on('click', '.right', nextMonster);

	$(".delete").livequery(function () {
		$(this).click(function () {
			var uid = $(this).attr('data-uid');
			var name = $("#" + uid + "_name").text();
			bootbox.confirm("Are you sure you want to remove " + name + " from the encounter?", function (result) {
				if (result)
					remove(uid, false);
			});
		});
	});

	addFeatFunctions();
}