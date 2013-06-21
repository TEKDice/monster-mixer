
var defaultPopupSize = 500;
var extendPopupSize = 1200;

var height = 360;
var heightAdjust = 140;
var width;
var pnotification;
var MIN_X_RES = 1356;
var MIN_Y_RES = 662;

var resizeTimer;

function setupRoller() {
	$("#roll").keyup(function (e) {
		if (e.keyCode == 27) {
			$("#roll").val('');
		}
		if (e.which != 13) return;
		e.preventDefault();
		var toRoll = $(this).val();
		var roll = rollExpression(toRoll);
		if (roll === 0) return;
		addToLog("Custom roll: " + toRoll + " rolled " + roll + ".", "customRoll");
	});

	$("#dice button").click(function () {
		var val = $("#roll").val() == '' ? "1" + $(this).text() : "+1" + $(this).text();
		$("#roll").val($("#roll").val() + val);
	});
}

function setupRollables($parent) {
	var uid = $parent.find("[data-uid]").attr('data-uid');

	$parent.find(".rollable").each(function () {

		var $set = $(this).find("tr:not(.unrollable)");
		$set.each(function () {
			if ($(this).find('td.unrollable').size() > 0) return;
			$(this).click(function () {
				if ($(this).hasClass('info')) {
					$(this).removeClass('info');
				} else {
					$set.removeClass('info');
					$(this).addClass('info');
				}
				monsters[uid].roller.invalidate();
			});
		});

		var $roller = $("<i/>").addClass('icon-share-alt');
		$roller.click(function () {
			var $rollable = $(this).parent().find('.info');
			if ($rollable.length === 0) {
				bootbox.alert("Please select a feature to roll.");
				return;
			}

			attack($rollable, $(this), uid);
		});
		$(this).append($roller);
	});

}

function setupGrids(uid) {
	$("div[data-for='" + uid + "'] .sortable").sortable({
		stop: function (e, u) {
			setupGrids(uid);
		}
	});
	$("div[data-for='" + uid + "'].sortable").disableSelection();

	$("div[data-for='" + uid + "'] .draggable").find(".minibox-content").each(function () {
		$(this).height($(this).parent().height() - 22);
		var nice = $(this).niceScroll({ horizrailenabled: false, zindex: 9 });
		$$(nice.id).attr('data-nice-uid', uid);
		$$(nice.id + "-hr").remove();
	});
}

function _hideAllMiniboxScrollbars() {
	$("div[data-nice-uid]").hide();
}

function tabChangeScrollbars($a) {
	$a.on('show', function (e) {
		_hideAllMiniboxScrollbars();

		var uid = $(this).attr('data-uid');

		$("#curMon > div[data-for='" + uid + "']").show().siblings().hide();

		//hide the popup if it's visible
		_hidePopup();

		$("[data-nice-uid='" + uid + "']").show();

		setupGrids(uid);

		logModel.currentMonsterId(uid);
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
	width = $(window).width();

	$("#log").css('height', height - 80 - heightAdjust + 'px');
	$("#monsterListCont").css('height', height - 50 - heightAdjust + 'px');
	$("#monsterList").css('height', height - 50 - heightAdjust + 'px');

	$("#monsterData").css('height', $("#log").height() - 38);

	$("#log .tab-pane > div").css('height', $("#log").height() - 38);

	$("#monstersContainer > .row-fluid").first().css('height', $("#monsterListCont").height());

	changeLogEntrySize();

	resolutionNotification();
}

function resolutionNotification() {

	if (width < MIN_X_RES || height < MIN_Y_RES) {
		if (pnotification) {
			pnotification.pnotify({ text: screenResolutionMessage() });
		} else
			pnotification = $.pnotify({
				title: "Screen Resolution Problem Detected",
				text: screenResolutionMessage(),
				type: "info",
				width: "70%",
				addclass: "stack-bar-bottom",
				cornerclass: "",
				sticker: true,
				hide: false,
				stack: { addpos2: 0, animation: true, dir1: "up", dir2: "right", firstpos1: 0, firstpos2: 0, nextpos1: 0, nextpos2: 0, spacing1: 0, spacing2: 0 }
			});
	} else {
		if (pnotification) {
			pnotification.pnotify_remove();
			pnotification = null;
		}
	}
}

function screenResolutionMessage() {
	return "Hey, so it looks like your screen is currently running at "+width+"x"+height+", which is fine, but it might cause a problem while using this application! We recommend at least a resolution of "+MIN_X_RES+"x"+MIN_Y_RES+" (or 1366x768). If this notification is in error, please contact a member of the team and we'll sort out the issue. Thanks!";
}

function overlayLoadingGif() {
	$t = $("#monsterListCont");
	if (!$t.length) return;

	$("#overlay").css({
		opacity: 0.8,
		top: $t.offset().top,
		left: $t.offset().left,
		width: $t.outerWidth(),
		height: $t.outerHeight()
	});

	$("#img-load").css({
		top: ($t.height() / 2),
		left: ($t.width() / 2)
	});
}

ko.bindingHandlers.bootstrapTooltip = {
	init: function (element, valueAccessor, allBindingAccessor, viewModel) {
		var options = ko.utils.unwrapObservable(valueAccessor());
		var defaultOptions = {};
		options = $.extend(true, {}, defaultOptions, options);
		$(element).tooltip(options);

		$(element).click(function () {

			var $me = $(this);
			var doShow = true;

			$(".in").each(function () {
				if ($(this).siblings("a").is($me)) {
					doShow = false;
				}
				$(this).siblings("a").tooltip('hide');

			});
			if (doShow)
				$(this).tooltip('show');
		});
	}
};