
var SESSIONS_VARIABLE = "sessions";
var LAST_SESSION_VARIABLE = "lastSessionId";

var SessionModel = function() {
	var self = this;

	//#region Dummy/Invalidation
	self.dummy = ko.observable();

	self.invalidate = function () {
		self.dummy.notifySubscribers();
	};
	//#endregion

	//#region Global Session Data
	self._currentSessionId = function () {
		self.invalidate();
		return self.currentSessionId().toString();
	};

	self.currentSessionId = ko.computed({
		read: function () {
			self.dummy();
			if (!Data.hasVar(LAST_SESSION_VARIABLE)) Data.setVar(LAST_SESSION_VARIABLE, now()); 
			return Data.getVar(LAST_SESSION_VARIABLE);
		},
		write: function (value) {
			Data.setVar(LAST_SESSION_VARIABLE, value);
		}
	});

	self.allSessions = ko.computed({
		read: function () {
			self.dummy();
			if (!Data.hasVar(SESSIONS_VARIABLE)) Data.setVar(SESSIONS_VARIABLE, {});
			return Data.getVar(SESSIONS_VARIABLE)
		},
		write: function (value) {
			Data.setVar(SESSIONS_VARIABLE, self.verifySessionData(value));
		}
	});
	//#endregion

	//#region Session Filtering
	self.getSessionById = function (id) {
		var sessionList = self.allSessions();
		if (sessionList[id] === undefined) {
			sessionList[id] = self.newSessionData();
			self.allSessions(sessionList);
		}
		return sessionList[id];
	};

	self.currentSession = ko.observable(function () {
		self.dummy();
		return self.getSessionById(self.currentSessionId());
	});

	self.syncedSessions = ko.observableArray(cloudSessions);

	self.nonSyncedSessions = ko.computed(function () {
		self.dummy();
		var sessions = [];
		var synced = self.syncedSessions();
		var all = self.allSessions();
		$.each(all, function (i, e) {
			var found = false;
			$.each(synced, function (ii, ee) {
				if (e.startTime == ee.startTime) found = true;
			});
			if (!found) sessions.push(e);
		});
		return sessions;
	});

	self.tableDisplaySessions = ko.computed(function () {
		self.dummy();
		return self.syncedSessions().sort(sortByName).concat(self.nonSyncedSessions().sort(sortByName));
	});

	self.verifySessionData = function (data) {
		var arr = {};
		$.each(data, function (i, e) {
			//if (self.hasMonsterDataFor(e.startTime))
			if(e != null)
				arr[e.startTime] = e;
		});
		return arr;
	};

	self.isSynced = function (session) {
		var ret = false;
		$.each(self.syncedSessions(), function (i, e) {
			if (session.startTime == e.startTime) ret = true;
		});
		return ret;
	};
	//#endregion

	//#region Saving Functions
	self.saveSession = function (ask, sessionData) {
		if (!loggedIn) return;

		var sessions = self.allSessions();

		if (ask && !sessions.hasOwnProperty(self._currentSessionId())) {
			bootbox.confirm("Would you like to save this new session?", function (result) {
				if (!result) { return; }
				self.saveNewSession();
			});
		}

		if (sessions.hasOwnProperty(self._currentSessionId())) {
			if (sessionData)
				sessions[self._currentSessionId()] = sessionData;
			sessions[self._currentSessionId()].lastUpdate = now();
		} else {
			if (sessionData)
				sessions[self._currentSessionId()] = sessionData;
			else
				sessions[self._currentSessionId()] = self.newSessionData();
			sessions[self._currentSessionId()].lastUpdate = now();
		}

		if (self.isSynced(sessions[self._currentSessionId()]))
			self.sync(sessions[self._currentSessionId()]);

		self.allSessions(sessions);
	};

	self.saveNewSession = function () {
		var sessions = self.allSessions();

		var ret = sessions[self._currentSessionId()] = self.newSessionData();

		self.allSessions(sessions);
		return ret;
	};

	self.saveMonsters = function (id, data, dontSync) {
		Data.setVar("monsters_" + id, data);
		if(!dontSync)
			self.saveSession(false);
	};

	self.saveCurrentMonsters = function (data) {
		self.invalidate();
		self.saveMonsters(self.currentSessionId(), data);
	};

	self.saveCurrentSessionInfo = function () {
		var newName = $("#sessionName").val();
		if (newName == '') return false;
		var session = sessionManager.currentSession()();
		session.name = newName;
		session.lastUpdate = now();
		self.saveSession(false, session);

		$("#currentSessionDialog").modal('hide');
		self.invalidate();
	};
	//#endregion

	//#region Loading Functions
	self.loadSession = function (id) {
		if (!loggedIn) return;
		removeAllMonsters();
		self.currentSessionId(id);
		loadMonsters(self.getMonsterDataBySession(id));
	};

	self.getPreviousSession = function () {
		if (!loggedIn) return;
		if (!Data.hasVar(LAST_SESSION_VARIABLE)) return null;
		return Data.getVar(LAST_SESSION_VARIABLE);
	};

	self.getMonsterDataBySession = function (id) {
		return Data.getVar("monsters_" + id);
	};
	//#endregion

	//#region Deletion Functions
	self.deleteSession = function (uid) {
		if (!loggedIn) return;

		Data.clearVar("monsters_" + uid);

		var sessionList = self.allSessions();

		if (self.isSynced(sessionList[uid]))
			self.unsync(sessionList[uid]);

		sessionList[uid] = null;

		self.allSessions(sessionList);
		self.invalidate();
	};
	//#endregion

	//#region Creation Functions
	self.startSession = function () {
		if (!loggedIn) return;
		self.saveSession(false);
	};

	self.startNewSession = function () {
		if (!loggedIn) return;

		self.currentSessionId(now());
		self.saveSession(false);
		removeAllMonsters();
	};
	//#endregion

	//#region Merging Functions
	self.mergeCloudSessionsToLocal = function () {
		var localSessions = self.allSessions();
		$.each(self.syncedSessions(), function (i, e) {
			self.saveMonsters(e.startTime, $.parseJSON(e.json), true);
			localSessions[e.startTime] = {
				name: e.name,
				startTime: parseInt(e.startTime),
				lastUpdate: parseInt(e.lastUpdate)
			};
		});
		self.allSessions(localSessions);
	};
	//#endregion

	//#region Check-if Functions
	self.hasMonsterDataFor = function (id) {
		return Data.hasVar("monsters_" + id);
	};

	self.hasPreviousSession = function () {
		if (!loggedIn) return;
		if (!Data.hasVar(LAST_SESSION_VARIABLE)) return false;
		var lastSessId = Data.getVar(LAST_SESSION_VARIABLE);

		if (!self.hasMonsterDataFor(lastSessId)) return false;
		if (self.getMonsterDataBySession(lastSessId).length == 0) return false;
		return true;
	};

	self.sessionManagement = function () {
		if (!loggedIn) return;
		if (self.hasPreviousSession()) {
			bootbox.confirm("It looks like you had an encounter open. Would you like to reload it?", function (result) {
				if (hasReloadedSession) return;
				if (!result) { self.currentSessionId(now()); self.startSession(); return; }
				hasReloadedSession = true;
				self.loadSession(self.getPreviousSession());
			});
		} else {
			self.startSession();
		}
	};
	//#endregion

	//#region Data Creation/Formatting Functions
	self.newSessionData = function () {
		self.invalidate();
		return {
			startTime: self.currentSessionId(),
			name: "Nameless Encounter",
			lastUpdate: now()
		};
	};

	self.formatSessionDialogDate = function (date) {
		return new Date(parseInt(date)).format();
	};
	//#endregion

	//#region Error Message Functions
	self.sessionErrorMessage = function (str, isError) {
		$("#sessionDialogError")
			.show()
			.attr('class', 'pull-left label').addClass(isError ? 'label-important' : 'label-success')
			.text(str);
	};
	//#endregion

	//#region Sync Functions
	self.sync = function (sessionInfo, $button) {
		if (!_canBeginSync()) return
		$.ajax("sessions.php", {
			type: "POST",
			data: {
				action: "new",
				sessname: sessionInfo.name,
				json: JSON.stringify(self.getMonsterDataBySession(sessionInfo.startTime)),
				sttime: sessionInfo.startTime,
				uptime: sessionInfo.lastUpdate
			}
		}).done(function (data) {
			data = $.parseJSON(data);
			self.sessionErrorMessage(data.msg, data.isError);

			if (data.isError && $button !== undefined) {
				$button.button('reset');
			}

			self.updateSyncedSessions();

		}).fail(function () {
			self.sessionErrorMessage("Error: Couldn't connect to cloud");

			if ($button !== undefined) {
				$button.button('reset');
				$delButton.button('reset');
			}

		}).always(function() {
			_endSync();
		});
	};

	self.unsync = function (sessionInfo, $button, $delButton) {
		if (!_canBeginSync()) return
		$.ajax("sessions.php", {
			type: "POST",
			data: {
				action: "del",
				sttime: sessionInfo.startTime
			}
		}).done(function (data) {
			data = $.parseJSON(data);
			self.sessionErrorMessage(data.msg, data.isError);

			if (data.isError && $button !== undefined) {
				$button.button('reset');
				$delButton.button('reset');
			}

			self.updateSyncedSessions();

		}).fail(function () {
			self.sessionErrorMessage("Error: Couldn't connect to cloud");

			if ($button !== undefined) {
				$button.button('reset');
				$delButton.button('reset');
			}

		}).always(function () {
			_endSync();

		});
	};
	//#endregion

	//#region Sessions Menu Button Functions
	self.syncSessionDeleteButton = function (e, button) {
		$("#sessionDialog").modal('hide');
		bootbox.confirm("Are you sure you want to delete this campaign? Not even a wish can bring this back once it's gone.", function (result) {
			if (!result) {
				$("#sessionDialog").modal('show');
				return;
			}
			var $button = $(button);
			$button.button('loading');
			$button.closest('tr').find('.btn-sync').button('loading');

			self.deleteSession(e.startTime);
			$("#sessionDialog").modal('show');
			self.sessionErrorMessage('Successfully deleted campaign', false);
		});
	}

	self.syncSessionSyncButton = function (sessionInfo, button) {
		var $button = $(button);
		$button.button('loading');
		$button.closest('tr').find('.status').addClass('italic').text('Syncing...');
		var $delButton = $button.closest('tr').find('.btn-danger');
		$delButton.button('loading');
		self.sync(sessionInfo, $button, $delButton);
	};

	self.syncSessionUnsyncButton = function (sessionInfo, button) {
		var $button = $(button);
		$button.button('loading');
		$button.closest('tr').find('.status').addClass('italic').text('Unsyncing...');
		var $delButton = $button.closest('tr').find('.btn-danger');
		$delButton.button('loading');
		self.unsync(sessionInfo, $button, $delButton);
	};

	self.updateSyncedSessions = function () {
		if (IS_RELOADING_SESSION) return;
		$.ajax("sessions.php", {
			type: "POST",
			data: {
				action: "get"
			}
		}).done(function (data) {
			self.syncedSessions($.parseJSON(data));
		}).fail(function () {
			self.sessionErrorMessage("Error: Couldn't connect to cloud", true);
		});
	};
	//#endregion
};

var sessionManager;

function initialiseSessionManager() {
	sessionManager = new SessionModel();
	ko.applyBindings(sessionManager, $("#currentSessionDialog")[0]);
	ko.applyBindings(sessionManager, $("#sessionDialog")[0]);
	sessionManager.mergeCloudSessionsToLocal();
	sessionManager.sessionManagement();
}

function sortByName(a, b) {
	var aName = a.name.toLowerCase();
	var bName = b.name.toLowerCase();
	return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}
