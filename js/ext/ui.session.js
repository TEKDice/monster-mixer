$(function () {
	$("#sessionDialog").on('show', function () {
		var sessions = sessionManager.allSessions();
		$("#allSessions").empty();
		$.each(sessions, function (i, e) {
			if (!Data.hasVar("monsters_" + e.startTime)) return;
			var $tr = $("<tr/>").attr('data-session', e.startTime);
			if (e.startTime == currentSessionId) $tr.addClass('success');
			$tr.appendTo($("#allSessions"));
			$("<td/>").html(e.name + "<br><span class='subdate'>" + new Date(e.startTime).format() + "</span>	").appendTo($tr);
			$("<td/>").text('').appendTo($tr);
			var $button = $("<button/>").addClass('btn btn-danger').attr('data-session', e.startTime).html('<i class="icon-remove"></i> Delete');
			$button.click(function () {
				var $but = $(this);
				$("#sessionDialog").modal('hide');
				bootbox.confirm("Are you sure you want to delete this campaign? Not even a wish can bring this back once it's gone.", function (result) {
					if (!result) {
						$("#sessionDialog").modal('show');
						return;
					}
					deleteSession($but.attr('data-session'));
					$tr.remove();
					$("#sessionDialog").modal('show');
				});
			});
			$("<td/>").append($button).appendTo($tr);

			var $sButton = $("<button/>").addClass('btn btn-info').attr('data-session', e.startTime).html('<i class="icon-refresh"></i> Sync');
			$sButton.click(function () {
				var sessionInfo = e;
				$.ajax("sessions.php", {
					type: "POST",
					data: {
						action: "new",
						sessname: sessionInfo.name,
						json: JSON.stringify(getMonsterDataBySession(sessionInfo.startTime)),
						sttime: sessionInfo.startTime,
						uptime: sessionInfo.lastUpdate
					}
				}).done(function (data) {
				}).fail(function () {
				}).always(function () {
				});
			});

			$("<td/>").append($sButton).appendTo($tr);
			var $sButton = $("<button/>").addClass('btn btn-info').attr('data-session', e.startTime).html('<i class="icon-refresh"></i> Unsync');
			$sButton.click(function () {
				var sessionInfo = e;
				$.ajax("sessions.php", {
					type: "POST",
					data: {
						action: "del",
						sttime: sessionInfo.startTime
					}
				}).done(function (data) {
				}).fail(function () {
				}).always(function () {
				});
			});

			$("<td/>").append($sButton).appendTo($tr);
			$tr.click(function () {
				if ($(this).hasClass('success')) return;
				$(this).siblings().removeClass('info');
				$(this).addClass('info');
			});
		});
	});

	//keep
	$("#sessionDialog").on('shown', function () {
		var $body = $('#allSessions').closest(".modal-body");
		var nice = $body.niceScroll({ horizrailenabled: false });
		$body.css('overflow', 'hidden');
	});
	$("#sessionLoad").click(function () {
		var sessId = $("#allSessions .info").attr('data-session');
		if (!sessId) return;
		$(this).closest('.modal').modal('hide');
		sessionManager.loadSession(sessId);
	});
	$("#newSession").click(function () {
		sessionManager.startNewSession();
	});
});