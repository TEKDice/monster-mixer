
<div id="sessionDialog" data-bind="with: sessionManager" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="sessionDialogHeader">Saved Encounters</h3>
	</div>
	<div class="modal-body">
		<table class="table">
			<thead>
				<tr><td>Encounter Name</td><td>Status</td><td></td><td></td></tr>
			</thead>
			<tbody id="allSessions">
                <!-- ko foreach: $data.tableDisplaySessions -->
                <tr data-bind="attr: {'class': $data.startTime == $parent.currentSessionId() ? 'sessionRow success' : 'sessionRow', 'data-session': $data.startTime}, click: function(data, event) { bindTrForSession(event.currentTarget); }">
                    <td><span class="sessionName" data-bind="text: $data.name"></span><br /><span class="subdate" data-bind="text: $parent.formatSessionDialogDate($data.startTime)"></span></td>
                    <!-- ko if: $parent.isSynced($data) -->
                        <td><span class="status">Synced</span></td>
                        <td><button class='btn btn-info btn-sync' data-bind="click: function(data, event) { $root.syncSessionUnsyncButton(data, event.currentTarget); }" data-loading-text="Working..."><i class="icon-refresh"></i> Unsync</button></td>
                    <!-- /ko -->
                    <!-- ko if: !$parent.isSynced($data) -->
                        <td><span class="status">Local</span></td>
                        <td><button class='btn btn-info btn-sync' data-bind="click: function(data, event) { $root.syncSessionSyncButton(data, event.currentTarget); }" data-loading-text="Working..."><i class="icon-refresh"></i> Sync</button></td>
                    <!-- /ko -->
                    <td><button class='btn btn-danger' data-bind="click: function(data, event) { $root.syncSessionDeleteButton(data, event.currentTarget); }" data-loading-text="Working..."><i class="icon-remove"></i> Delete</button></td>
                </tr>
                <!-- /ko -->
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
		<h3 id="currentSessionDialogHeader">Current Encounter</h3>
	</div>
	<div class="modal-body">
		<div class="input-prepend">
			<span class="add-on span2">Encounter Name</span>
			<input class="input-xlarge" id="sessionName" type="text" placeholder="Name your encounter!" required data-bind="value: $data.name" />
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
		<span id="currentSessionDialogError" class="pull-left label label-important" style="display: none;"></span>
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
		<button class="btn btn-primary" id="saveCurrentSessionInfo" data-bind="click: $parent.saveCurrentSessionInfo">Save</button>
	</div>
</div>

<script type="text/javascript" src="js/ext/ui.session.js"></script>