
var hasReloadedSession = false;

function now() {
	return new Date().getTime();
}

function serverReachable() {
	//thanks https://gist.github.com/louisremi/936493
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