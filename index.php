
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
		array_multisort($filterNames[$filter["name"]]);
	}
}

function build_autocomplete() {
	global $conn;
	$query = "select id,name from Monster where version_id=6 and (hidden is null or hidden = 0)";
	$data = run_query($conn, $query);
	
	$acarr = array();
	
	while(($arr = $data->fetch_array(MYSQLI_ASSOC)) != null) {
		$obj = new stdClass;
		$obj->label=$arr["name"];
		$obj->value=$arr["name"];
		array_push($acarr, $obj);
	}
	
	return $acarr;

}
?>

<!DOCTYPE html>
<html>
	<head>
		<title>TEKDice Monster Mixer</title>
		<?php $pos='../'; include('../include/head.php'); ?>
		<link href="../css/jquery-ui-1.10.0.custom.css" rel="stylesheet" />
		<link href="css/style.css" rel="stylesheet" />

		<script src="../js/jquery-ui-1.9.2.custom.min.js"></script>
		<script type="application/javascript" src="js/iscroll.js"></script>
		<script src="js/init.js"></script>
		<script src="js/jquery.boxshadow.min.js"></script>
		<script type="text/javascript">
			var filterData = <?=json_encode($filterNames);?>;
			var autocompleteList = <?=json_encode(build_autocomplete());?>;
		</script>
	</head>
	<body>
		<?php include('../include/body.php'); ?>
		<noscript>
			<div class="hero-unit pagination-centered">
				It looks like your browser doesn't have javascript enabled or supported. This applications makes heavy usage of javascript, so at the present time, there isn't a version available without javascript.
			</div>
		</noscript>
		<?php
		if(isLoggedIn()) {
		?>
		<div id="hasScript">
			<center><div id="showFilters"><i id="filterIcon" class="icon-arrow-down"></i></div></center>
			<div class="container-fluid" id="mainContainer">
				<div class="row-fluid" id="main">
					<div class="span9" id="monstersContainer">
						<div class="tabbable tabs-left" id="monsterListCont">
							<ul class="nav nav-tabs" id="monsterList"></ul>
							<div class="tab-content" id="monsterData">
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
						</div>
					</div>

				</div>
			</div>

			<div id="dummyData" style="display: none;">
				<div class="tab-pane" data-for="none">
					<div class="header lead">
						<span class="pull-left">Initiative: <span data-attr="initiative" class="roll_add_me" id="1A_init">20</span></span>
						<span class="pull-right">CR: <span data-attr="cr" id="1A_cr">20</span></span>
						<center>
							<span class="left"><i class="icon-backward"></i></span>

							<span data-attr="name" 	id="1A_name">Devourer</span>
							<span class="hp">		(<span data-attr="hit_dice" class="roll_me" id="1A_hp">40</span> hp)</span>

							<span class="right"><i class="icon-forward"></i></span>
						</center>
					</div>
					<hr class="clearfix" />
					<div class="grid">
						<ul class="sortable">
							<li class="draggable rollable stats">
								<span class="title">Stats</span>
								<hr />
							</li>
							<li class="draggable rollable skills">
								<span class="title">Skills</span>
								<hr />
							</li>
							<li class="draggable rollable cstats">
								<span class="title">Combat Stats</span>
								<hr />
							</li>
							<li class="draggable rollable attacks">
								<span class="title">Weapons &amp; (Full) Attacks</span>
								<hr />
							</li>
							<li class="draggable misc">
								<span class="title">Misc. Info.</span>
								<hr />
							</li>
							<li class="draggable speeds">
								<span class="title">Speeds</span>
								<hr />
							</li>
							<li class="draggable qualities">
								<span class="title">Qualities</span>
								<hr />
							</li>
							<li class="draggable armor">
								<span class="title">Armor, AC &amp; DR</span>
								<hr />
							</li>
							<li class="draggable feats">
								<span class="title">Feats</span>
								<hr />
							</li>
							<li class="draggable specials">
								<span class="title">Special Attacks</span>
								<hr />
							</li>
							<li class="draggable invisible"></li>
							<li class="draggable invisible"></li>
							<li class="draggable invisible"></li>
							<li class="draggable invisible"></li>
							<li class="draggable invisible"></li>
						</ul>
					</div>
				</div>
			</div>

			<div id="popup">
				<div id="popupLeft">
					<div id="simple">
						<div class="input-append input-prepend" id="filterSelectors">
							<label class="control-label add-on">Attribute:</label>

							<select id="filters" style="width: 150px;"></select>

							<select id="signChooser" class="numericOpt" style="width: 75px;">
								<option value=">">&gt;</option>
								<option value=">=">&gt;=</option>
								<option value="=">=</option>
								<option value="<=">&lt;=</option>
								<option value="<">&lt;</option>
							</select>

							<input type="number" id="numberInput" class="numericOpt" style="width: 50px;" placeholder="####" />

							<select class="joinOpt" id="joinSelect" style="width: 139px; display: none;"></select>
							
							<input type="text" id="autocompleteName" class="nameOpt" style="width: 159px; display: none;" placeholder="Enter a name..." />
							<button class="btn btn-primary numericOpt joinOpt" id="newFilter" type="button">+</button>
						</div>
						<div id="filterContainer">
							<table id="filterTable">
								<tr data-attr="Version">
									<td>
										<span class="label filter-label">Version</span>
									</td>
									<td>
										<div id="Version_filters" data-attr="Version" class="inner-filter-container">
											<span class="badge badge-info Version-filter" data-value="3.5" style="box-shadow: rgb(255, 0, 0) 0px 0px 0px 0px;">3.5</span>
										</div>
									</td>
								</tr>
							</table>
						</div>
						<div id="leftPopupFooter">
							<center><button class="btn btn-primary" id="genButton">Generate</button></center>
						</div>
					</div>
					<div id="median">
						<div style="display: table; height: 100%">
							<div id="medianArrowContainer" title="More options">
								<i id="extraToggle" class="icon-arrow-right"></i>
							</div>
						</div>
					</div>
				</div>
				<div id="extra">
					extra stuff
				</div>
			</div>
		</div>
		<?php } else { ?>
		<div class="pagination-centered hero-unit">
			You need to be logged in to use this tool.
		</div>
		<?php } ?>
		<?php include('../include/foot.php'); ?>
	</body>
</html>