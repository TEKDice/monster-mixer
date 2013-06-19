var Notifier = {
	decodeObject: function() {
		lastPostedUpdate = $.parseJSON(lastPostedUpdate);
		lastPostedUpdate.date = lastPostedUpdate.date.split("&amp;").join("&");
	},

	checkUpdates: function () {

		Notifier.decodeObject();

		if (!Data.hasVar("lastUpdate")) {
			Data.setVar("lastUpdate", lastPostedUpdate.date);
			return;
		}

		if (Data.getVar("lastUpdate") < lastPostedUpdate.date) {
			Notifier.updateNotification();
		}
	},

	updateNotification: function () {
		$.pnotify({
			title: "Updated!",
			text: "Hey, we updated recently! You can see the changelog <a href='"+lastPostedUpdate.link+"'>here</a>!"
		});
	}
};
