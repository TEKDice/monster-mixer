
<div id="sessionDialog" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="sessionDialogHeader">Saved Sessions</h3>
	</div>
	<div class="modal-body">
		<table class="table">
			<caption>Sessions</caption>
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

<div id="currentSessionDialog" data-bind="with: sessionManager.currentSession()()" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true" style="position: default;">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="currentSessionDialogHeader">Current Session</h3>
	</div>
	<div class="modal-body">
		<div class="input-prepend">
			<span class="add-on span2">Session Name</span>
			<input class="input-xlarge" id="sessionName" type="text" placeholder="Name your campaign!" required data-bind="value: $data.name" />
		</div>
		<div class="input-prepend">
			<span class="add-on span2">Started</span>
			<input class="input-xlarge" id="sessionStarted" type="text" disabled data-bind="value: $parent.formatSessionDialogDate($data.startTime)" />
		</div>
		<div class="input-prepend">
			<span class="add-on span2">Last Updated</span>
			<input class="input-xlarge" id="sessionUpdated" type="text" disabled data-bind="value: $parent.formatSessionDialogDate($data.lastUpdate)" />
		</div>
	</div>
	<div class="modal-footer">
		<span id="currentSessionDialogError" class="pull-left label label-important"></span>
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
		<button class="btn btn-primary" id="saveCurrentSessionInfo" data-bind="click: $parent.saveCurrentSessionInfo">Save</button>
	</div>
</div>

<script type="text/javascript" src="js/ext/ui.session.js"></script>