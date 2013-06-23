
var newLogEntryWidth;

var LogMessage = function (message, classification, uid, atkUid, bundleId) {
	return {
		message: message,
		type: classification || 'none',
		attack: atkUid,
		monster: uid,
		bundle: bundleId,
		created: now()
	};
}

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

	self.addMessage = function (msg, cls, uid, auid, bundle) {
		
		var logEntry = new LogMessage(msg, cls, uid, auid, bundle);

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

	self.currentMonsterId.subscribe(function (value) {
		self.recalculateIndividualMonsterMessages();
		self.uiLookManagement()
	});

	self.currentSessionId.subscribe(function (value) {
		self.currentSessionMessages = self.messages[value];
	});

}

var logModel;

function initialiseLog() {
	logModel = new LogModel();
	logModel.startSession(sessionManager.currentSessionId());
	ko.applyBindings(logModel, $("#log")[0]);

	$("#log .tab-pane > div").niceScroll({ horizrailenabled: false });
	$("#log .tab-pane > div").css('overflow', 'hidden');
}

function addToLog(string, selector, uid, atkUid, bundle) {
	logModel.addMessage(string, selector, uid, atkUid, bundle);
}

function changeLogEntrySize() {
	newLogEntryWidth = $("#allInfo").width() - 70;
	$("#log .attackSide").width(newLogEntryWidth);
}

var logMessages = {
	skill: function(ent, att, text, num) {
		return ent + " rolled <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a> on its \""+att+"\" check."
	},

	hit: function(ent, att, text, num) {
		return ent + " hits with \""+att+"\" for <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a> damage."
	},

	initiate: function(ent, att, text, num) {
		return ent + " attacked with \""+att+"\" rolling <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critAttempt: function(ent, att, text, num) {
		return ent + " attempted to crit using \""+att+"\" for <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critSecond: function(ent, att, text, num) {
		return ent + " rolls critical confirm using \""+att+"\" for <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critMiss: function(ent, att, text, num) {
		return ">> If "+ent+" fails the critical, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critSuccess: function(ent, att, text, num) {
		return ">> If "+ent+" confirms the critical, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	}
};