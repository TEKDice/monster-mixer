function initHotkeys() {
	var $input = $("input");
	KeyboardJS.on("g", function () { callIfNotActive($input, genMonster) });
	KeyboardJS.on("h", function () { callIfNotActive($input, openHpPopup) });
	KeyboardJS.on("right", function () { callIfNotActive($input, nextMonster) });
	KeyboardJS.on("left", function () { callIfNotActive($input, prevMonster) });
}

var callIfNotActive = function ($input, call) {
	if ($input.is(":focus")) return;
	call();
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