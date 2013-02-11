

var Storage = {

	mode: "123",

	exists: function() {
		return typeof(Storage)!=='undefined';
	},
	
	hasVar: function(var) {
		return Storage.exists() && typeof localStorage[var] !== 'undefined';
	},
	
	init: function() {
	}
	
};