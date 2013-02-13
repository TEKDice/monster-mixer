

//monster modify, monster create, monster remove
function saveMonsters() {
	if(!currentSessionId) return;
	//TODO -- "loading icon"

	var monsters = [];

	$("#monsterList li a").each(function(i, e) {
		var uid = $(this).attr('data-uid');

		var mon = {
			id: $("#"+uid+"_id").text(),
			hp: $("#"+uid+"_hp .hp_val").text()
		};

		monsters.push(mon);
	});

	Data.setVar("monsters_"+currentSessionId, monsters);

	//TODO -- remove loading icon
}

function loadMonsters(monsterSet) {

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

			/*
			$.each(oldMonData, function(i, e) {
				if(i == 'id') return;
				$("#"+uid).find("[data-for='"+i+"']").text(e);
			});*/
		});
	});


	//TODO -- remove loading icon
}

var currentSessionId;

function startSession() {
	currentSessionId = new Date().getTime();
	saveSession();
}

function loadSession(id) {
	var monsters = Data.getVar('monsters_'+id);
	loadMonsters(monsters);
}

function saveSession() {
	if(!currentSessionId) return;

	Data.setVar("lastSessionId", currentSessionId);
	//TODO -- save session data in lastSessionData
}

function hasPreviousSession() {
	if(!Data.hasVar("lastSessionId")) return false;
	var lastSessId = Data.getVar("lastSessionId");

	if(!Data.hasVar("monsters_"+lastSessId)) return false;

	var lastSessMon = Data.getVar("monsters_"+lastSessId);
	if(lastSessMon.length == 0) return false;
	return true;
}

function getPreviousSession() {
	if(!Data.hasVar("lastSessionId")) return false;
	return Data.getVar("lastSessionId");
}

function sessionManagement() {
	if(hasPreviousSession()) {		
		bootbox.confirm("It looks like you had a session open. Would you like to reload it?", function(result) {
			if(!result) { startSession(); return;}
			loadSession(getPreviousSession());
		});
	} else {
		startSession();
	}
}