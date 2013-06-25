
var StatisticsModel = function () {
	var self = this;

	self.averageCR = ko.observable(0);
	self.monsterCount = ko.observable(0);

	self.totalDamageGiven = ko.observable(0);
	self.averageDamageGiven = ko.observable(0);

	self.totalDamageTaken = ko.observable(0);
	self.averageDamageTaken = ko.observable(0);

	self.isApproximating = ko.observable(false);

	monsterList.monsters.subscribe(function (newValue) {
		self.monsterCount(Object.keys(newValue).length);

		var unAvgCR = 0;

		for (var prop in newValue) {
			unAvgCR += newValue[prop].stats.cr();
		}

		self.averageCR((unAvgCR / self.monsterCount()).toFixed(2));
	});

	logModel.currentSessionMessages.subscribe(function (newValue) {

		var totalDmgGiven = 0;
		var totalDmgTaken = 0;

		$.each(newValue, function (i, e) {
			if (typeof e.damage !== 'number') return;

			if (e.type == "health-mod")
				totalDmgTaken += e.damage;
			else
				totalDmgGiven += e.damage;

			if (e.type == "threat" || e.type == "success")
				self.isApproximating(true);
		});

		self.totalDamageTaken(totalDmgTaken);
		self.totalDamageGiven(totalDmgGiven);

		self.averageDamageGiven((totalDmgGiven / self.monsterCount()).toFixed(2));
		self.averageDamageTaken((totalDmgTaken / self.monsterCount()).toFixed(2));
	});

	self.formatAverageDamageGiven = ko.computed(function () {
		return (self.isApproximating() ? "~" : "") + self.averageDamageGiven() + "/monster";
	});

	self.formatAverageDamageTaken = ko.computed(function () {
		return (self.isApproximating() ? "~" : "") + self.averageDamageTaken() + "/monster";
	});

};

var statsModel;

function initializeStatistics() {
	statsModel = new StatisticsModel();
	ko.applyBindings(statsModel, $("#statisticsModal")[0]);
}