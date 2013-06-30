
var IS_RELOADING_SESSION = false;
function saveMonsters() {
	if (!loggedIn) return;

	var saveTheseMonsters = [];

	$("#monsterList li a").each(function (i, e) {
		var uid = $(this).attr('data-uid');

		var arrMon = monsters.getMonster(uid);

		var mon = {
			id: arrMon.id,
			uid: arrMon.uid,
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

	var loadTheseMonsters = [];

	if (monsterSet == null) return;

	$("#overlay").fadeIn();

	loadCleaveData();

	$.each(monsterSet, function (i, e) {
		loadTheseMonsters.push(e.id);
	});

	$.post('ajax.php', { action: "gen", ids: JSON.stringify(loadTheseMonsters) }, function (monsterArr) {
		var arr = $.parseJSON(monsterArr);
		IS_RELOADING_SESSION = true;
		$.eachAsync(arr, {
			loop: function (i, e) {
				var mon = e;
				var oldMonData = monsterSet[i];
				var uid = addNewMonster(mon, oldMonData.uid);

				monsters.getMonster(uid).hp.hp().num().val(oldMonData.maxHp);
				modifyHp(uid, oldMonData.modHp, true);
				monsters.getMonster(uid).initiative.init.num().val(oldMonData.init);

				setupGrids(uid);
				sortMonsters();

				saveMonsters();
			},
			end: function () {
				$("#overlay").fadeOut();
				loadLogMessages();
				IS_RELOADING_SESSION = false;
			}
		});
	});
}

function loadCleaveData() {
	var sessId = sessionManager.currentSessionId();
	cleaveAtks = sessionManager.getCleaveDataBySession(sessId) || {};

	for (var attack in cleaveAtks) {
		cleaveAtks[attack] = $.extend(new Atk(), cleaveAtks[attack]);

		for (var roll in cleaveAtks[attack].baseAttack) {
			cleaveAtks[attack].baseAttack[roll] = new Roll(cleaveAtks[attack].baseAttack[roll].rollData);
		}

		cleaveAtks[attack].baseHit = new Roll(cleaveAtks[attack].baseHit.rollData);

		if(cleaveAtks[attack].threatAttack.hasOwnProperty("rollData"))
			cleaveAtks[attack].threatAttack = new Roll(cleaveAtks[attack].threatAttack.rollData);

		if (cleaveAtks[attack].threatHit.hasOwnProperty("rollData"))
			cleaveAtks[attack].threatHit = new Roll(cleaveAtks[attack].threatHit.rollData);
	}
}

function removeAllMonsters() {
	$("#allInfo").empty();
	$("#monsterList").hide().empty();
	$("#monsterData .tab-pane").remove();
	$("#genAlert").show();
	_hideAllMiniboxScrollbars();
}

function loadLogMessages() {
	var sessId = sessionManager.currentSessionId();
	var messages = sessionManager.getLogDataBySession(sessId);

	if (messages == null) return;
	logModel.currentSessionMessages(messages);
	logModel.uiLookManagement();
}