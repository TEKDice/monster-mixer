
var IS_RELOADING_SESSION = false;
function saveMonsters() {
	if (!loggedIn) return;

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
}

function loadMonsters(monsterSet) {
	if (!loggedIn) return;

	$("#overlay").fadeIn();

	var loadTheseMonsters = [];

	if (monsterSet == null) return;

	$.each(monsterSet, function (i, e) {
		loadTheseMonsters.push(e.id);
	});

	$.post('ajax.php', { action: "gen", ids: JSON.stringify(loadTheseMonsters) }, function (monsterArr) {
		var arr = $.parseJSON(monsterArr);
		IS_RELOADING_SESSION = true;
		$.eachAsync(arr, {
			loop: function (i, e) {
				var mon = e;
				var uid = addNewMonster(mon);
				var oldMonData = monsterSet[i];

				monsters[uid].hp.hp().num().val(oldMonData.maxHp);
				modifyHp(uid, oldMonData.modHp, true);
				monsters[uid].initiative.init.num().val(oldMonData.init);

				setupGrids(uid);
				sortMonsters();

				saveMonsters();
			},
			end: function () {
				$("#overlay").fadeOut();
				IS_RELOADING_SESSION = false;
			}
		});
	});
}

function removeAllMonsters() {
	$("#allInfo").empty();
	$("#monsterList").hide().empty();
	$("#monsterData .tab-pane").remove();
	$("#genAlert").show();
	_hideAllMiniboxScrollbars();
}
