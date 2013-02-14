

//monster modify, monster create, monster remove
function saveMonsters() {
	if(!loggedIn) return;
	if(!currentSessionId) return;
	//TODO -- "loading icon"

	var monsters = [];

	$("#monsterList li a").each(function(i, e) {
		var uid = $(this).attr('data-uid');

		var mon = {
			id: $("#"+uid+"_id").text(),
			curHp: $("#"+uid+"_hp .hp_val").text(),
			maxHp: $("#"+uid+"_hp").attr('data-initial-roll'),
			init: $("#"+uid+"_init").attr('data-initial-value')
		};

		monsters.push(mon);
	});

	Data.setVar("monsters_"+currentSessionId, monsters);

	saveSession(false);

	//TODO -- remove loading icon
}

function loadMonsters(monsterSet) {
	if(!loggedIn) return;

	//TODO -- "loading icon"

	var monsters = [];

	$.each(monsterSet, function(i, e) {
		monsters.push(e.id);
	});

	$.post('ajax.php', {action: "gen", ids: JSON.stringify(monsters)}, function(monsterArr) {
		$.each($.parseJSON(monsterArr), function(i, e){
			var mon = e;
			var uid = addNewMonster(mon);
			setupGrids(uid);
			
			var oldMonData = monsterSet[i];

			rollHp(uid, null, oldMonData.maxHp, true);
			modifyHp(uid, parseInt(oldMonData.curHp) - parseInt($("#"+uid+"_hp .hp_val").text()) , true);
			_rollInit(uid, parseInt(oldMonData.init));
		});
	});


	//TODO -- remove loading icon
}

var currentSessionId;

function startSession() {
	if(!loggedIn) return;
	currentSessionId = now();
}

function loadSession(id) {
	if(!loggedIn) return;
	var monsters = Data.getVar('monsters_'+id);
	loadMonsters(monsters);
	currentSessionId = id;
}

function saveSession(ask) {
	if(!loggedIn) return;
	if(!currentSessionId) return;

	Data.setVar("lastSessionId", currentSessionId);

	if(!Data.hasVar("sessions")) { Data.setVar("sessions", []); }

	var sessions = Data.getVar("sessions");

	if(ask && !currentSessionId in sessions) {
		bootbox.confirm("Would you like to save this new session?", function(result) {
			if(!result) {return;}
			saveNewSession();
		});
	} 

	sessions[currentSessionId].lastUpdate = now();

	Data.setVar("session",sessions);
}

function saveNewSession() {
	sessions[currentSessionId] = {
		startTime: currentSessionId,
		name: currentSessionId,
		lastUpdate: now()
	}
}

function hasPreviousSession() {
	if(!loggedIn) return;
	if(!Data.hasVar("lastSessionId")) return false;
	var lastSessId = Data.getVar("lastSessionId");

	if(!Data.hasVar("monsters_"+lastSessId)) return false;

	var lastSessMon = Data.getVar("monsters_"+lastSessId);
	if(lastSessMon.length == 0) return false;
	return true;
}

function getPreviousSession() {
	if(!loggedIn) return;
	if(!Data.hasVar("lastSessionId")) return false;
	return Data.getVar("lastSessionId");
}

function sessionManagement() {
	if(!loggedIn) return;
	if(hasPreviousSession()) {		
		bootbox.confirm("It looks like you had a session open. Would you like to reload it?", function(result) {
			if(!result) { startSession(); return;}
			loadSession(getPreviousSession());
		});
	} else {
		startSession();
	}
}

function now() {
	return new Date().getTime();
}