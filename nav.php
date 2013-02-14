
<ul class='nav pull-right'>
	<li class="dropdown">
		<a href="#" class="dropdown-toggle" data-toggle="dropdown">
			<i class='icon-cog'></i>
			<b class="caret"></b>
		</a>
		<ul class="dropdown-menu">
			<li><a>New Session</a></li>
			<li><a>Current Session</a></li>
			<li><a>Sessions...</a></li>
			<li class="divider"></li>
			<li class="disabled"><a href="#"><i id="noChangeColor" class="icon-ok"></i> Status</a></li>
		</ul>
	</li>
</ul>

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

<div id="currentSessionDualog" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="currentSessionDialogHeader">Current Session</h3>
	</div>
	<div class="modal-body">
	</div>
	<div class="modal-footer">
		<span id="currentSessionDialogError" class="pull-left label label-important"></span>
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
		<button class="btn btn-primary">Save</button>
	</div>
</div>