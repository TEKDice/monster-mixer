
var newLogEntryWidth;

var LogMessage = function (message, classification, uid, atkUid, bundleId, damage) {
	return {
		message: message,
		type: classification,
		attack: atkUid,
		monster: uid,
		bundle: bundleId,
		damage: damage,
		created: now()
	};
}

var logModel;

function initialiseLog() {
	logModel = new LogModel();
	logModel.startSession(sessionManager.currentSessionId());
	ko.applyBindings(logModel, $("#log")[0]);

	$("#log .tab-pane > div").niceScroll({ horizrailenabled: false });
	$("#log .tab-pane > div").css('overflow', 'hidden');
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