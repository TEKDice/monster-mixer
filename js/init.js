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

	$("#newFilter").click(addNewFilter);

	setupGenButton();

	$("#filters").find('option[value="Challenge Rating"]').attr('selected','selected');

	$("#hasScript").show();

	setupRoller();

	bodyBinding();

	loadFilters();

	initialiseSessionManager();

	setupSyncButtons();

	changeLogEntrySize();
	
	overlayLoadingGif();

});

function bodyBinding() {

	$("body").on('click', '.reroll-hp', function () {
		var uid = $(this).attr('data-uid');
		monsters[uid].hp.hp().reroll();
	});

	$("body").on('click', '.left', function () {
		var $cur = $("#monsterList").children(".active");
		var $newtab;
		if ($cur.is($("#monsterList").children().first())) {
			$newtab = $("#monsterList").children().last();
		} else {
			$newtab = $("#monsterList").children(".active").prev();
		}
		$newtab.children("a").tab('show');
	});

	$("body").on('click', '.right', function () {
		var $cur = $("#monsterList").children(".active");
		var $newtab;
		if ($cur.is($("#monsterList").children().last())) {
			$newtab = $("#monsterList").children().first();
		} else {
			$newtab = $("#monsterList").children(".active").next();
		}
		$newtab.children("a").tab('show');
	});

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