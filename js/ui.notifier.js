var Notifier = {
	decodeObject: function() {
		lastPostedUpdate = $.parseJSON(lastPostedUpdate);
		lastPostedUpdate.date = lastPostedUpdate.date.split("&amp;").join("&");
	},

	checkUpdates: function () {

		//sanity check for local development
		if (!lastPostedUpdate) return;

		Notifier.decodeObject();

		if (!Data.hasVar("lastUpdate")) {
			Data.setVar("lastUpdate", lastPostedUpdate.date);
			return;
		}

		if (Data.getVar("lastUpdate") < lastPostedUpdate.date) {
			Notifier.updateNotification();
			Data.setVar("lastUpdate", lastPostedUpdate.date);
		}
	},

	updateNotification: function () {
		$.pnotify({
			title: "Updated!",
			text: "Hey, we updated recently! You can see the most recent changelog <a target='_blank' href='"+lastPostedUpdate.link+"'>here</a>!"
		});
	}
};
