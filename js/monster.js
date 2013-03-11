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
	if(mod == 0) return;
	var curHp = parseInt($("#"+uid+"_hp").children(".hp_val").text());

	var newHp = eval(curHp+mod);
	$("#"+uid+"_hp").children(".hp_val").text(newHp);

	var $monsterNode = $("[href=#"+uid+"]");
	var monsterName = $monsterNode.html();

	var maxHp = parseInt($("#"+uid+"_hp").attr('data-initial-roll')) + parseInt($("#"+uid+"_hp").attr('data-mod-value'));

	var text = $("#"+uid+"_hp").children(".hp_val").attr('data-original-title');
	if(text.indexOf("Modification")!=-1) {
		var newText = '';
		text = text.split("<br>");
		$.each(text, function(i, e) {
			if(e.indexOf("Modification")!=-1) {
				if((curHp+mod) == maxHp) return;
				var newMod = parseInt(e.split(" ")[1]);
				newText += "Modification: "+(mod+newMod);
			} else {
				newText += e;
			}
			if(i!=text.length-1)newText+="<br>";
		});
		$("#"+uid+"_hp").children(".hp_val").attr('data-original-title', newText);
	} else {
		$("#"+uid+"_hp").children(".hp_val").attr('data-original-title', text+"<br>Modification: "+(maxHp-curHp+mod));
	}

	var hpPerc = Math.round((newHp/maxHp)*100);
	if(hpPerc < 15)		 $monsterNode.attr('class','hp-critical');
	else if(hpPerc < 50) $monsterNode.attr('class','hp-warning');
	else 				 $monsterNode.attr('class','hp-good');

	if(!notLog)
		addToLog(monsterName + (mod < 0 ? " lost " : " gained ") + Math.abs(mod) + " hp. ("+newHp+"/"+maxHp+") ["+hpPerc+"%]");

	saveMonsters();

	if(newHp <= 0) {		
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
	var $node = $("#monsterList a[href=#"+uid+"]");
	var pos = parseInt($node.find('.logCount').text());

	$node.parent().remove();
	$(".tab-pane[data-for='"+uid+"']").remove();
	$("div[data-nice-uid='"+uid+"']").remove();
	$("#"+uid+"_log").remove();

	var count = 0;

	$("#monsterList li").each(function(i, e) {
		count++;
	});
	
	var $a = $("#monsterList li a").first();

	_showScrollbars($a);
	$a.tab('show');

	if(count > 0) {
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
		} else {0
			//$(this).text($monNode.find('.logCount').text());
		}
	});
}