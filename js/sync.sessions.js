/*
function startSession() {
	if(!loggedIn) return;
	currentSessionId = now();
	saveSession(false);
}

function loadSession(id) {
	if(!loggedIn) return;
	removeAllMonsters();
	currentSessionId = id;
	var monsters = getMonsterDataBySession(id);
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

	var lastSessMon = getMonsterDataBySession(lastSessId);
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

function getMonsterDataBySession(id) {
	return Data.getVar("monsters_" + id);
}

function sessionManagement() {
	if(!loggedIn) return;
	if(hasPreviousSession()) {		
		bootbox.confirm("It looks like you had a session open. Would you like to reload it?", function(result) {
			if(hasReloadedSession) return;
			if(!result) { startSession(); return; }
			hasReloadedSession = true; 
			loadSession(getPreviousSession());
		});
	} else {
		startSession();
	}
}
*/