
var ICON_READY = "icon-ok";
var ICON_REFRESH = "icon-refresh";
var ICON_DISCONNECTED = "icon-warning-sign";
var ICON_DEFAULT = "icon-cog";

var STATUS_OK = "ok";
var STATUS_SYNCING = "syncing";
var STATUS_DISCONNECTED = "disconnected";

function changeStatus(status) {
	switch (status) {
		case STATUS_OK: {
			updateStatusIcon(ICON_READY, "Ready");
			updateNavbarIcon(ICON_DEFAULT);
			return;
		}
		case STATUS_SYNCING: {
			updateStatusIcon(ICON_REFRESH, "Syncing...");
			updateNavbarIcon(ICON_REFRESH, true);
			return;
		}
		case STATUS_DISCONNECTED: {
			updateStatusIcon(ICON_DISCONNECTED, "No connection");
			updateNavbarIcon(ICON_DISCONNECTED);
			return;
		}
	}
}

function updateStatusIcon(iconClass, text) {
	$("#noChangeColor").attr('class', '').addClass(iconClass);
	$("#statusText").text(text);
}

function updateNavbarIcon(iconClass, shouldRotate) {
	$("#secondaryStatusIcon").attr('class', shouldRotate ? 'rotateMe' : '').addClass(iconClass);
}

function _canBeginSync() {
	if (IS_RELOADING_SESSION) return false;
	if (serverReachable()) {
		changeStatus(STATUS_SYNCING);
		return true;
	} else {
		changeStatus(STATUS_DISCONNECTED);
		return false;
	}
}

function _endSync() {
	changeStatus(STATUS_OK);
}