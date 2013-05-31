$(function () {
	$("#sessionDialog").on('show', function () {
		$("#sessionDialogError").hide().text('');
	});

	$("#sessionDialog").on('shown', function () {
		var $body = $('#allSessions').closest(".modal-body");
		var hasId = $body.attr('data-scrollbarid') !== undefined;
		if (hasId)
			$$($body.attr('data-scrollbarid')).show();
		else {
			var nice = $body.niceScroll({ horizrailenabled: false });
			$body.attr('data-scrollbarid', nice.id);
			$$(nice.id + "-hr").remove();
			$body.css('overflow', 'hidden');
		}
	});

	$("#sessionDialog").on('hide', function () {
		var $body = $('#allSessions').closest(".modal-body");
		var id = $body.attr('data-scrollbarid');
		$$(id).hide();
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

function bindTrForSession(tr) {
	$(tr).click(function () {
		if ($(this).hasClass('success')) return;
		$(this).siblings().removeClass('info');
		$(this).addClass('info');
	});
}