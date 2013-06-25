

var MonsterListModel = function () {
	var self = this;

	self.monsters = ko.observable({});

	self.getMonster = function(uid) {
		return self.monsters()[uid];
	};

	self.currentMonsterId = ko.observable();

	self.addMonster = function (uid, monster) {
		var monsters = self.monsters();
		if (!monsters) monsters = {};
		monsters[uid] = monster;
		self.monsters(monsters);
	};

	self.allMonsters = function () {
		return self.monsters();
	};

	self.toArray = ko.computed(function () {
		var monsterObj = self.monsters();

		var array = [];

		for (var key in monsterObj) {
			array.push(monsterObj[key]);
		}

		return array;
	});

	self.currentMonster = ko.computed(function () {
		return self.getMonster(self.currentMonsterId());
	});

};

var monsters;

//why? because javascript said so.
var monsterList;

function initializeMonsterModel() {
	monsterList = monsters = new MonsterListModel();
	ko.applyBindings(monsterList, $("#monsterListCont")[0]);
}