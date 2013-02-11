

var Storage = {

	mode: "html5",

	exists: function() {
		return typeof(Storage)!=='undefined';
	},
	
	hasVar: function(var) {
		return Storage.exists() && typeof localStorage[var] !== 'undefined';
	},

	_cookieVar: function(var) {
	},
	
	init: function() {
		if()
	}
	
};