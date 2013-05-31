function saveMonsters() {
	if (!loggedIn) return;
	//TODO -- "loading icon"

	var saveTheseMonsters = [];


	$("#monsterList li a").each(function (i, e) {
		var uid = $(this).attr('data-uid');

		var arrMon = monsters[uid];

		var mon = {
			id: arrMon.id,
			modHp: arrMon.hp.mod().val(),
			maxHp: arrMon.hp.initTotal(),
			init: arrMon.initiative.init.num().val()
		};

		if (mon.id == '') return;

		saveTheseMonsters.push(mon);
	});


	if (saveTheseMonsters.length == 0) return;

	sessionManager.saveCurrentMonsters(saveTheseMonsters);

	//TODO -- remove loading icon
}

function loadMonsters(monsterSet) {
	if (!loggedIn) return;

	$("#overlay").fadeIn();

	var loadTheseMonsters = [];

	$.each(monsterSet, function (i, e) {
		loadTheseMonsters.push(e.id);
	});

	$.post('ajax.php', { action: "gen", ids: JSON.stringify(loadTheseMonsters) }, function (monsterArr) {
		var arr = $.parseJSON(monsterArr);
		$.eachAsync(arr, {
			loop: function (i, e) {
				setTimeout(function () {
					var mon = e;
					var uid = addNewMonster(mon);
					var oldMonData = monsterSet[i];

					monsters[uid].hp.hp().num().val(oldMonData.maxHp);
					modifyHp(uid, oldMonData.modHp, true);
					monsters[uid].initiative.init.num().val(oldMonData.init);

					setupGrids(uid);
					sortMonsters();

					saveMonsters();
				}, 1);
			},
			end: function () {
				$("#overlay").fadeOut();
			}
		});
	});
}

function removeAllMonsters() {
	$("#allInfo").empty();
	$("#monsterList").empty();
	$("#monsterData .tab-pane").remove();
}
