

var Storage = {

	mode: "html5",
	
	init: function() {
		if(!Storage.isHtml5()) mode="cookie"; 
	},

	isHtml5: function() {
		return typeof(Storage)!=='undefined';
	},
	
	hasVar: function(check) {
		return Storage.mode == "html5" ? typeof Storage._html5VarGet(check, val)!=='undefined' : Storage._cookieVarGet(check, val) !== null;
	},

	getVar: function(check) {
		return Storage.mode == "html5" ? Storage._html5VarGet(check) : Storage._cookieVarGet(check);
	},

	_cookieVarGet: function(check) {
		return $.cookie(check);
	},

	_html5VarGet: function(check) {
		if(!isHtml5()) throw new Error("You don't have an HTML5 compliant browser, don't try to fool me!");
		return localStorage[check];
	},

	clearVar: function(check) {
		return Storage.mode == "html5" ? Storage._html5VarSet(check, null) : Storage._cookieVarSet(check, null);
	},

	setVar: function(check, val) {
		return Storage.mode == "html5" ? Storage._html5VarSet(check, val) : Storage._cookieVarSet(check, val);
	},

	_html5VarSet: function(check, val) {
		if(!isHtml5()) throw new Error("You don't have an HTML5 compliant browser, don't try to fool me!");
		localStorage[check] = val;
	},

	_cookieVarSet: function(check, val) {
		$.cookie(check, val);
	}
	
};