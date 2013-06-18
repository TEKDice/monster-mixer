function initHotkeys() {
	KeyboardJS.on("g", genMonster);
	KeyboardJS.on("h", openHpPopup);
	KeyboardJS.on("right", nextMonster);
	KeyboardJS.on("left", prevMonster);
}

var prevMonster = function () {
	var $cur = $("#monsterList").children(".active");
	var $newtab;
	if ($cur.is($("#monsterList").children().first())) {
		$newtab = $("#monsterList").children().last();
	} else {
		$newtab = $("#monsterList").children(".active").prev();
	}
	$newtab.children("a").tab('show');
};

var nextMonster = function () {
	var $cur = $("#monsterList").children(".active");
	var $newtab;
	if ($cur.is($("#monsterList").children().last())) {
		$newtab = $("#monsterList").children().first();
	} else {
		$newtab = $("#monsterList").children(".active").next();
	}
	$newtab.children("a").tab('show');
};

var genMonster = function () {
	_genButtonFunctionality($("#genButton"));
};

var openHpPopup = function () {
	var uid = $("#monsterData .active").attr('id');
	$("#health_" + uid).click();
};