

var LogModel = function () {
	var self = this;

	self.logTimer = null;

	self.currentMonsterId = ko.observable();
	self.currentSessionId = ko.observable();

	self.currentMonsterMessages = ko.observableArray([]);
	self.currentSessionMessages = ko.observableArray([]);

	self.messages = {};

	self.startSession = function (session) {
		if (!self.messages.hasOwnProperty(session))
			self.messages[session] = ko.observableArray([]);
		
		self.currentSessionId(session);
	};

	self.addMessage = function (msg, cls, uid, auid, bundle, damage) {
		
		var logEntry = new LogMessage(msg, cls, uid, auid, bundle, damage);

		if(self.currentMonsterId() == uid) 
			self.currentMonsterMessages.push(logEntry);

		self.messages[self.currentSessionId()].push(logEntry);

		self.uiLogManagement(logEntry);
	};

	self.recalculateIndividualMonsterMessages = function () {
		self.currentMonsterMessages.removeAll();

		var session = self.currentSessionId();

		if(!self.messages.hasOwnProperty(session)) return;

		if (self.messages[session]().length == 0) return;

		$.each(self.messages[session](), function (i, e) {
			if (e.monster == self.currentMonsterId())
				self.currentMonsterMessages.push(e);
		});
	};

	self.removeMessagesByBundle = function (bundle) {

		var session = self.currentSessionId();

		self.messages[session].remove(function (item) {
			return item.bundle == bundle;
		});
	};

	self.generateIdForEntry = function (message) {
		return self.currentSessionId() + "_" + message.monster + "_" + message.created;
	};

	self.uiLookManagement = function () {
		$(".attackSide").width(newLogEntryWidth);
		$("#allInfo").animate({ scrollTop: $("#allInfo")[0].scrollHeight }, 50);
		$("#curMon").animate({ scrollTop: $("#curMon")[0].scrollHeight }, 50);
		$("#log .tab-pane > div").getNiceScroll().resize();
	};

	self.uiLogManagement = function (message) {
		var elementId = self.generateIdForEntry(message);
		$("#log ." + elementId).find('a').tooltip({ html: true });
		self.uiLookManagement();
	};

	monsters.currentMonsterId.subscribe(function (value) {
		self.recalculateIndividualMonsterMessages();
		self.uiLookManagement()
	});

	self.currentSessionId.subscribe(function (value) {
		self.currentSessionMessages = self.messages[value];
	});

}