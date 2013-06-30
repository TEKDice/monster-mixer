
<?php

define('readonly',true);
include_once('../include/database.php');
include_once('session_functions.php');

global $conn;

if(!isset($postObj)) $postObj = new stdClass();

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

?>

<!DOCTYPE html>
<html>
	<head>
		<title>TEKDice Monster Mixer</title>
		<?php $pos='../'; include('../include/head.php'); ?>
		<link href="../css/jquery-ui-1.10.0.custom.css" rel="stylesheet" />
		<link href="css/style.min.css" 		rel="stylesheet" />
		<link href="css/slider.css" 		rel="stylesheet" />
		<link href="css/1280x1024.min.css" 	rel="stylesheet" media="screen and (min-width: 1270px) and (min-height: 825px)" />
		<link href="css/1280x800.min.css" 	rel="stylesheet" media="screen and (min-width: 1270px) and (min-height: 715px)" />
		<link href="css/1366x768.min.css" 	rel="stylesheet" media="screen and (min-width: 1355px)" />
		<link href="css/1440x900.min.css" 	rel="stylesheet" media="screen and (min-width: 1430px)" />
		<link href="css/1600x900.min.css" 	rel="stylesheet" media="screen and (min-width: 1590px)" />
		<link href="css/1680x1050.min.css" 	rel="stylesheet" media="screen and (min-width: 1645px)" />

		<script src="../js/jquery-ui-1.9.2.custom.min.js"></script>
	<?php

        if(!is_dev())
            include_once('/var/www/forum/simplepie/mixer_feed.php');
            
            
		if(false) {//if(!is_dev()) {
	?>
		<script type="text/javascript" src="js/monster_generator.min.js"></script>
	<?php
		} else {
	?>
		<script type="text/javascript" src="js/monster_generator.js"></script>
	<?php } ?>
		<script type="text/javascript">
            var lastPostedUpdate = '<?=isset($postObj) ? json_encode($postObj) : '';?>';
			var cloudSessions = <?=getSessions();?>;
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
							<div class="tabbable tabs-left" id="monsterListCont" data-bind="with: monsterList">
								<ul class="nav nav-tabs" id="monsterList" data-bind="foreach: $parent.toArray()">
                                    <li>
                                        <a data-toggle="tab" data-bind="attr: {'href': '#'+$data.uid, 'data-uid': $data.uid}">
                                            <span class="logCount" data-bind="html: '['+(++monsterCount)+'] '+$data.stats.name(), attr: {'data-pos': monsterCount}"></span>
                                        </a>
                                    </li>
                                </ul>
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
							<button class="btn span2 offset10" data-toggle='modal' data-target="#statisticsModal"><span class='shorten-encounter'></span> Stats</button>
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

						<div id="log" class="tabbable" data-bind="with: logModel">
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
									<div id="allInfo" class="logHighlighter" data-bind="foreach: $parent.currentSessionMessages">
                                        <div data-bind="attr: {'class': 'logInner ' + $parent.generateIdForEntry($data), 'data-type': $data.type, 'data-bundle': $data.bundle}">
                                            <div class='attackSide'>
                                                <p data-bind="attr:{'class':'pull-left '+$data.type, 'data-uid': $data.uid}, html: $data.message"></p>
                                            </div>
                                            <div data-bind="attr: {'class': 'pull-right threat-status '+$data.type}"></div>
                                                
                                            <!-- ko if: $data.attack -->
                                                <br>
                                                <button class='btn btn-link pull-right' data-bind="attr: {'data-cleave-uid': $data.attack}">Cleave?</button>
                                            <!-- /ko -->
		                                    <div class='clearfix'></div>
                                        </div>
                                    </div>                                         
								</div>
								<div class="tab-pane" id="curTab">                 
									<div id="curMon" class="logHighlighter" data-bind="foreach: $parent.currentMonsterMessages">
                                        <div data-bind="attr: {'class': 'logInner ' + $parent.generateIdForEntry($data), 'data-type': $data.type, 'data-bundle': $data.bundle}">
                                            <div class='attackSide'>
                                                <p data-bind="attr:{'class':'pull-left '+$data.type, 'data-uid': $data.uid}, html: $data.message"></p>
                                            </div>
                                            <div data-bind="attr: {'class': 'pull-right threat-status '+$data.type}"></div>
                                                
                                            <!-- ko if: $data.attack -->
                                                <br>
                                                <button class='btn btn-link pull-right' data-bind="attr: {'data-cleave-uid': $data.attack}">Cleave?</button>
                                            <!-- /ko -->
		                                    <div class='clearfix'></div>
                                        </div>
									</div>    
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>

			<div id="dummyData" style="display: none;">
				<div class="tab-pane" data-for="none" data-bind="with: monsters.getMonster($element.id)">
					<div class="header lead" style="margin-bottom: 7px">
						<span class="pull-left">Initiative: <span class="reg-has-tt" data-uid="1A" id="1A_init" data-bind="text: $parent.initiative.totalInit(), bootstrapTooltip: {title: $parent.initiative.toolTip(), html: true, placement: 'bottom'}"></span></span>
						<span class="pull-right">CR: <span id="1A_cr" data-bind="text: $parent.formatCR($parent.monsterBaseStats['cr'])"></span>&nbsp;<i class='icon-trash delete' id="1A_remove" data-uid="1A"></i></span>
						<center>
							<span class="left"><i class="icon-backward"></i></span>

							<span id="1A_name" rel='tooltip' href='#' class='reg-has-tt' data-bind="text: $parent.monsterBaseStats['name'], bootstrapTooltip: {title: $parent.nameTooltip(),html: true, placement: 'bottom'}"></span>
							<span class="hp">
								(<span class="reg-has-tt" id="1A_hp" data-bind="text: $parent.hp.total(), bootstrapTooltip: {title: $parent.hp.toolTip(),html: true, placement: 'bottom'}"></span><i class="icon-heart" data-bind="attr: {id: 'health_'+$parent.uid}"></i> 
								hp)
							</span>

							<span class="right"><i class="icon-forward"></i></span>
						</center>
						<span style="display: none;" id="1A_size" data-bind="with: $parent.monsterBaseStats['size']"></span>
						<span style="display: none;" id="1A_id"></span>
					</div>
					<hr class="clearfix" style="margin: 0" />
					<div class="grid">
						<ul class="sortable">
							<li class="draggable rollable stats">
								<span class="title">Stats</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed" data-bind="with: $parent.stats">
										<tbody data-bind="foreach: ['str','dex','con','int','wis','cha']">
											<tr data-bind="attr: {'data-roll': $root.roller.rollStat($data)}">
												<td data-bind="text: $data.toUpperCase()"></td><td data-bind="text: $parent[$data].format()"></td>
											</tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable rollable cstats">
								<span class="title">Combat Stats</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed" data-bind="with: $parent.stats">
										<tbody>
											<!-- ko foreach: [{l:'fort',f:'Fortitude'},{l:'ref',f:'Reflex'},{l:'will',f:'Will'},{l:'cmb',f:'CMB'}] -->
											<tr data-bind="attr: {'data-roll': $root.roller.rollNonBasicStat($data.l, $data.f)}">
												<td data-bind="text: $data.f"></td><td data-bind="text: $parent[$data.l].base.val()"></td>
											</tr>
											<!-- /ko -->
											<tr class="unrollable">
												<td>CMD</td><td data-bind="text: $data.cmd.base.val()"></td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollNonBasicStat('grapple', 'Grapple')}">
												<td>Grapple</td><td data-bind="text: $data.grapple.calc()"></td>
											</tr>
											<tr class="unrollable">
												<td>Base Attack Bonus</td><td data-bind="text: $data.bab.base.val()"></td>
											</tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable rollable skills">
								<span class="title">Skills</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed" data-bind="with: $parent.skills">
										<tbody class="mskill" id="1A_mskill_table" data-bind="foreach: skills">
											<tr data-bind="attr: {'data-roll': $root.roller.rollSkill($data)}">
												<td>
													<!-- ko if: descript !== "" -->
													<i class="icon-bookmark"></i>
													<a href="#" rel="tooltip" data-bind="text: $parent.formatName($data), bootstrapTooltip: {title: $data.descript, html: true, placement: 'bottom', trigger: 'manual'}" ></a>
													<!-- /ko -->
													<!-- ko if: descript === "" -->
													None
													<!-- /ko -->
												</td>
												<td data-bind="text: $parent.formatNum($data)"></td>
											</tr>
										</tbody>
									</table>
								</div> 
							</li>
							<li class="draggable rollable attacks">
								<span class="title">Weapons &amp; Attacks</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed" data-bind="with: $parent.weapons">
										<caption>Weapons</caption>
										<tbody class="mweapon" id="1A_mweapon_table" data-bind="foreach: damagers">
											<tr data-bind="attr: {'data-roll': $root.roller.rollWeapon($data)}">
												<!-- ko if: descript !== "" -->
												<td data-bind="attr: {colspan: $parent.countColumns($data)}">
													<i class="icon-bookmark"></i>
													<a href="#" rel="tooltip" data-bind="text: $parent.formatName($data.wname), attr: {'data-tt': $data.descript}, bootstrapTooltip: {title: $data.descript, html: true, placement: 'bottom', trigger: 'manual'}" ></a>
												</td>
												<!-- /ko -->
												<!-- ko if: descript === "" -->
												<td class='unrollable'>None</td>
												<!-- /ko -->
												<!-- ko if: $data.hitdc != '0' -->
												<td data-bind="text: $data.hitdc">
												</td>
												<!-- /ko -->
												<!-- ko if: $data.dmgname != null -->
												<td data-bind="text: $parent.formatElemental($data)">
												</td>
												<!-- /ko -->
											</tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed" data-bind="with: $parent.attacks">
										<caption>Attacks</caption>
										<tbody class="mattack" id="1A_mattack_table" data-bind="foreach: damagers">
											<tr data-bind="attr: {'data-roll': $root.roller.rollAttack($data)}">
												<!-- ko if: descript !== "" -->
												<td data-bind="attr: {colspan: $parent.countColumns($data)}">
													<i class="icon-bookmark"></i>
													<a href="#" rel="tooltip" data-bind="text: $parent.formatName($data.aname), attr: {'data-tt': $data.descript}, bootstrapTooltip: {title: $data.descript, html: true, placement: 'bottom', trigger: 'manual'}" ></a>
												</td>
												<!-- /ko -->
												<!-- ko if: descript === "" -->
												<td class='unrollable'>None</td>
												<!-- /ko -->
												<!-- ko if: $data.hitdc != '0' -->
												<td data-bind="text: $data.hitdc">
												</td>
												<!-- /ko -->
												<!-- ko if: $data.dmgname != null -->
												<td data-bind="text: $parent.formatElemental($data)">
												</td>
												<!-- /ko -->
											</tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed" data-bind="with: $parent.fatks">
										<caption>Full Attacks</caption>
										<tbody class="mfatk" id="1A_mfatk_table" data-bind="foreach: fatks">
											<tr data-bind="attr: {'data-roll': $root.roller.rollFatk($data)}">
												<!-- ko if: $data[0] != undefined && $data[0].hasOwnProperty('aname') && $data[0].aname != 'None' -->
												<td>
													<i class="icon-bookmark"></i>
													<a href="#" rel="tooltip" data-bind="text: $parent.formatName($data), bootstrapTooltip: {title: $parent.toolTip($data), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
												</td>
												<!-- /ko -->
												<!-- ko if: $data[0] != undefined && $data[0].hasOwnProperty('aname') && $data[0].aname == 'None' -->
												<td class='unrollable'>None</td>
												<!-- /ko -->
											</tr>
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
												<td>Total AC</td>
												<td>
													<a id="1A_ac" rel='tooltip' href='#' data-bind="text: $parent.ac.total.sum(), bootstrapTooltip: {title: $parent.ac.total.toolTip(), html: true, placement: 'bottom'}"></a>
												</td>
											</tr>
											<tr>
												<td>Flatfoot AC</td>
												<td>
													<a id="1A_flatfoot_ac" rel='tooltip' href='#' data-bind="text: $parent.ac.flatfoot.sum(), bootstrapTooltip: {title: $parent.ac.flatfoot.toolTip(), html: true, placement: 'bottom'}"></a>
												</td>
											</tr>
											<tr>
												<td>Touch AC</td>
												<td>
													<a id="1A_touch_ac" rel='tooltip' href='#' data-bind="text: $parent.ac.touch.sum(), bootstrapTooltip: {title: $parent.ac.touch.toolTip(), html: true, placement: 'bottom'}"></a>
												</td>
											</tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed" data-bind="with: $parent.armor">
										<caption>Armor</caption>
										<tbody class="marmor" id="1A_marmor_table" data-bind="foreach: armors">
											<tr>
												<td>
													<!-- ko if: descript !== "" -->
													<i class="icon-bookmark"></i>
													<a href="#" rel="tooltip" data-bind="text: $data.aname, bootstrapTooltip: {title: $data.descript, html: true, placement: 'bottom', trigger: 'manual'}" ></a>
													<!-- /ko -->
													<!-- ko if: descript === "" -->
													None
													<!-- /ko -->
												</td>
											</tr>
										</tbody>
									</table>
									<table class="table table-striped table-condensed" data-bind="with: $parent.reductions">
										<caption>Damage Reductions</caption>
										<tbody class="mdmgred" id="1A_mdmgred_table" data-bind="foreach: dr">
											<tr>
												<td>
													<!-- ko if: reduction_amount !== -1 -->
													<span data-bind="text: $data.name"></span>
													<!-- /ko -->
													<!-- ko if: reduction_amount === -1 -->
													None
													<!-- /ko -->
												</td>
												<td data-bind="text: $parent.format($data.reduction_amount)"></td>
											</tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable misc">
								<span class="title">Misc. Info.</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed" data-bind="with: $parent.speeds">
										<caption>Speeds</caption>
										<tbody class="mmove" id="1A_mmove_table">
											<tr>
												<td>Base Speed</td><td id="1A_base_spd" class="ftable" data-bind="text: $parent.monsterBaseStats.base_spd+'ft'"></td>
											</tr>
											<!-- ko foreach: speeds -->
											<tr>
												<td data-bind="text: $data.movement_type">
												</td>
												<td data-bind="text: $data.movement_speed+'ft'">
												</td>
											</tr>
											<!-- /ko -->
										</tbody>
									</table>
									<table class="table table-striped table-condensed" data-bind="with: $parent.languages">
										<caption>Languages</caption>
										<tbody>
											<!-- ko foreach: languages -->
											<tr>
												<td data-bind="text: $data.language">
												</td>
											</tr>
											<!-- /ko -->
										</tbody>
									</table>
									<table class="table table-striped table-condensed" data-bind="with: $parent.stats">
										<caption>Misc</caption>
										<tbody>
											<tr>
												<td>Reach</td><td data-bind="text: $data.reach+'ft'" id="1A_reach" class="ftable"></td>
											</tr>
											<tr>
												<td>Space Taken</td><td data-bind="text: $data.space+'ft'" id="1A_space_taken" class="ftable"></td>
											</tr>
											<tr>
												<td>Treasure</td><td data-bind="text: $data.treasure" id="1A_treasure"></td>
											</tr>
										</tbody>
									</table>
								</div>
							</li>
							<li class="draggable qualities">
								<span class="title">Qualities</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed" data-bind="with: $parent.qualities">
										<tbody class="mqualit" id="1A_mqualit_table" data-bind="foreach: qualities">
											<tr>
												<td data-bind="attr: {colspan: $data.value!='0' ? 1 : 2}">
													<!-- ko if: descript !== "" -->
													<i class="icon-bookmark"></i>
													<a href="#" rel="tooltip" data-bind="text: $parent.formatName($data.name), bootstrapTooltip: {title: $data.descript, html: true, placement: 'bottom', trigger: 'manual'}"></a>
													<!-- /ko -->
													<!-- ko if: descript === "" -->
													None
													<!-- /ko -->
												</td>
												<!-- ko if: $data.value!='0' -->
												<td data-bind="text: $parent.format($data)">
												</td>
												<!-- /ko -->
											</tr>
										</tbody>
									</table>
								</div> 
							</li>
							<li class="draggable feats">
								<span class="title">Feats</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed" data-bind="with: $parent.feats">
										<tbody class="mfeat" id="1A_mfeat_table" data-bind="foreach: feats">
											<!-- ko if: $parent.canBeShown($data.name) -->
											<tr>
												<td data-bind="attr: {colspan: $parent.countColumns($data.name)}">
													<!-- ko if: descript !== "" -->
													<i class="icon-bookmark"></i>
													<a href="#" rel="tooltip" data-bind="text: $parent.format($data), bootstrapTooltip: {title: $data.descript, html: true, placement: 'bottom', trigger: 'manual'}" ></a>
													<!-- /ko -->
													<!-- ko if: descript === "" -->
													None
													<!-- /ko -->
												</td>
												<!-- ko if: $parent.hasCheckbox($data.name) -->
												<td class='sp'> 
													<input class="inline-checkbox" data-bind="attr: {'data-spfunc': $data.name, 'data-uid': $parent.uid, id: $root.formatSpName($data.name)}" type="checkbox" />
												</td>
												<!-- /ko -->
												<!-- ko if: $parent.hasNumber($data.name) -->
												<td class='sp'> 
													<input class="input-mini-inline applyNum" placeholder="#" data-bind="attr: {'data-spfunc': $data.name, 'data-uid': $parent.uid, id: $root.formatSpName($data.name)}" type="number" />
												</td>
												<!-- /ko -->
											</tr>
											<!-- /ko -->
										</tbody>
									</table>
								</div> 
							</li>
							<li class="draggable rollable specials">
								<span class="title">Special Attacks</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed" data-bind="with: $parent.spatks">
										<tbody class="mspatk" id="1A_mspatk_table" data-bind="foreach: spatks">
											<tr data-bind="attr: {class: $parent.decideRollable($data),'data-roll': $root.roller.rollSpatk($data)}">
												<td data-bind="attr: {colspan: $parent.countColumns($data)}">
													<!-- ko if: descript !== "" -->
													<i class="icon-bookmark"></i>
													<a href="#" rel="tooltip" data-bind="text: $parent.formatName($data.name), bootstrapTooltip: {title: $data.descript, html: true, placement: 'bottom', trigger: 'manual'}" ></a>
													<!-- /ko -->
													<!-- ko if: descript === "" -->
													None
													<!-- /ko -->
												</td>
												<!-- ko if: $data.hit_dice != '0' -->
												<td data-bind="text: $data.hit_dice">
												</td>
												<!-- /ko -->
												<!-- ko if: $data.dmgred_nm != null -->
												<td data-bind="text: $parent.formatElemental($data)">
												</td>
												<!-- /ko -->
											</tr>
										</tbody>
									</table>
								</div> 
							</li>
							<li class="draggable maneuvers rollable">
								<span class="title">Combat Maneuvers</span>
								<hr />
								<div class="minibox-content">
									<table class="table table-striped table-condensed">
										<tbody>
											<tr data-bind="attr: {'data-roll': $root.roller.rollBullrush()}">
												<td colspan="2">
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Bull Rush', bootstrapTooltip: {title: combatManeuverTooltipText('Bull Rush'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
											</tr>
											<tr class="unrollable">
												<td>    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Charge', bootstrapTooltip: {title: combatManeuverTooltipText('Charge'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
												<td class='sp'> 
													<input class="inline-checkbox" data-bind="attr: {'data-spfunc': 'Charge', 'data-uid': $root.uid, id: $root.formatSpName('Charge')}" type="checkbox" />
												</td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollDisarm()}">
												<td>    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Disarm', bootstrapTooltip: {title: combatManeuverTooltipText('Disarm'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
                                                <td>
													<input class="pull-right input-mini-inline applyNum" value="0" data-bind="attr: {'data-spfunc': 'Disarm', 'data-uid': $parent.uid, id: $root.formatSpName('Disarm')}" type="number" />
                                                </td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollFeint()}">
												<td colspan="2">    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Feint', bootstrapTooltip: {title: combatManeuverTooltipText('Feint'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollGrappleGrab()}">
												<td colspan="2">    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Grapple Grab', bootstrapTooltip: {title: combatManeuverTooltipText('Grapple Grab'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollOpposedGrapple()}">
												<td colspan="2">    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Opposed Grapple', bootstrapTooltip: {title: combatManeuverTooltipText('Opposed Grapple'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollOverrunAttack()}">
												<td colspan="2">    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Overrun Attack', bootstrapTooltip: {title: combatManeuverTooltipText('Overrun Attack'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollOverrunSave()}">
												<td colspan="2">    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Overrun Prone Save', bootstrapTooltip: {title: combatManeuverTooltipText('Overrun Save'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollSunder()}">
												<td>    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Sunder', bootstrapTooltip: {title: combatManeuverTooltipText('Sunder'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
                                                <td>
													<input class="pull-right input-mini-inline applyNum" value="0" data-bind="attr: {'data-spfunc': 'Sunder', 'data-uid': $parent.uid, id: $root.formatSpName('Sunder')}" type="number" />
                                                </td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollTripTouch()}">
												<td colspan="2">    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Trip Melee Touch', bootstrapTooltip: {title: combatManeuverTooltipText('Trip Melee Touch Attack'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
											</tr>
											<tr data-bind="attr: {'data-roll': $root.roller.rollTripStr()}">
												<td colspan="2">    
                                                    <i class="icon-bookmark"></i>
                                                    <a href="#" rel="tooltip" data-bind="text: 'Trip STR Check', bootstrapTooltip: {title: combatManeuverTooltipText('Trip STR Check'), html: true, placement: 'bottom', trigger: 'manual'}" ></a>
                                                </td>
											</tr>
											<tr class="loaded" style="display: none"><td></td></tr>
										</tbody>
									</table>
								</div>
							</li>
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
        
		<div id='statisticsModal' class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="session" aria-hidden="true" data-bind="with: statsModel">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
				<h3 id="totalDamageHeader">Encounter Statistics</h3>
			</div>
			<div class="modal-body">
                <h4 class="pagination-centered">Static Statistics</h4>
				<table class='table'>
					<tbody>
						<tr>
							<th>Average CR</th>
							<td data-bind="text: $parent.averageCR"></td>
						</tr>
						<tr>
							<th>Total Monsters</th>
							<td data-bind="text: $parent.monsterCount"></td>
						</tr>
					</tbody>
				</table>
                <h4 class="pagination-centered">Dynamic Statistics</h4>
				<table class='table'>
					<thead><tr><th></th><th>Total</th><th>Average</th></tr></thead>
					<tbody>
						<tr>
							<th>Taken</th>
							<td data-bind="text: $parent.totalDamageTaken"></td>
							<td data-bind="text: $parent.formatAverageDamageTaken"></td>
						</tr>
						<tr>
							<th>Dealt</th>
							<td data-bind="text: $parent.totalDamageGiven"></td>
							<td data-bind="text: $parent.formatAverageDamageGiven"></td>
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
		<div class="container">
			<div class="pagination-centered hero-unit" id="logInHero">
				You need to be logged in to use this tool.
			</div>
		</div>
		<?php } ?>
		<?php include('../include/foot.php'); ?>
	</body>
</html>