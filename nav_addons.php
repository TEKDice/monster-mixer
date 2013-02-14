

<div id="sessionDialog" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="sessionDialogHeader">Saved Sessions</h3>
	</div>
	<div class="modal-body">
	</div>
	<div class="modal-footer">
		<span id="sessionDialogError" class="pull-left label label-important"></span>
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
		<button class="btn btn-primary">Load</button>
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
	});
</script>