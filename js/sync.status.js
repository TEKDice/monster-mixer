
function changeStatus(status) {
	switch (status) {
		case "ok": updateTextIcon("icon-ok", "Ready"); return;
		case "syncing": updateTextIcon("icon-refresh", "Syncing..."); return;
		case "noconnection": updateTextIcon("icon-warning-sign", "No connection"); return;
	}
}

function updateTextIcon(iconClass, text) {
	$("#noChangeColor").attr('class', '').addClass(iconClass);
	$("#statusText").text(text);
}