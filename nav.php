<ul class='nav pull-right'>
	<li class="dropdown">
		<a href="#" class="dropdown-toggle" data-toggle="dropdown">
			<i id="secondaryStatusIcon" class='icon-cog'></i>
			<b class="caret"></b>
		</a>
		<ul class="dropdown-menu">
			<li><a href="#" id="newSession">New Encounter</a></li>
			<li><a href="#" data-toggle="modal" data-target="#currentSessionDialog">Current Encounter</a></li>
			<li><a href="#" data-toggle="modal" data-target="#sessionDialog">Encounters...</a></li>
			<li class="divider"></li>
			<li class="disabled"><a href="#"><i id="noChangeColor" class="icon-ok"></i>&nbsp;<span id="statusText">Ready</span></a></li>
            <li class="divider"></li>
            <li class="disabled"><a href="#">Version <?=getVersion()?></a></li>
            <li><a href="http://tekdice.com/forum/viewforum.php?f=16" target="_blank">Help</a></li>
		</ul>
	</li>
</ul>
