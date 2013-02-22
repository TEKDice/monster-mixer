
var logTimer;
var newLogEntryWidth;

function addToLog(string, selector, uid) {

	//bleh, damned inability to append the same element in two places..
	var divString = "<div class='attackSide'><p class='pull-left "+selector+"' data-uid='"+uid+"'>"+
		string+"</p></div><div class='pull-right threat-status "+
		selector+"'></div><div class='clearfix'></div>";

	$("#allInfo").append(divString);
	$("#"+uid+"_log").append(divString);

	$("#log").find('a').tooltip({html: true});

	clearTimeout(logTimer);
	logTimer = setTimeout( function() {
		$("#allInfo").animate( {scrollTop: $("#allInfo")[0].scrollHeight }, 50);
		$("#curMon").animate( {scrollTop: $("#curMon")[0].scrollHeight }, 50);
	}, 100);

	$("#log .tab-pane > div").niceScroll({horizrailenabled: false});
	$("#log .tab-pane > div").css('overflow','hidden');

	$(".attackSide").width(newLogEntryWidth);

}

function changeLogEntrySize() {
	newLogEntryWidth = $("#allInfo").width()-70;
}

var logMessages = {
	skill: function(ent, att, text, num) {
		return ent + " rolled <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a> on its \""+att+"\" check\."
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
		return ">> If "+ent+" confirms critical, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	}
};