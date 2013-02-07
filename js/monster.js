function hasFeat(id, feat) {
	return hasNeedle(id, "mfeat", feat, "times-taken");
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
}

function rollHp(uid, $rootNode, newHp) {

	var title = '';

	newHp = parseInt(newHp);

	var num;
	if(num = hasFeat(uid, "Toughness")) {
		newHp += 3*parseInt(num);
		num = null;
	}

	var con = get_bonus(parseInt($("#"+uid+"_con").text()));

	newHp += con;

	$("#"+uid+"_hp").children(".hp_val").text(newHp);
	$rootNode.attr('data-initial-roll', newHp);

}

function rollInit($node) {

	var title = '';

	var roll = parseInt(rollExpression('1d20'));
	title += "1d20: "+roll+"<br>";

	var base = parseInt($node.attr('data-base-value'));
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