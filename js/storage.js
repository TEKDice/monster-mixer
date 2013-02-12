

var Storage = {

	mode: "html5",

	exists: function() {
		return typeof(Storage)!=='undefined';
	},
	
	hasVar: function(check) {
		return Storage.exists() && typeof localStorage[check] !== 'undefined';
	},

	_cookieVar: function(check) {
	},
	
	init: function() {
	}
	
};