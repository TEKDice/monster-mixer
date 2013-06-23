$(function() {

	if($("#ie").length != 0) {
		//hide stuff
		return;
	}

	Notifier.checkUpdates();

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
	
	initializeMonsterModel();

	initialiseSessionManager();

	initialiseLog();
	
	changeLogEntrySize();
	
	overlayLoadingGif();

	initHotkeys();
});

function bodyBinding() {

	$("body").on('click', '.reroll-hp', function () {
		var uid = $(this).attr('data-uid');
		monsters.getMonster(uid).hp.hp().reroll();
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

	$(".logInner").livequery(function () {

		var $this = $(this);

		$this.mousemove(function (e) {
			var $target = $(e.target);
			if (!$target.hasClass(".logInner")) $target = $target.closest(".logInner");
			var parentOffset = $target.offset();

			var relX = e.pageX - parentOffset.left;
			var relY = e.pageY - parentOffset.top;
		
			if ($target.width() - relX < 100
			&& $target.height() - relY > 30)
				$target.find(".threat-status").removeClass($target.attr('data-type')).addClass('remove').trigger('change-to');
			else 
				$target.find(".threat-status").removeClass('remove').addClass($target.attr('data-type')).trigger('change-from');
		});

		$this.mouseleave(function (e) {
			$this.find(".threat-status").removeClass('remove').addClass($this.attr('data-type')).trigger('change-from');
		});

		$this.find(".threat-status").click(function () {
			var bundle = $this.attr('data-bundle');
			var bundled = $("#allInfo [data-bundle='" + bundle + "']");

			bootbox.confirm("Are you sure you want to do this? Removing this message will remove a total of " + bundled.size() + " messages.", function (result) {
				if (result === null || !result) return;
				logModel.removeMessagesByBundle(bundle);
			});
		});
	});

	$(".threat-status.remove,.threat-status.none").livequery(function () {
		var $this = $(this);

		$this.on('change-to',function (e) {
			$this.addClass('btn-link');
		});

		$this.on('change-from', function (e) {
			$this.removeClass('btn-link');
		});
	});

	addFeatFunctions();
}