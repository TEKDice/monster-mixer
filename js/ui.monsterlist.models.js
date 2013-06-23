

var MonsterListModel = function () {
	var self = this;

	self.monsters = ko.observable({});

	self.getMonster = function(uid) {
		return self.monsters()[uid];
	};

	self.addMonster = function (uid, monster) {
		var monsters = self.monsters();
		if (!monsters) monsters = {};
		monsters[uid] = monster;
		self.monsters(monsters);
	};

	self.allMonsters = function () {
		return self.monsters();
	};
};

var monsters;

function initializeMonsterModel() {
	monsters = new MonsterListModel();
}