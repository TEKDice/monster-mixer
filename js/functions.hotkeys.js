function initHotkeys() {
	KeyboardJS.on("g", function () { callIfNotActive(genMonster) });
	KeyboardJS.on("h", function () { callIfNotActive(openHpPopup) });
	KeyboardJS.on("right", function () {
		callIfNotActive(
			determineContext({ 'default': nextMonster })
		);
	});
	KeyboardJS.on("left", function () {
		callIfNotActive(
			determineContext({ 'default': prevMonster })
		);
	});
}

var callIfNotActive = function (call) {
	if ($("input:focus").length > 0) return;
	call();
}

var determineContext = function (args) {
	var focused = $("*:focus").attr("id");
	console.log(focused);
	switch (focused) {
		case "curMon":	return switchToAll; 
		case "allInfo": return switchToCurMon; 
		default:		return args.default;
	}
};

var switchToCurMon = function () {
	switchActiveTab("curTab");
	$("#curMon").focus();
};

var switchToAll = function () {
	switchActiveTab("allTab");
	$("#allInfo").focus();
};

var switchActiveTab = function(to) {
	$("[href='#"+to+"']").tab('show');
};

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