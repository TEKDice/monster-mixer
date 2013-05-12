function hasFeat(id, feat) {
	return hasNeedle(id, "mfeat", feat, "times-taken");
}

function fullFeatName(id, feat) {
	return hasNeedle(id, "mfeat", feat, "full-name");
}

function hasSkill(id, skill) {
	return hasNeedle(id, "mskill", skill);
}

function hasQuality(id, quality) {
	return hasNeedle(id, "mqualit", quality);
}

function hasNeedle(id, table, needle, returnVal) {
	var $table = $("#"+id+"_"+table+"_table");

	var hasNeedle = false;
	$table.find("td a").each(function() {
		if($(this).text().indexOf(needle) != -1) {
			if(returnVal != null) {
				hasNeedle = $(this).closest("tr").attr('data-'+returnVal);
			} else 
				hasNeedle = true;
			return;
		}
	});

	return hasNeedle;
}

function modifyHp(uid, mod, notLog) {
	if (isNaN(mod) || mod == 0) return;
	monsters[uid].hp.mod().relative(mod);

	var curHp = monsters[uid].hp.total();
	var maxHp = monsters[uid].hp.initTotal();
	var $monsterNode = $("[href=#" + uid + "]");
	var monsterName = $monsterNode.html();

	var hpPerc = Math.round((curHp/maxHp)*100);
	if(hpPerc < 15)		 $monsterNode.attr('class','hp-critical');
	else if(hpPerc < 50) $monsterNode.attr('class','hp-warning');
	else 				 $monsterNode.attr('class','hp-good');

	if(!notLog)
		addToLog(monsterName + (mod < 0 ? " lost " : " gained ") + Math.abs(mod) + " hp. ("+curHp+"/"+maxHp+") ["+hpPerc+"%]");

	saveMonsters();

	if(curHp <= 0) {		
		bootbox.confirm("It looks like "+$monsterNode.text()+" has died. Would you like to mark it as 'killed'?", function(result) {
			if(result)
				remove(uid, true);
		});
	}
}

function rollHp(uid, $rootNod, newHp, force) {

	var $rootNode = $("#"+uid+"_hp");

	var title = '';

	newHp = parseInt(newHp);

	if(newHp == 0) newHp = 1;
	title += $rootNode.attr('data-base-value')+": "+newHp+"<br>";

	var num;
	if(num = hasFeat(uid, "Toughness")) {
		num = 3*parseInt(num);
		title += "Toughness: "+num+"<br>";
	}

	var con = get_bonus(parseInt($("#"+uid+"_con").text())) * parseInt($rootNode.attr('data-base-value').split('d')[0]);
	if(con != 0)
		title += "CON Modifier: "+con+"<br>";

	title = title.slice(0, -4);

	$rootNode.attr('data-initial-roll', newHp);
	newHp += con;
	newHp += num;
	$rootNode.attr('data-mod-value', con+num);
	$("#"+uid+"_hp").children(".hp_val").text(newHp);

	var attr = $("#"+uid+"_hp").children(".hp_val").attr('data-original-title');
	if (force || (typeof attr !== 'undefined' && attr !== false)) {
		$("#"+uid+"_hp").children(".hp_val").attr('data-original-title',title);
	} else {
		$("#"+uid+"_hp").children(".hp_val").attr('rel','tooltip').attr('title',title);
	}

	$("#"+uid+"_hp").children(".hp_val").tooltip({html: true, placement: 'bottom'});
}

function rollInit($node) {
	var roll = parseInt(rollExpression('1d20'));
	var uid = $node.attr('data-uid');
	_rollInit(uid, roll);
	
	sortMonsters();
}

function _rollInit(uid, roll) {

	var $node = $("#"+uid+"_init");
	var title = '';

	title += "1d20: "+roll+"<br>";

	var base = get_bonus(parseInt($("#"+uid+"_dex").attr('data-base-value')));
	title += "Modifier: "+base+"<br>";

	var num=0;

	if(num = hasFeat($node.attr('data-uid'), "Improved Initiative")) {
		num = 4*parseInt(num);
		title += "Improved Initiative: "+num+"<br>";
	}

	$node.attr('data-initial-value', roll);
	$node.text(base+roll+num);
	$node.attr('rel','tooltip').attr('title',title).attr('data-original-title', title);
	$node.tooltip({html: true, placement: 'bottom'});
}

function remove(uid, killed) {
	var $node = $("#monsterList a[href='#"+uid+"']");
	var pos = parseInt($node.find('.logCount').text());

	var count = 0;

	$("#monsterList li").each(function(i, e) {
		count++;
	});
	
	var $a = $("#monsterList li a").first();

	_showScrollbars($a);
	$a.tab('show');

	if (count > 0) {
		console.log(pos);
		$a = $("#monsterList li:nth-child("+(pos-1)+")").find("a");
		_showScrollbars($a);
		$a.tab('show');
	} else {
		if(killed) {
			$("#winAlert").show();
		} else {
			$("#genAlert").show();
		}
		$("#monsterList").hide();
	}

	$node.parent().remove();
	$(".tab-pane[data-for='" + uid + "']").remove();
	$("div[data-nice-uid='" + uid + "']").hide();
	$("#" + uid + "_log").remove();

	saveMonsters();

	updateLogNumbers(uid, killed);
}

function updateLogNumbers(uid, killed) {
	$("#allInfo div p span.logCount").each(function(i,e){
		var uid = $(this).closest('[data-uid]').attr('data-uid');

		if($(this).text() == 'DEAD' || $(this).text() == 'GONE');

		var $monNode = $("#monsterList a[href='#"+uid+"']");

		if($monNode.length == 0) {
			$(this).text(killed ? 'DEAD' : 'GONE');
		} else {
			//$(this).text($monNode.find('.logCount').text());
		}
	});
}