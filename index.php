<!DOCTYPE html>
<html>
	<head>
		<title>TEKDice Monster Mixer</title>
		<?php $pos='../'; include('../include/head.php'); ?>
		<link href="css/style.css" rel="stylesheet" />

		<script type="application/javascript" src="js/iscroll.js"></script>
		<script type="text/javascript">
			var myScroll;
			function loaded() {
				setTimeout(function () {
					myScroll = new iScroll('monsterListCont', {
						hScroll: false,
						scrollbarClass: "cScrollbar"
					});
				}, 100);
			}
		window.addEventListener('load', loaded, false);
		</script>
		<script type="text/javascript">

		</script>
	</head>
	<body>
		<?php include('../include/body.php'); ?>
		<center><div id="showFilters">▲</div></center>
		<!-- ▼ -->
		<div class="container-fluid">
			<div class="row-fluid" id="main">
				<div class="span9" id="monstersContainer">
					<div class="tabbable tabs-left" id="monsterListCont">
						<ul class="nav nav-tabs" id="monsterList">
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
							<li>
								<a href="#1A" data-toggle="tab">Devourer</a>
							</li>
						</ul>
						<div class="tab-content">
							<div class="tab-pane" id="1A">
								DevourerContent
							</div>
							<div class="tab-pane" id="1B">
								DevourerContent2
							</div>
						</div>
					</div>
				</div>
				<div class="span3" id="rightCol">
					<div id="log" class="tabbable">
						<ul class="nav nav-tabs">
							<li class="active">
								<a href="#allInfo" data-toggle="tab">All Info</a>
							</li>
							<li>
								<a href="#curMon" data-toggle="tab">Current Monster</a>
							</li>
						</ul>
						<div class="tab-content">
							<div class="tab-pane active" id="allInfo">
								<p>all info will be displayed here</p>
							</div>
							<div class="tab-pane" id="curMon">
								<p>current monster info will be displayed here</p>
							</div>
						</div>
					</div>
					<br>
					<div id="customRoller">
						<div class="control-group" id="rollerContainer">
							<div class="controls">
								<div class="input-append">
									<input type="text" class="input-block-level" id="roll" placeholder="Custom roll..." />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php include('../include/foot.php'); ?>
	</body>
</html>