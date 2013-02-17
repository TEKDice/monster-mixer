

function addNewMonster(monster) {
	$(".alert").hide();
	$("#monsterList").show();

	var uid = new Date().getTime();

	var $li = $("<li/>");
	$li.appendTo($("#monsterList"));

	var $a = $("<a/>",{
		href: "#"+uid
	}).html("[<span class='logCount'>"+$("#monsterList").children().size()+"</span>] "+monster.data[0].name).attr('data-toggle','tab').attr('data-uid', uid);

	$a.appendTo($li);

	var newHtml = $("#dummyData").html();
	$("#monsterData").append(newHtml);

	var $parent = $(".tab-pane[data-for='none']").not("#dummyData > [data-for='none']");

	$parent.attr('id', uid);
	$parent.attr('data-for', uid);

	addDataToMonster($parent, monster, uid);

	$('#monsterList').niceScroll({horizrailenabled: false, zindex:9});
	$('#monsterList').css('overflow','hidden');

	tabChangeScrollbars();

	rollableRowHighlighting($parent);

	setupRollables($parent);

	var newLog = $("#dummyLog").html();
	$("#curMon").append(newLog);

	var $pLog = $(".log[data-for='none']").not("#dummyLog > [data-for='none']");
	$pLog.attr('id', uid+"_log").attr('data-for', uid);

	$a.tab('show');

	saveMonsters();

	return uid;
}

function addDataToMonster($parent, monster, uid) {

	var root = monster.data[0];

	//all of the base attributes in the data object
	$parent.find("*[id*='1A']").each(function() {
		var attr = $(this).attr('data-attr');
		$(this).attr('id', $(this).attr('id').replace('1A', uid));
		$(this).attr('data-uid', uid);
		if(root.hasOwnProperty(attr)) {
			var val = root[attr] == '0' && $(this).hasClass('dashable') ? '--' : root[attr] + ($(this).hasClass('ftable') ? 'ft' : '');
			if(attr == 'cr') {
				if(root[attr] < 1) {
					switch(root[attr]) {
						case '0.25': $(this).html($("<div/>").html("&frac14;").text()); break;
						case '0.33': $(this).html($("<div/>").html("&frac13;").text()); break;
						case '0.50':  $(this).html($("<div/>").html("&frac12;").text()); break;
					}
				} else 
					$(this).text(parseInt(root[attr]));
			} else 
				$(this).text(val);
			$(this).attr('data-base-value',$(this).text());
			determineRoll($(this));
		}
	});

	$parent.find(".stats tr").each(function() {
		var stat = $(this).children("td").eq(1).text();
		var num = get_bonus(stat);
		$(this).children("td").eq(1).text(stat + (stat != '--' ? " ("+(num < 0 ? num : "+"+num) + ")" : ''));
		$(this).attr('data-roll', JSON.stringify({Base: "1d20", Bonus:num}));
		$(this).attr('data-roll-for', $(this).children("td").eq(0).text());
	});

	$parent.find(".cstats tr").each(function() {
		var num = parseInt($(this).children("td").eq(1).text());
		$(this).attr('data-roll', JSON.stringify({Base: "1d20", Bonus:num}));
		$(this).attr('data-roll-for', $(this).children("td").eq(0).text());
	});

	for(var prop in monster) {
		if(prop!='data' && isNaN(parseInt(prop))) {
			var $table = $("#"+uid+"_"+prop+"_table");
			if($table.length == 0 || monster[prop].length == 0) continue;
			appendToTable($table, root.name, prop, monster[prop]);
			$table.append("<tr class='loaded' style='display: none;'></tr>");
		}
	}

	var nameTooltip = root.size + " " + root.category;
	if(monster.msubcat.length > 0) {
		var subcats = [];
		$.each(monster.msubcat, function(i, e) {
			subcats.push(e.subcategory);
		});
		if(subcats.length > 0)
			nameTooltip += " ("+subcats.join(', ')+")";
	}
	$("#"+uid+"_name").attr('title', nameTooltip).tooltip();

	setUpHp($parent, uid);
	rollInit($("#"+uid+"_init"));
}

function setUpHp($parent, uid) {
	$hpNode = $parent.find("span[data-attr='hit_dice']");
	var hp = $hpNode.attr('data-initial-roll');
	$hpNode.text('');
	$hpNode.append("<span class='hp_val' data-for='hp'></span>");
	rollHp(uid, $hpNode, hp);
	$hpNode.append('<i id="health_'+uid+'" class="icon-heart"></i>');
	var popover = $("#dummyModifiable").html();
	popover = popover.split("1A").join(uid);
	$("#health_"+uid).popover({
		html: true,
		placement: 'bottom',
		content: popover,
		title: "Modify HP"
	}).click(function() {
		$(".modify-hp").click(function() {
			var uid = $(this).attr('data-uid');
			var modHp = parseInt($("#"+uid+"_hp_mod").val());
			if($(this).hasClass('subtract')) {
				modifyHp(uid, -modHp);
			} else {
				modifyHp(uid, modHp);
			}
		});
	});
}

function appendToTable($table, monsterName, attr, arr) {
	if(attr!='mmove')
		$table.empty();

	var uid = $table.attr('data-uid');

	$.each(arr, function(i, obj) {
		if( ((attr=='mskill' || attr=='mfeat' || attr=='mqualit') && obj.name.indexOf('No ')!=-1) || (attr=='mattack' && obj.aname.indexOf('No ')!=-1) ) {
			$table.append('<tr class="no-data"><td>None</td></tr>');
			return;
		}
		if(obj.hasOwnProperty("is_melee") && obj.hasOwnProperty("is_ranged") && obj.hasOwnProperty("wname") && obj.is_melee == "1" && obj.is_ranged != "0") {

			var oldName = obj.wname.trim();
			var range = obj.is_ranged;

			obj.wname = oldName + " (Melee)";
			obj.is_ranged = "0";
			_createRow($table, monsterName, attr, arr, i, obj, uid);

			obj.is_ranged = range;
			obj.is_melee = "0";
			obj.wname =  oldName + " (Ranged)";
			_createRow($table, monsterName, attr, arr, i, obj, uid);

		} else {
			_createRow($table, monsterName, attr, arr, i, obj, uid);
		}
	});

	$table.find("td.has-tooltip").each(function() {
		var text = $(this).text().trim();
		$(this).text('');
		$(this).prepend('<i class="icon-bookmark"></i><a href="#" rel="tooltip" title="'+$(this).attr('data-desc')+'">'+text+"</a>");
		$(this).find('a').tooltip({html: true, placement: 'bottom', trigger: 'manual'});

		$(this).find('a').click(function() {

			var $me = $(this);
			var doShow = true;

			$(".in").each(function() {
				if($(this).siblings("a").is($me)) {
					doShow = false;
				}
				$(this).siblings("a").tooltip('hide');

			});
			if(doShow)
				$(this).tooltip('show');
		});
	});

}

function _createRow($table, monsterName, attr, arr, i, obj, uid) {

	var $tr = $("<tr/>");
	$tr.appendTo($table);
	if(attr == 'mfeat') {
		$tr.attr('data-times-taken',obj.feat_level);
		$tr.attr('data-full-name',obj.name);
	}

	var range = '';
	var melee = '';
	
	if(rollable.hasOwnProperty(attr))  {

		$tr.attr('data-roll', '0');

		$("#"+uid+"_"+attr+"_table .loaded").livequery(function() {
			var roll = rollable[attr](obj, uid, range, melee);
			if(roll != '{}')
				$tr.attr('data-roll', roll);
			else
				$tr.unbind();
		});

		var rollFor = mainStat[attr](obj);
		if(rollFor.indexOf(monsterName) != -1) rollFor = rollFor.substring(monsterName.length);
		$tr.attr('data-roll-for', rollFor);
		if(attr == 'mweapon' || attr == 'mattack') {
			range = obj.is_ranged;
			melee = obj.is_melee;
			$tr.attr('data-range', range);

			var minCrit = 0;

			if(obj.critical.indexOf('-') != -1) {
				var critArr = obj.critical.split("-");
				$tr.attr('data-crit-mult', critArr[1].split("x")[1]);
				minCrit = parseInt(critArr[0]);
			} else if(obj.critical == '0'){
				minCrit = 20;
				$tr.attr('data-crit-mult', 1);
			} else if(obj.critical.indexOf("x") != -1) {
				minCrit = 20;
				$tr.attr('data-crit-mult', obj.critical.substring(1));
			} else {
				console.warn("critical wasn't parseable: "+obj.critical);
			}

			$("#"+uid+"_"+attr+"_table .loaded").livequery(function() {
				if(hasFeat(uid, "Improved Critical")) {
					var name = fullFeatName(uid, "Improved Critical");
					var atk = name.substring(name.indexOf("(")+1, name.indexOf(")"));
					if(obj.aname != undefined) {
						if(atk.toLowerCase() == obj.aname.toLowerCase())
							minCrit = 21 - ((20 - minCrit + 1) * 2);
					}
					if(obj.wname != undefined) {
						if(atk.toLowerCase() == obj.wname.toLowerCase())
							minCrit = 21 - ((20 - minCrit + 1) * 2);
					}
				}
				$tr.attr('data-min-crit', minCrit);
			});
		}
	}
	if(attackRolls.hasOwnProperty(attr)) {
		$tr.attr('data-attack-roll', '0');
		$("#"+uid+"_"+attr+"_table .loaded").livequery(function() {
			$tr.attr('data-attack-roll', attackRolls[attr](obj, uid, range));
		});
	}
	var inner = formatting[attr](obj);
	if(inner.indexOf(monsterName) != -1) inner = inner.substring(monsterName.length);
	$tr.append("<td"+(obj.hasOwnProperty('descript') ? " class='has-tooltip' data-desc='"+obj.descript.split("\n").join("<br>")+"'" : "")+">"+inner+"</td>");
}