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

function modifyHp(uid, mod) {
	var curHp = parseInt($("#"+uid+"_hp").children(".hp_val").text());
	$("#"+uid+"_hp").children(".hp_val").text(eval(curHp+mod));

	var monsterName = $("[href=#"+uid+"]").text();
	addToLog(monsterName + (mod < 0 ? " lost " : " gained ") + Math.abs(mod) + " hp.");

	var maxHp = parseInt($("#"+uid+"_hp").attr('data-initial-roll'));

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
}

function rollHp(uid, $rootNode, newHp) {

	var title = '';

	newHp = parseInt(newHp);

	if(newHp == 0) newHp = 1;
	title += $rootNode.attr('data-base-value')+": "+newHp+"<br>";

	var num;
	if(num = hasFeat(uid, "Toughness")) {
		num = 3*parseInt(num);
		newHp += num;
		title += "Toughness: "+num+"<br>";
		num = null;
	}

	var con = get_bonus(parseInt($("#"+uid+"_con").text())) * parseInt($rootNode.attr('data-base-value').split('d')[0]);
	newHp += con;
	if(con != 0)
		title += "CON Modifier: "+con;

	$("#"+uid+"_hp").children(".hp_val").text(newHp);
	$rootNode.attr('data-initial-roll', newHp);

	var attr = $("#"+uid+"_hp").children(".hp_val").attr('data-original-title');
	if (typeof attr !== 'undefined' && attr !== false) {
		$("#"+uid+"_hp").children(".hp_val").attr('data-original-title',title);
	} else {
		$("#"+uid+"_hp").children(".hp_val").attr('rel','tooltip').attr('title',title);
	}

	$("#"+uid+"_hp").children(".hp_val").tooltip({html: true, placement: 'bottom'});

}

function rollInit($node) {

	var title = '';

	var roll = parseInt(rollExpression('1d20'));
	title += "1d20: "+roll+"<br>";

	var uid = $node.attr('data-uid');
	var base = get_bonus(parseInt($("#"+uid+"_dex").attr('data-base-value')));
	title += "Modifier: "+base+"<br>";

	var num=0;

	if(num = hasFeat($node.attr('data-uid'), "Improved Initiative")) {
		num = 4*parseInt(num);
		title += "Improved Initiative: "+num+"<br>";
	}

	$node.attr('data-initial-roll', roll+base);
	$node.text(base+roll+num);
	$node.attr('rel','tooltip').attr('title',title);
	$node.tooltip({html: true, placement: 'bottom'});
}