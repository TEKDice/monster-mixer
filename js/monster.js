function hasFeat(id, feat) {
	return hasNeedle(id, "mfeat", feat);
}

function hasSkill(id, skill) {
	return hasNeedle(id, "mskill", skill);
}

function hasQuality(id, quality) {
	return hasNeedle(id, "mqualit", quality);
}

function hasNeedle(id, table, needle) {
	var $table = $("#"+id+"_"+table+"_table");

	var hasNeedle = false;
	$table.find("td a").each(function() {
		if($(this).text() == feat) {
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