
function $$(str) {
	return $("#" + str);
}

function rollDice(str) {
	var result;
	try {
		var rolls = $.parseJSON(str);
		result = {};
		$.each(rolls, function (i, e) {
			if (i == 'Base') i = 'Base (' + e + ')';
			if (typeof e == 'string' && e.indexOf('d') != -1)
				result[i] = parseInt(rollExpression(e));
			else
				result[i] = isNaN(parseInt(e)) ? 0 : parseInt(e);
		});

	} catch (e) {
		result = rollExpression(str);
	}
	if (result === undefined) {
		bootbox.alert("The roll '" + str + "'' is invalid.");
		return null;
	}
	return result;
}

function getBonus(num) {
	num = parseInt(num);
	if (num == 0 || isNaN(num)) return 0;
	return Math.floor(num / 2) - 5;
}

function collect() {
	var ret = {};
	var len = arguments.length;
	for (var i = 0; i < len; i++) {
		for (p in arguments[i]) {
			if (arguments[i].hasOwnProperty(p)) {
				ret[p] = arguments[i][p];
			}
		}
	}
	return ret;
}

function clamp(min, max, num) {
	num = Math.max(min, num);
	num = Math.min(max, num);
	return num;
}

function arrayToObject(arr) {
	var rv = {};
	for (var i = 0; i < arr.length; ++i)
		rv[i] = arr[i];
	return rv;
}