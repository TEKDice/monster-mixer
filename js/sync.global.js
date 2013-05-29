
var SESSIONS_VARIABLE = "sessions";
var LAST_SESSION_VARIABLE = "lastSessionId";
var hasReloadedSession = false;

var currentSessionId;

function now() {
	return new Date().getTime();
}

function _currentSessionId() {
	return currentSessionId.toString();
}

function serverReachable() {
	var x = new (window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP"),
		s;
	x.open(
	  "HEAD",
	  "//" + window.location.hostname + "/?rand=" + Math.random(),
	  false
	);
	try {
		x.send();
		s = x.status;
		return (s >= 200 && s < 300 || s === 304);
	} catch (e) {
		return false;
	}
}