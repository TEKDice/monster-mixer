
<?php
define('readonly',true);

include('../include/database.php');

global $conn;
	
$filterNamesArr = run_query_arr($conn, "select name,is_numeric,sql_name,join_table,join_table_col,link_table from GeneratorFilters");
$filterNames = array();

$json_obj = new stdClass;

foreach($filterNamesArr as $name=>$filter) {
	if($filter["is_numeric"] == 1)
		$filterNames[$filter["name"]] = true;
	else if($filter["name"] == "Name")
		$filterNames[$filter["name"]] = false;
	else {
		$filterNames[$filter["name"]] = array();

		$filterData = run_query_arr($conn, "select $filter[sql_name] from $filter[join_table] where (hidden=0 or hidden is null)");
		foreach($filterData as $col=>$val) {
			array_push($filterNames[$filter["name"]], $val[$filter['sql_name']]);
		}
	}
}

?>

<!DOCTYPE html>
<html>
	<head>
		<title>TEKDice Monster Mixer</title>
		<?php $pos='../'; include('../include/head.php'); ?>
		<link href="css/style.css" rel="stylesheet" />

		<script type="application/javascript" src="js/iscroll.js"></script>
		<script src="js/init.js"></script>
		<script type="text/javascript">
			var filterData = <?=json_encode($filterNames, JSON_PRETTY_PRINT); ?>
		</script>
	</head>
	<body>
		<?php include('../include/body.php'); ?>
		<noscript>
			<div class="hero-unit pagination-centered">
				It looks like your browser doesn't have javascript enabled or supported. This applications makes heavy usage of javascript, so at the present time, there isn't a version available without javascript.
			</div>
		</noscript>
		<div id="hasScript">
			<center><div id="showFilters"><i id="filterIcon" class="icon-arrow-down"></i></div></center>
			<div class="container-fluid" id="mainContainer">
				<div class="row-fluid" id="main">

					<div class="span9" id="monstersContainer">
						<div class="tabbable tabs-left" id="monsterListCont">
							<ul class="nav nav-tabs" id="monsterList">
								<li>
									<a href="#1A" data-toggle="tab">Devourer</a>
								</li>
							</ul>
							<div class="tab-content" id="monsterData">
								<div class="tab-pane" id="1A">
									DevourerContent
								</div>
							</div>
						</div>

						<div id="encounterStats">
							Encounter Statistics (CR, Avg. Level, Avg. Dmg. Dealt, Avg. Creature Dmg. Taken, Total Damage Dealt/Taken)
						</div>
					</div>

					<div class="span3" id="rightCol">
						<div id="customRoller">
							<div class="control-group" id="rollerContainer">
								<div class="controls">
									<div class="input-append">
										<input type="text" class="input-block-level" id="roll" placeholder="Custom roll..." />
									</div>
								</div>
							</div>
						</div>

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
					</div>

				</div>
			</div>

			<div id="popup">
				<div id="popupLeft">
					<div id="simple">
						<div class="input-append input-prepend" style="width: 100%; text-align: center;">
							<label class="control-label add-on">Attribute:</label>

							<select id="filters" style="width: 150px;">
							</select>

							<select name="" id="" class="numericOpt" style="width: 75px;">
								<option value="">></option>
								<option value="">>=</option>
								<option value="">=</option>
								<option value=""><=</option>
								<option value=""><</option>
							</select>

							<input type="number" class="numericOpt" style="width: 50px;" placeholder="####" />

							<select class="joinOpt" style="width: 139px; display: none;"></select>
							
							<input type="text" id="autocompleteName" class="nameOpt" style="width: 159px; display: none;" placeholder="Enter a name..." />
							<button class="btn btn-primary numericOpt joinOpt" id="newFilter" type="button">+</button>
						</div>
					</div>
					<div id="median">
						<div id="medianArrowContainer" title="More options">
							<i id="extraToggle" class="icon-arrow-right"></i>
						</div>
					</div>
				</div>
				<div id="extra">
					extra stuff
				</div>
			</div>
		</div>
		<?php include('../include/foot.php'); ?>
	</body>
</html>