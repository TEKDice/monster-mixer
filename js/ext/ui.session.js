$(function () {
	$("#sessionDialog").on('show', function () {
		var sessions = Data.getVar(SESSIONS_VARIABLE);
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
			$tr.click(function () {
				if ($(this).hasClass('success')) return;
				$(this).siblings().removeClass('info');
				$(this).addClass('info');
			});
		});
	});
	$("#sessionDialog").on('shown', function () {
		var $body = $('#allSessions').closest(".modal-body");
		var nice = $body.niceScroll({ horizrailenabled: false });
		$body.css('overflow', 'hidden');
	});
	$('#currentSessionDialog').on('show', function () {
		var session = getCurrentSession();
		if (session == undefined) {
			session = saveNewSession();
		}
		$("#sessionName").val(session.name);
		$("#sessionUpdated").val(new Date(session.lastUpdate).format());
		$("#sessionStarted").val(new Date(session.startTime).format());
	});
	$("#saveCurrentSessionInfo").click(function () {
		var newName = $("#sessionName").val();
		if (newName == '') return false;
		var session = getCurrentSession();
		session.name = newName;
		session.lastUpdate = now();
		saveSession(false, session);
		$(this).closest(".modal").modal('hide');
	});
	$("#sessionLoad").click(function () {
		var sessId = $("#allSessions .info").attr('data-session');
		if (!sessId) return;
		$(this).closest('.modal').modal('hide');
		loadSession(sessId);
	});
	$("#newSession").click(function () {
		startNewSession();
	});
});