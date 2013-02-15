

<div id="sessionDialog" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="sessionDialogHeader">Saved Sessions</h3>
	</div>
	<div class="modal-body">
		<table class="table">
			<caption>Local Sessions</caption>
			<thead>
				<tr><td>Session Name</td><td>Sync Status</td><td></td></tr>
			</thead>
			<tbody id="allSessions">
			</tbody>
		</table>
	</div>
	<div class="modal-footer">
		<span id="sessionDialogError" class="pull-left label label-important"></span>
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
		<button class="btn btn-primary" id="sessionLoad">Load</button>
	</div>
</div>

<div id="currentSessionDialog" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true" style="position: default;">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="currentSessionDialogHeader">Current Session</h3>
	</div>
	<div class="modal-body">
		<div class="input-prepend">
			<span class="add-on span2">Session Name</span>
			<input class="span2" id="sessionName" type="text" placeholder="Name your campaign!">
		</div>
		<div class="input-prepend">
			<span class="add-on span2">Updated</span>
			<input class="span2" id="sessionUpdated" type="text" disabled>
		</div>
		<div class="input-prepend">
			<span class="add-on span2">Started</span>
			<input class="span2" id="sessionStarted" type="text" disabled>
		</div>
	</div>
	<div class="modal-footer">
		<span id="currentSessionDialogError" class="pull-left label label-important"></span>
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
		<button class="btn btn-primary" id="saveCurrentSessionInfo" data-dismiss="modal">Save</button>
	</div>
</div>

<script type="text/javascript">
	$(function() {
		$("#sessionDialog").on('show', function() {
			var sessions = Data.getVar(SESSIONS_VARIABLE);
			$("#allSessions").empty();
			$.each(sessions, function(i, e) {
				if(!Data.hasVar("monsters_"+e.startTime))return;
				var $tr = $("<tr/>").attr('data-session', e.startTime);
				if(e.startTime == currentSessionId) $tr.addClass('success');
				$tr.appendTo($("#allSessions"));
				$("<td/>").html(e.name+"<br><span class='subdate'>"+new Date(e.startTime).format()+"</span>	").appendTo($tr);
				$("<td/>").text('').appendTo($tr);
				var $button = $("<button/>").addClass('btn btn-danger').attr('data-session',e.startTime).html('<i class="icon-remove"></i> Delete');
				$button.click(function() {
					var $but = $(this);
					$("#sessionDialog").modal('hide');
					bootbox.confirm("Are you sure you want to delete this campaign? Not even a wish can bring this back once it's gone.", function(result) {
						if(!result) {
							$("#sessionDialog").modal('show');
							return;
						}
						deleteSession($but.attr('data-session'));
						$tr.remove();
						$("#sessionDialog").modal('show');
					});
				});
				$("<td/>").append($button).appendTo($tr);
				$tr.click(function() {
					if($(this).hasClass('success')) return;
					$(this).siblings().removeClass('info');
					$(this).addClass('info');
				});
			});
		});
		$("#sessionDialog").on('shown', function() {
			var $body = $('#allSessions').closest(".modal-body");
   			var nice = $body.niceScroll({horizrailenabled: false});
   			$body.css('overflow','hidden');
		});
		//
		$('#currentSessionDialog').on('show', function () {
			var session = getCurrentSession();
			if(session == undefined) {
				session = saveNewSession();
			}
			$("#sessionName").val(session.name);
			$("#sessionUpdated").val(new Date(session.lastUpdate).format());
			$("#sessionStarted").val(new Date(session.startTime).format());
		});
		$("#saveCurrentSessionInfo").click(function() {
			var session = getCurrentSession();
			session.name = $("#sessionName").val();
			session.lastUpdate = now();
			saveSession(false, session);
		});
		$("#sessionLoad").click(function() {
			var sessId = $("#allSessions .info").attr('data-session');
			if(!sessId) return;
			$(this).closest('.modal').modal('hide');
			loadSession(sessId);
		});
		//
		$("#newSession").click(function() {
			startNewSession();
		});

	});
</script>