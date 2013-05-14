
var monsterCount = 0;
var tempMon;

var monsters = {};

function addNewMonster(monster) {

	$(".alert").hide();
	$("#monsterList").show();

	var uid = new Date().getTime();

	_addNewMonster(monster, uid)

	_hidePopup();

	saveMonsters();

	return uid;

}

function _addNewMonster(monster, uid, name) {

	var $li = $("<li/>");

	var realName = monster == null ? name : monster.data[0].name;

	var $a = $("<a/>", {
		href: "#" + uid
	}).html("[<span class='logCount'>" + (++monsterCount) + "</span>] " + realName).attr('data-toggle', 'tab').attr('data-uid', uid);

	$a.appendTo($li);

	//TODO make a 'getHpStatus' function or call modifyHp 0, 0
	$a.attr('class', 'hp-good');

	var newHtml = $("#dummyData").html();
	$("#monsterData").append(newHtml);

	var $parent = $(".tab-pane[data-for='none']").not("#dummyData > [data-for='none']");

	$parent.attr('id', uid);
	$parent.attr('data-for', uid);

	$parent.find("*[id*='1A']").each(function () {
		$(this).attr('id', $(this).attr('id').replace('1A', uid));
	});

	$parent.find("*[data-uid*='1A']").each(function () {
		$(this).attr('data-uid', $(this).attr('data-uid').replace('1A', uid));
	});

	if (!(uid in monsters)) {
		monsters[uid] = new MonsterModel(uid, monster);
	}
	ko.applyBindings(monsters[uid], $$(uid)[0]);

	setUpHp(uid);

	var nice = $('#monsterList').niceScroll({ horizrailenabled: false, zindex: 9, railoffset: { left: -118 } });
	$('#monsterList').css('overflow', 'hidden');

	tabChangeScrollbars();

	setupRollables($parent);

	limitFeatNums(uid);

	var newLog = $("#dummyLog").html();
	$("#curMon").append(newLog);

	var $pLog = $(".log[data-for='none']").not("#dummyLog > [data-for='none']");
	$pLog.attr('id', uid + "_log").attr('data-for', uid);

	$li.appendTo($("#monsterList"));

	$a.tab('show');
	sortMonsters();
}

function sortMonsters() {
	var mylist = $('#monsterList');
	var listitems = mylist.children('li').get();
	listitems.sort(function (a, b) {
		var left = parseInt($("#" + $(a).children("a").attr('data-uid') + "_init").text());
		var right = parseInt($("#" + $(b).children("a").attr('data-uid') + "_init").text());
		return right - left;
	});
	$.each(listitems, function (idx, itm) { mylist.append(itm); });
}

function buildACInfo(mon, attr) {
	var acInfo = getACArr(mon, attr);
	if (acInfo == null) return "";
	return _arrToTooltip(acInfo);
}

function getACArr(mon, attr) {
	switch (attr) {
		case "ac": return getAc(mon); break;
		case "flatfoot_ac": return getFlatac(mon); break;
		case "touch_ac": return getTouchac(mon); break;
		default: return null;
	}
	return null;
}

function refreshAc($node) {
	var arr = $.parseJSON($node.attr('data-ac'));
	var val = _rollArray(arr);
	$node.empty();
	var $a = $("<a/>").text(val.result).attr('href', '#').attr('rel', 'tooltip')
		.addClass('has-tooltip reg-has-tt').attr('title', val.text);
	$node.append($a);
	manualTooltip($a);
}

function addDataToMonster($parent, monster, uid) {

	var root = monster.data[0];

	//all of the base attributes in the data object
	$parent.find("*[id*='1A']").each(function () {
		var attr = $(this).attr('data-attr');
		$(this).attr('id', $(this).attr('id').replace('1A', uid));
		$(this).attr('data-uid', uid);
		if (root.hasOwnProperty(attr)) {
			var val = root[attr] == '0' && $(this).hasClass('dashable') ? '--' : root[attr] + ($(this).hasClass('ftable') ? 'ft' : '');
			if (attr == 'cr') {
				if (root[attr] < 1) {
					switch (root[attr]) {
						case '0.25': return $("<div/>").html("&frac14;").text();
						case '0.33': return $("<div/>").html("&frac13;").text();
						case '0.50': return $("<div/>").html("&frac12;").text();
					}
				} else
					$(this).text(parseInt(root[attr]));
			} else if (attr == 'ac' || attr.indexOf('_ac') != -1) {
				$(this).attr("data-ac", JSON.stringify(getACArr(monster, attr)));
				refreshAc($(this));
			} else if (attr == 'grapple') {
				var $this = $(this);
				$("#" + uid + "_mfeat_table .loaded").livequery(function () {
					var grapple = parseInt(val);
					if (hasFeat(uid, "Racial Grapple Bonus"))
						grapple += 4;
					if (hasFeat(uid, "Improved Grapple"))
						grapple += 4;
					$this.text(grapple);
				});
			} else
				$(this).text(val);
			$(this).attr('data-base-value', $(this).text());
			determineRoll($(this));
		}
	});

	$parent.find(".stats tr").each(function () {
		var stat = $(this).children("td").eq(1).text();
		var num = get_bonus(stat);
		$(this).children("td").eq(1).text(stat + (stat != '--' ? " (" + (num < 0 ? num : "+" + num) + ")" : ''));
		$(this).attr('data-roll', JSON.stringify({ Base: "1d20", Bonus: num }));
		$(this).attr('data-roll-for', $(this).children("td").eq(0).text());
	});

	$parent.find(".cstats tr").each(function () {
		var num = parseInt($(this).children("td").eq(1).text());
		$(this).attr('data-roll', JSON.stringify({ Base: "1d20", Bonus: num }));
		$(this).attr('data-roll-for', $(this).children("td").eq(0).text().trim());
	});

	for (var prop in monster) {
		if (prop != 'data' && isNaN(parseInt(prop))) {
			var $table = $("#" + uid + "_" + prop + "_table");
			if ($table.length == 0 || monster[prop].length == 0) continue;
			appendToTable($table, root.name, prop, monster[prop]);
			$table.append("<tr class='loaded' style='display: none;'></tr>");
		}
	}

	var nameTooltip = root.size + " " + root.category;
	if (monster.msubcat.length > 0) {
		var subcats = [];
		$.each(monster.msubcat, function (i, e) {
			subcats.push(e.subcategory);
		});
		if (subcats.length > 0)
			nameTooltip += " (" + subcats.join(', ') + ")";
	}
	$("#" + uid + "_name").attr('title', nameTooltip).tooltip();

	setUpHp($parent, uid);
	rollInit($("#" + uid + "_init"));
}

function setUpHp(uid) {
	var popover = $("#dummyModifiable").html();
	popover = popover.split("1A").join(uid);
	$("#health_" + uid).popover({
		html: true,
		placement: 'bottom',
		content: popover,
		title: "Modify HP"
	}).click(function () {
		$(".modify-hp").click(function () {
			var modHp = parseInt($$(uid + "_hp_mod").val());
			if ($(this).hasClass('subtract')) {
				modifyHp(uid, -modHp);
			} else {
				modifyHp(uid, modHp);
			}
		});
	});
}

function appendToTable($table, monsterName, attr, arr) {
	if (attr != 'mmove')
		$table.empty();

	var uid = $table.attr('data-uid');

	$.each(arr, function (i, obj) {
		if (obj.name == 'Racial Grapple Bonus') return;
		if (((attr == 'mskill' || attr == 'mfeat' || attr == 'mqualit') && obj.name.indexOf('No ') != -1) || (attr == 'mattack' && obj.aname.indexOf('No ') != -1)) {
			$table.append('<tr class="no-data"><td>None</td></tr>');
			return;
		}
		if (obj.hasOwnProperty("is_melee") && obj.hasOwnProperty("is_ranged") && obj.hasOwnProperty("wname") && obj.is_melee == "1" && obj.is_ranged != "0") {

			var oldName = obj.wname.trim();
			var range = obj.is_ranged;

			obj.wname = oldName + " (Melee)";
			obj.is_ranged = "0";
			_createRow($table, monsterName, attr, arr, i, obj, uid);

			obj.is_ranged = range;
			obj.is_melee = "0";
			obj.wname = oldName + " (Ranged)";
			_createRow($table, monsterName, attr, arr, i, obj, uid);
		} else if (obj.hasOwnProperty("is_multi_handed") && obj.is_multi_handed == "1") {
			var oldName = obj.wname.trim();

			obj.is_one_handed = "1";
			obj.wname = oldName + " (1H)";
			_createRow($table, monsterName, attr, arr, i, obj, uid);

			var newObject = jQuery.extend(true, {}, obj);

			newObject.is_one_handed = "0";
			newObject.wname = oldName + " (2H)";
			_createRow($table, monsterName, attr, arr, i, newObject, uid);
		} else {
			_createRow($table, monsterName, attr, arr, i, obj, uid);
		}
	});

	$table.find("td.has-tooltip").each(function () {
		var text = $(this).text().trim();
		$(this).text('');
		$(this).prepend('<i class="icon-bookmark"></i><a href="#" rel="tooltip" title="' + $(this).attr('data-desc') + '">' + text + "</a>");
		manualTooltip($(this).find('a'));
	});

}

function manualTooltip($tt) {
	$tt.tooltip({ html: true, placement: 'bottom', trigger: 'manual' });

	$tt.click(function () {

		var $me = $(this);
		var doShow = true;

		$(".in").each(function () {
			if ($(this).siblings("a").is($me)) {
				doShow = false;
			}
			$(this).siblings("a").tooltip('hide');

		});
		if (doShow)
			$(this).tooltip('show');
	});
}

function _createRow($table, monsterName, attr, arr, i, obj, uid) {

	var $tr = $("<tr/>");
	$tr.appendTo($table);
	if (attr == 'mfeat') {
		$tr.attr('data-times-taken', obj.feat_level);
		$tr.attr('data-full-name', obj.name);
	}

	var range = '';
	var melee = '';

	var toHitRoll = rollable.hasOwnProperty(attr) ? rollable[attr](obj, uid, range, melee) : null;
	var attackRoll = attackRolls.hasOwnProperty(attr) ? attackRolls[attr](obj, uid, range) : null;

	if (toHitRoll) {

		$tr.attr('data-roll', '0');

		$("#" + uid + "_" + attr + "_table .loaded").livequery(function () {
			if (toHitRoll != '{}')
				$tr.attr('data-roll', toHitRoll);
			else
				$tr.unbind();
		});

		var rollFor = mainStat[attr](obj);
		if (rollFor.indexOf(monsterName) != -1) rollFor = rollFor.substring(monsterName.length).trim();
		$tr.attr('data-roll-for', rollFor);
		if (attr == 'mweapon' || attr == 'mattack' || attr == 'mspatk') {
			if (obj.spatk != null && obj.spatk.indexOf(monsterName) != -1) obj.spatk = obj.spatk.substring(monsterName.length + 1);
			$tr.attr('data-spatk', obj.spatk);
			range = obj.is_ranged;
			melee = obj.is_melee;
			$tr.attr('data-range', range);

			var minCrit = 0;

			if (obj.hasOwnProperty('critical')) {
				if (obj.critical.indexOf('-') != -1) {
					var critArr = obj.critical.split("-");
					$tr.attr('data-crit-mult', critArr[1].split("x")[1]);
					minCrit = parseInt(critArr[0]);
				} else if (obj.critical == '0') {
					minCrit = 20;
					$tr.attr('data-crit-mult', 2);
				} else if (obj.critical.indexOf("x") != -1) {
					minCrit = 20;
					$tr.attr('data-crit-mult', obj.critical.substring(1));
				} else {
					console.error("critical wasn't parseable: " + obj.critical + " " + obj.name);
				}
			}

			$("#" + uid + "_" + attr + "_table .loaded").livequery(function () {
				if (hasFeat(uid, "Improved Critical")) {
					minCrit = 21 - ((20 - minCrit + 1) * 2);
				}
				$tr.attr('data-min-crit', minCrit);
			});
		}
	}

	if (attackRoll && (obj.class_mult != null || attr == 'mspatk' || attr == 'mfatk')) {
		$tr.attr('data-attack-roll', '0');
		$("#" + uid + "_" + attr + "_table .loaded").livequery(function () {
			$tr.attr('data-attack-roll', attackRoll);
		});
	}

	$tr.attr('data-how-many', '1');
	if (attackRolls.hasOwnProperty(attr) && obj.how_many != null) {
		$tr.attr('data-how-many', obj.how_many);
	}

	if (attr == 'mfatk') {
		var spatkA = [], rangeA = [], critMultA = [], minCritA = [], howManyA = [],
			babUseA = [], secA = [], rollsA = [], nameA = [], atkCtA = [];
		$.each(obj, function (ind, e) {

			if (e.spatkname != null && e.spatkname.indexOf(monsterName) != -1) e.spatkname = e.spatkname.substring(monsterName.length + 1);

			babUseA.push(parseInt(e.is_uses_bab));

			spatkA.push(e.spatkname);

			secA.push(e.mfa_class_mult == "0.50" ? 1 : 0);

			if (e.wir)
				rangeA.push(e.wir);
			else
				rangeA.push(e.mfa_range);

			var minCrit = 0;

			e.critical = e.atkct || e.wct;
			if (!e.critical) e.critical = '0';

			e.how_many = e.atkhm || e.whm;
			if (!e.how_many) e.how_many = '1';

			nameA.push(e.wname || e.aname);

			howManyA.push(e.how_many);

			if (e.hasOwnProperty('critical')) {
				if (e.critical.indexOf('-') != -1) {
					var critArr = e.critical.split("-");
					critMultA.push(critArr[1].split("x")[1]);
					minCrit = parseInt(critArr[0]);
				} else if (e.critical == '0') {
					minCrit = 20;
					critMultA.push(2);
				} else if (e.critical.indexOf("x") != -1) {
					minCrit = 20;
					critMultA.push(e.critical.substring(1));
				} else {
					console.error("critical wasn't parseable: " + obj.critical + " " + obj.name);
				}
			}

			$("#" + uid + "_mfeat_table .loaded").livequery(function () {

				//critical
				if (hasFeat(uid, "Improved Critical")) {
					minCrit = 21 - ((20 - minCrit + 1) * 2);
				}
				minCritA.push(minCrit);
				$tr.attr('data-min-crit', JSON.stringify(minCritA));
			});

			if (e.is_uses_bab == "1") {
				var creatureBab = parseInt($("#" + uid + "_bab").text());
				var div = creatureBab / 5;
				var mod = creatureBab % 5;
				var attacks = Math.max(Math.floor(div) + (mod != 0 ? 1 : 0), 1);

				var bonusAttacks = 1;

				for (var i = 0; i < attacks; i++) {

					var roll = { damage: $.parseJSON(attackRoll)[ind], tohit: $.parseJSON(toHitRoll)[ind], refIndex: ind };

					//I tried renaming these variables and rearranging everything and it refused to work
					//this is actually taking away from the rolls to-hit
					if (bonusAttacks > 1)
						roll["damage"]["Attack " + (bonusAttacks)] = -(bonusAttacks - 1) * 5;

					if (secA[ind]) {
						if (i == 0)
							rollsA.push(roll);

						else if ((hasFeat(uid, "Greater Two-Weapon Fighting") ||
							hasFeat(uid, "Greater Multiweapon Fighting")) && bonusAttacks == 2) {

							rollsA.push(roll);
							bonusAttacks++;

						} else if ((hasFeat(uid, "Improved Two-Weapon Fighting") ||
							hasFeat(uid, "Improved Multiweapon Fighting")) && bonusAttacks == 1) {

							rollsA.push(roll);
							bonusAttacks++;
						}
					} else {
						rollsA.push(roll);
						bonusAttacks++;
					}
				}
				atkCtA.push(bonusAttacks);
			} else {
				var roll = { damage: $.parseJSON(attackRoll)[ind], tohit: $.parseJSON(toHitRoll)[ind], refIndex: ind };
				for (var i = 0; i < howManyA[ind]; i++)
					rollsA.push(roll);
			}
		});

		var fatk = {
			range: rangeA, spatk: spatkA, names: nameA,
			critMult: critMultA, howMany: howManyA, atkCt: atkCtA,
			minCrit: minCritA, secondary: secA, rolls: rollsA
		};

		$tr.attr('data-fatk', JSON.stringify(fatk));

		obj["descript"] = getFullAttackInfo(obj);
	}

	var inner = formatting[attr](obj);
	if (inner.indexOf(monsterName) != -1) inner = inner.substring(monsterName.length + 1);
	$tr.append("<td" + (obj.hasOwnProperty('descript') ? " class='has-tooltip' data-desc='" + obj.descript.split("\n").join("<br>") + "'" : "") + ">" + inner + "</td>");
}

function getFullAttackInfo(obj) {
	var ret = '';
	$.each(obj, function (i, e) {
		ret += (e.wname || e.aname) + ": " + (e.whd || e.atkhd) + " x" + (e.how_many) + "<br>";
	});
	return ret;
}