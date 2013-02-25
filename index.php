
<?php
define('readonly',true);

include('../include/database.php');

global $conn;
	
$filterNamesArr = run_query_arr($conn, "select name,is_numeric,sql_name,join_table,join_table_col,link_table from GeneratorFilters order by name");
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
	$query = "select id,name from Monster where (hidden is null or hidden = 0) and name != '@____'";
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

function is_dev() {
	$parsedUrl = parse_url($_SERVER['HTTP_HOST']);

	$host = explode('.', $parsedUrl['path']);

	return $host[0] != 'tekdice';
}

?>

<!DOCTYPE html>
<html>
	<head>
		<title>TEKDice Monster Mixer</title>
		<?php $pos='../'; include('../include/head.php'); ?>
		<link href="../css/jquery-ui-1.10.0.custom.css" rel="stylesheet" />
		<link href="min/style.min.css" 		rel="stylesheet" />
		<link href="min/1280x1024.min.css" 	rel="stylesheet" media="screen and (min-width: 1019px) and (min-height: 1024px)" />
		<link href="min/1280x800.min.css" 	rel="stylesheet" media="screen and (min-width: 1270px) and (min-height: 800px)" />
		<link href="min/1366x768.min.css" 	rel="stylesheet" media="screen and (min-width: 1356px)" />
		<link href="min/1440x900.min.css" 	rel="stylesheet" media="screen and (min-width: 1430px)" />
		<link href="min/1680x1050.min.css" 	rel="stylesheet" media="screen and (min-width: 1645px)" />

		<script src="../js/jquery-ui-1.9.2.custom.min.js"></script>
		<script src="min/jquery.boxshadow.min.min.js"></script>
		<script src="min/jquery.nicescroll.min.min.js"></script>
		<script src="min/jquery.livequery.min.min.js"></script>
		<script src="min/bootbox.min.min.js"></script>
		<script src="min/jquery.cookie.min.js"></script>
		<script src="min/dateformat.min.js"></script>
		<script src="min/jquery.async.loops.min.js"></script>

		<script src="min/serverfunctions.min.js"></script>
		<script src="min/log.min.js"></script>
		<script src="min/init.ui.min.js"></script>
		<script src="min/init.monster.min.js"></script>
		<script src="min/init.globals.min.js"></script>
		<script src="min/init.filters.min.js"></script>
		<script src="min/attack.min.js"></script>
		<script src="min/roll.min.js"></script>
		<script src="min/monster.min.js"></script>
		<script src="min/storage.min.js"></script>
		<script src="min/sync.min.js"></script>
		<script src="min/init.min.js"></script>

		<script type="text/javascript">
			var filterData = <?=json_encode($filterNames);?>;
			var autocompleteList = <?=json_encode(build_autocomplete());?>;
		</script>
	</head>
	<body>
		<?php include('../include/body.php'); ?>
		<!--[if IE]>
		<div class="hero-unit pagination-centered" id="ie">
			It looks like you're using Internet Explorer. I apologise, but this application does not support Internet Explorer. It works best in Mozilla Firefox or Google Chrome- please consider getting one of those two browsers.
		</div>
		<![endif]-->
		<noscript>
			<div class="hero-unit pagination-centered">
				It looks like your browser doesn't have javascript enabled or supported. This applications makes heavy usage of javascript, so at the present time, there isn't a version available without javascript.
			</div>
		</noscript>
		<script type="text/javascript">
			var loggedIn = <?=isLoggedIn() ? 1 : 0;?>;
		</script>
		<?php
		if(isLoggedIn()) {
		?>
		<div id="hasScript">
			<center><div id="showFilters"><i id="filterIcon" class="icon-arrow-down"></i></div></center>
			<div class="container-fluid" id="mainContainer">
				<div class="row-fluid" id="main">
					<div class="span9" id="monstersContainer">
						<div class="row-fluid">
							<div class="tabbable tabs-left" id="monsterListCont">
								<ul class="nav nav-tabs" id="monsterList"></ul>
								<div class="tab-content" id="monsterData">
									<div class="alert" id="genAlert">
										<strong>Hey!</strong> You should click the arrow above this to generate some monsters.
									</div>
									<div class="alert alert-success" style="display: none;" id="winAlert">
										<strong>Congratulations!</strong> To your players, that is.
									</div>
								</div>
							</div>
						</div>
						<div id="encounterStats" class="row-fluid">
								<button class="btn span2">Encounter CR</button>
								<button class="btn span2"><span class='shorten-average'></span> Level</button>
								<button class="btn span2" data-toggle='modal' data-target="#damageStatisticsModal"><span class='shorten-damage'></span> Stats</button>
								<button class="btn span2"><span class='shorten-average'></span> <span class='shorten-damage'></span> Taken</button>
								<button class="btn span2"><span class='shorten-total'></span> <span class='shorten-damage'></span> Dealt</button>
								<button class="btn span2"><span class='shorten-total'></span> <span class='shorten-damage'></span> Taken</button>
						</div>
					</div>

					<div class="span3" id="rightCol">
						<div id="customRoller">
							<div class="control-group" id="rollerContainer">
								<div class="controls">
									<div class="input-append">
										<div id="dice">
											<button class="btn btn-link span1">d4</button>
											<button class="btn btn-link span1">d6</button>
											<button class="btn btn-link span1">d8</button>
											<button class="btn btn-link span1">d10</button>
											<button class="btn btn-link span1">d12</button>
											<button class="btn btn-link span1">d20</button>
											<button class="btn btn-link span1">d100</button>
										</div>
										<div class='clearfix'></div>
										<input type="text" class="input-block-level" id="roll" placeholder="Custom roll..." />
									</div>
								</div>
							</div>
						</div>

						<div id="log" class="tabbable">
							<ul class="nav nav-tabs">
								<li class="active">
									<a href="#allTab" data-toggle="tab">All Info</a>
								</li>
								<li>
									<a href="#curTab" data-toggle="tab">Current Monster</a>                                                                
								</li>                                                        
							</ul>
							<div class="tab-content">
								<div class="tab-pane active" id="allTab">                    
									<div id="allInfo"></div>                                         
								</div>
								<div class="tab-pane" id="curTab">                 
									<div id="curMon">
									</div>    
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>

			<div id="dummyLog" style="display: none;">
				<div class="log" data-for="none">
				</div>
			</div>

			<div id="dummyData" style="display: none;">
				<div class="tab-pane" data-for="none">
					<div class="header lead" style="margin-bottom: 7px">
						<span class="pull-left">Initiative: <span data-attr="initiative" class="roll_add_me reg-has-tt" data-uid="1A" id="1A_init"></span></span>
						<span class="pull-right">CR: <span data-attr="cr" id="1A_cr"></span>&nbsp;<i class='icon-trash delete' id="1A_remove"></i></span>
						<center>
							<span class="left"><i class="icon-backward"></i></span>

							<span data-attr="name" 	id="1A_name" rel='tooltip' href='#' class='reg-has-tt'></span>
							<span class="hp">		(<span data-attr="hit_dice" class="roll_me reg-has-tt" id="1A_hp"></span> hp)</span>

							<span class="right"><i class="icon-forward"></i></span>
						</center>
						<span style="display: none;" id="1A_size" data-attr="size"></span>
						<span style="display: none;" id="1A_id" data-attr="m_id"></span>
					</div>
					<hr class="clearfix" style="margin: 0" />
					<div class="grid">
						<ul class="sortable">
							<li class="draggable rollable stats">
								<span class="title">Stats</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody>
											<tr>
												<td>STR</td><td data-attr="str" id="1A_str" class="dashable"></td>
											</tr>
											<tr>
												<td>DEX</td><td data-attr="dex" id="1A_dex" class="dashable"></td>
											</tr>
											<tr>
												<td>CON</td><td data-attr="con" id="1A_con" class="dashable"></td>
											</tr>
											<tr>
												<td>INT</td><td data-attr="int" id="1A_int" class="dashable"></td>
											</tr>
											<tr>
												<td>WIS</td><td data-attr="wis" id="1A_wis" class="dashable"></td>
											</tr>
											<tr>
												<td>CHA</td><td data-attr="cha" id="1A_cha" class="dashable"></td>
											</tr>
											<tr class="loaded" style="display: none"><td></td></tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable rollable skills">
								<span class="title">Skills</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody class="mskill" id="1A_mskill_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
								</div> 
							</li>
							<li class="draggable rollable cstats">
								<span class="title">Combat Stats</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody>
											<tr>
												<td>Fortitude</td><td data-attr="fort" id="1A_fort"></td>
											</tr>
											<tr>
												<td>Reflex</td><td data-attr="ref" id="1A_ref"></td>
											</tr>
											<tr>
												<td>Will</td><td data-attr="will" id="1A_will"></td>
											</tr>
											<tr>
												<td>Grapple</td><td data-attr="grapple" id="1A_grapple"></td>
											</tr>
											<tr>
												<td>CMB</td><td data-attr="cmb" id="1A_cmb"></td>
											</tr>
											<tr class="unrollable">
												<td>CMD</td><td data-attr="cmd" id="1A_cmd"></td>
											</tr>
											<tr class="unrollable">
												<td>Base Attack Bonus</td><td data-attr="base_atk" id="1A_bab"></td>
											</tr>
											<tr class="loaded" style="display: none"><td></td></tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable rollable attacks">
								<span class="title">Weapons &amp; Attacks</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<caption>Weapons</caption>
										<tbody class="mweapon" id="1A_mweapon_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed">
										<caption>Attacks</caption>
										<tbody class="mattack" id="1A_mattack_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed">
										<caption>Full Attacks</caption>
										<tbody class="mfatk" id="1A_mfatk_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
								</div> 
							</li>
							<li class="draggable misc">
								<span class="title">Misc. Info.</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<caption>Speeds</caption>
										<tbody class="mmove" id="1A_mmove_table">
											<tr>
												<td>Base Speed</td><td data-attr="base_spd" id="1A_base_spd" class="ftable"></td>
											</tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed">
										<caption>Misc</caption>
										<tbody>
											<tr>
												<td>Reach</td><td data-attr="reach" id="1A_reach" class="ftable"></td>
											</tr>
											<tr>
												<td>Space Taken</td><td data-attr="space_taken" id="1A_space_taken" class="ftable"></td>
											</tr>
											<tr>
												<td>Treasure</td><td data-attr="treasure" id="1A_treasure"></td>
											</tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable maneuvers">
								<span class="title">Combat Maneuvers</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody>
											<tr>
												<td>Bullrush</td>
											</tr>
											<tr>
												<td>Charge</td>
											</tr>
											<tr>
												<td>Disarm</td>
											</tr>
											<tr>
												<td>Feint</td>
											</tr>
											<tr>
												<td>Grapple</td>
											</tr>
											<tr>
												<td>Overrun</td>
											</tr>
											<tr>
												<td>Sunder</td>
											</tr>
											<tr>
												<td>Trip</td>
											</tr>
											<tr class="loaded" style="display: none"><td></td></tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable qualities">
								<span class="title">Qualities</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody class="mqualit" id="1A_mqualit_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
								</div> 
							</li>
							<li class="draggable armor">
								<span class="title">AC, Armor &amp; DR</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody>
											<tr>
												<td>Total AC</td><td data-attr="ac" id="1A_ac" rel='tooltip' href='#' class=''></td>
											</tr>
											<tr>
												<td>Flatfoot AC</td><td data-attr="flatfoot_ac" id="1A_flatfoot_ac" rel='tooltip' href='#' class=''></td>
											</tr>
											<tr>
												<td>Touch AC</td><td data-attr="touch_ac" id="1A_touch_ac" rel='tooltip' href='#' class=''></td>
											</tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed">
										<caption>Armor</caption>
										<tbody class="marmor" id="1A_marmor_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed">
										<caption>Damage Reductions</caption>
										<tbody class="mdmgred" id="1A_mdmgred_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable feats">
								<span class="title">Feats</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody class="mfeat" id="1A_mfeat_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
								</div> 
							</li>
							<li class="draggable rollable specials">
								<span class="title">Special Attacks</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody class="mspatk" id="1A_mspatk_table">
											<tr class="no-data"><td>None</td></tr>
										</tbody>
									</table>
								</div> 
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

			<div id="dummyModifiable" style="display: none;">
				<div id="1A_popover">
					<div class="input-append">
						<input type="number" class="input-small" id="1A_hp_mod" placeholder="####" />
						<button class="btn btn-primary modify-hp" data-uid='1A' id="1A_hp_button" type="button"><i class="icon-plus icon-white"></i></button>
						<button class="btn btn-primary modify-hp subtract" data-uid='1A' id="1A_hp_sub_button" type="button"><i class="icon-minus icon-white"></i></button>
					</div>
					<button class="btn btn-warning reroll-hp" data-uid='1A' id="1A_reroll_button" type="button">Reroll HP</button>
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
						<div class='popup-footer'>
							<center><button class="btn btn-primary" id="genButton" data-loading-text="Generating...">Generate</button></center>
						</div>
					</div>
					<div id="median">
						<div style="display: table; height: 100%">
							<div id="medianArrowContainer" title="More options">
								<i id="extraToggle" style="z-index: 17" class="icon-arrow-right"></i>
							</div>
						</div>
					</div>
				</div>
				<div id="extra">
					<h4 style="text-align: center;">Advanced Mode</h4>
					<div style="float: left; width: 50%">
						<h5 style="text-align: center;">Suggestions</h4>
						<div id="advGenContainer">
							<table id="advGenMonsters">
							</table>
						</div>
						<div class='popup-footer'>
							<center><button class="btn btn-primary" id="seeMoreButton" data-loading-text="Generate First!" data-generating-text="Creating...">Create These</button></center>
						</div>
					</div>
					<div style="float: right; width: 50%;">
						<h5 style="text-align: center;">Generated</h4>
						<div id="advGenFinalContainer">
							<table id="advGenFinal" class="table table-condensed">
							</table>
						</div>
						<div class='popup-footer'>
							<center><button class="btn btn-primary" id="finalAddButton" data-loading-text="Create First!" data-generating-text="Generating...">Add These</button></center>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id='damageStatisticsModal' class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true" >
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
				<h3 id="totalDamageHeader">Damage Statistics</h3>
			</div>
			<div class="modal-body">
				<table class='table'>
					<thead><tr><td></td><td>Total</td><td>Average</td></tr></thead>
					<tbody>
						<tr>
							<td>Taken</td>
							<td id="totalDamageTaken">0</td>
							<td id="averageDamageTaken">0</td>
						</tr>
						<tr>
							<td>Dealt</td>
							<td id="totalDamageDealt">0</td>
							<td id="averageDamageDealt">0</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="modal-footer">
				<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
			</div>
		</div>
		<div style="display: none; visibility: hidden">
			<div id="advGenTemplate">
				<div class='control-group'>
					<div class='controls'>
						<div class='input-prepend input-append'>
							<span class='add-on'><input type='checkbox' title="Check this if you want to include this monster in the generation process."/></span>
							<label class='control-label add-on monsterName'></label>
							<select title="The organization you want to generate through, if any."></select>
							<input class='input-mini-inline only-positive' type='number' placeholder='#' title="The number of base monsters you want to generate."/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="overlay">
			<img src="../images/loading.gif" id="img-load" />
		</div>
		<?php } else { ?>
		<div class="pagination-centered hero-unit" id="logInHero">
			You need to be logged in to use this tool.
		</div>
		<?php } ?>
		<?php include('../include/foot.php'); ?>
	</body>
</html>