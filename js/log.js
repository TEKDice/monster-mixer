
var logTimer;

function addToLog(string, selector, uid) {
	var $div = $("<div/>").appendTo("#allInfo");
	var $container = $("<p/>").addClass('pull-left').attr('data-uid',uid).html(string).appendTo($div);
	$div.append("<div class='pull-right threat-status "+selector+"'></div><div class='clearfix'></div>");
	$container.addClass(selector);

	$container.find('a').tooltip({html: true});

	clearTimeout(logTimer);
	logTimer = setTimeout( function() {
		$("#allInfo").animate( {scrollTop: $("#allInfo")[0].scrollHeight }, 50);
	}, 100);

	$("#log .tab-pane > div").niceScroll({horizrailenabled: false});
	$("#log .tab-pane > div").css('overflow','hidden');

}

var logMessages = {
	hit: function(ent, att, text, num) {
		return ent + " rolled \""+att+"\" for <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	initiate: function(ent, att, text, num) {
		return ent + " initiated \""+att+"\" with <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critAttempt: function(ent, att, text, num) {
		return ent + " attempted to crit using \""+att+"\" with <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critSecond: function(ent, att, text, num) {
		return ent + " attempted to finish crit using \""+att+"\" with <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critMiss: function(ent, att, text, num) {
		return ">> If "+ent+" fails critical hit, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critSuccess: function(ent, att, text, num) {
		return ">> If "+ent+" succeeds critical hit, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	}
};