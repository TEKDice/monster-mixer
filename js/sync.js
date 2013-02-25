
var SESSIONS_VARIABLE = "sessions";
var LAST_SESSION_VARIABLE = "lastSessionId";


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

		if(mon.id == '') return;

		monsters.push(mon);
	});

	Data.setVar("monsters_"+currentSessionId, monsters);

	saveSession(false);

	//TODO -- remove loading icon
}

function loadMonsters(monsterSet) {
	if(!loggedIn) return;

	$("#overlay").fadeIn();

	var monsters = [];

	$.each(monsterSet, function(i, e) {
		monsters.push(e.id);
	});

	$.post('ajax.php', {action: "gen", ids: JSON.stringify(monsters)}, function(monsterArr) {
		var arr = $.parseJSON(monsterArr);
		$.eachAsync(arr, {
			loop: function(i, e){
				setTimeout(function() {
					var mon = e;
					var uid = addNewMonster(mon);
					setupGrids(uid);
					
					var oldMonData = monsterSet[i];

					rollHp(uid, null, oldMonData.maxHp, true);
					modifyHp(uid, parseInt(oldMonData.curHp) - parseInt($("#"+uid+"_hp .hp_val").text()) , true);
					_rollInit(uid, parseInt(oldMonData.init));
					saveMonsters();
				}, 1);
			},
			end: function() {
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

var currentSessionId;

function startSession() {
	if(!loggedIn) return;
	currentSessionId = now();
	saveSession(false);
}

function loadSession(id) {
	if(!loggedIn) return;
	removeAllMonsters();
	currentSessionId = id;
	var monsters = Data.getVar('monsters_'+id);
	loadMonsters(monsters);
}

function startNewSession() {
	if(!loggedIn) return;
	if(!currentSessionId) return;

	saveSession(false);
	removeAllMonsters();
	startSession();
}

function deleteSession(uid) {
	if(!loggedIn) return;
	if(!currentSessionId) return;

	Data.clearVar("monsters_"+uid);
}

function saveSession(ask, sessionData) {
	if(!loggedIn) return;
	if(!currentSessionId) return;

	Data.setVar(LAST_SESSION_VARIABLE, currentSessionId);

	if(!Data.hasVar(SESSIONS_VARIABLE)) { Data.setVar(SESSIONS_VARIABLE, {}); }

	var sessions = Data.getVar(SESSIONS_VARIABLE);

	if(ask && !sessions.hasOwnProperty(_currentSessionId())) {
		bootbox.confirm("Would you like to save this new session?", function(result) {
			if(!result) {return;}
			saveNewSession();
		});
	} 

	if(sessions.hasOwnProperty(_currentSessionId())) {
		if(sessionData)
			sessions[_currentSessionId()] = sessionData;
		sessions[_currentSessionId()].lastUpdate = now();
	} else {
		if(sessionData)
			sessions[_currentSessionId()] = sessionData;
		else
			sessions[_currentSessionId()] = saveNewSession();
		sessions[_currentSessionId()].lastUpdate = now();
	}

	Data.setVar(SESSIONS_VARIABLE, sessions);
}

function saveNewSession() {
	var sessions = Data.getVar(SESSIONS_VARIABLE);
	var ret = sessions[_currentSessionId()] = {
		startTime: currentSessionId,
		name: "Nameless Campaign",
		lastUpdate: now()
	};
	Data.setVar(SESSIONS_VARIABLE, sessions);
	return ret;
}

function hasPreviousSession() {
	if(!loggedIn) return;
	if(!Data.hasVar(LAST_SESSION_VARIABLE)) return false;
	var lastSessId = Data.getVar(LAST_SESSION_VARIABLE);

	if(!Data.hasVar("monsters_"+lastSessId)) return false;

	var lastSessMon = Data.getVar("monsters_"+lastSessId);
	if(lastSessMon.length == 0) return false;
	return true;
}

function getPreviousSession() {
	if(!loggedIn) return;
	if(!Data.hasVar(LAST_SESSION_VARIABLE)) return null;
	return Data.getVar(LAST_SESSION_VARIABLE);
}

function getCurrentSession() {
	var sessions = Data.getVar(SESSIONS_VARIABLE);
	return sessions[_currentSessionId()];
}

function getSessionById(id) {
	var sessions = Data.getVar(SESSIONS_VARIABLE);
	return sessions[id];
}

function sessionManagement() {
	if(!loggedIn) return;
	if(hasPreviousSession()) {		
		bootbox.confirm("It looks like you had a session open. Would you like to reload it?", function(result) {
			if(!result) { startSession(); return; }
			loadSession(getPreviousSession());
		});
	} else {
		startSession();
	}
}

function _currentSessionId() {
	return currentSessionId.toString();
}

function now() {
	return new Date().getTime();
}

function changeStatus(status) {
	switch(status) {
		case "ok": 				updateTextIcon("icon-ok", "Ready"); return;
		case "syncing": 		updateTextIcon("icon-refresh", "Syncing..."); return;
 		case "noconnection": 	updateTextIcon("icon-warning-sign", "No connection"); return;
	}
}

function updateTextIcon(iconClass, text) {
	$("#noChangeColor").attr('class','').addClass(iconClass);
	$("#statusText").text(text);
}