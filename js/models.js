var MonsterModel = function(uid, data) {
	var self = this;

	console.log(data);

	//store the monster data here
	//self.monsterData = data;
	self.monsterBaseStats = data.data[0];

	self.uid = uid;

	//statmodel
	self.stats = {
		str:	new StatModel(self.monsterBaseStats['str']),
		dex:	new StatModel(self.monsterBaseStats['dex']),
		con:	new StatModel(self.monsterBaseStats['con']),
		wis:	new StatModel(self.monsterBaseStats['wis']),
		int:	new StatModel(self.monsterBaseStats['int']),
		cha:	new StatModel(self.monsterBaseStats['cha']),
		fort:	new StatModel(self.monsterBaseStats['fort']),
		ref:	new StatModel(self.monsterBaseStats['ref']),
		will:	new StatModel(self.monsterBaseStats['will']),
		grapple:new StatModel(self.monsterBaseStats['grapple']),
		bab:	new StatModel(self.monsterBaseStats['base_atk']),
		cmd:	new StatModel(self.monsterBaseStats['cmd']),
		cmb:	new StatModel(self.monsterBaseStats['cmb']),

		reach:	  self.monsterBaseStats['reach'],
		space:	  self.monsterBaseStats['space_taken'],
		treasure: self.monsterBaseStats['treasure'],

		size:	ko.observable(self.monsterBaseStats.size)
	};

	self.skills = new SkillModel(data.mskill);

	self.reductions = new DRModel(data.mdmgred);

	self.qualities = new QualityModel(data.mqualit, self.monsterBaseStats.name);

	self.feats = new FeatModel(data.mfeat);

	self.armor = new ArmorModel(data.marmor);

	self.spatks = new SpecialAttackModel(data.mspatk, self.monsterBaseStats.name);

	self.weapons = new WeaponAttackModel(data.mweapon, self.monsterBaseStats.name);

	self.attacks = new WeaponAttackModel(data.mattack, self.monsterBaseStats.name);

	self.initiative = new InitiativeModel(self.stats.dex);

	self.hp = new HPModel(self.monsterBaseStats.hit_dice, self.stats.con, self.uid);

	self.speeds = new SpeedModel(data.mmove);

	self.fatks = new FullAttackModel(data.mfatk);
	
	self.ac = new ACModel(self, {
		"Natural AC": parseInt(self.monsterBaseStats.natural_ac),
		"Base": 10,
		"DEX Bonus": self.stats.dex.bonus(),
		"Size Mod": _getSizeModifier(self.stats.size())
	});

	self.formatCR = function (cr) {
		return parseInt(cr);
	};
}

function ACModel(monsterModel, props) {
	var self = this;

	self.sizeBonus = ko.observable(_getSizeModifier(monsterModel.stats.size()));
	self.dex = ko.observable(monsterModel.stats.dex.bonus());

	monsterModel.stats.size.subscribe(function (newValue) {
		self.sizeBonus(_getSizeModifier(newValue));
		self.arrayProps()["Size Mod"] = self.sizeBonus();
	});

	monsterModel.stats.dex.bonus.subscribe(function (newValue) {
		self.dex(newValue);
		self.arrayProps()["DEX Bonus"] = self.dex();
	});

	self.arrayProps = ko.observable(props);

	self.flatfoot = new ArrayValueCountModel(monsterModel.uid + "_flatfoot_ac", self, []);
	self.touch =	new ArrayValueCountModel(monsterModel.uid + "_touch_ac", self, ["Natural AC"]);
	self.total =	new ArrayValueCountModel(monsterModel.uid + "_ac", self, []);
}

function HPModel(hpRoll, conModel, uid) {
	var self = this;

	self.hp = ko.observable(new RollableNumberModel(hpRoll));
	self.con = ko.observable(conModel.bonus());
	self.mod = ko.observable(new ModifiableNumberModel(0));
	self.uid = uid;

	conModel.bonus.subscribe(function (newValue) {
		self.con(newValue);
	});

	self.total = ko.computed(function () {
		return self.hp().num().val() + self.mod().val();
	});

	self.initTotal = ko.computed(function () {
		return self.hp().num().val();
	});

	self.toolTip = ko.computed(function () {
		var curHp = self.hp().num().val();
		var modHp = self.mod().val();
		var retStr = "Base (" + hpRoll + "): " + curHp;
		if (modHp != 0) retStr += "<br>Modification: " + modHp;

		//hack for dynamic tooltip text
		$$(uid + "_hp").attr('data-original-title', retStr);
		return retStr;
	});
}

function FullAttackModel(fatks) {
	var self = this;

	if (fatks.length == 0) fatks.push({ "0": { aname: "None" }});

	self.fatks = ko.observableArray(fatks);

	self.formatName = function (fatk) {
		var retStr = [];
		$.each(fatk, function (i, e) {
			retStr.push(e.aname || e.wname);
		});
		return retStr.join(", ");
	};

	self.toolTip = function (fatk) {
		var retStr = '';
		$.each(fatk, function (i, e) {
			var atkStr = e.aname || e.wname;
			atkStr += ': ';
			var rollStr = e.hitdc;
			var eleStr = (rollStr == '0' ? '' : '+') + e.dmgred_hd + ' ' + e.dmgname;
			var count = e.whm || e.atkhm;

			if (rollStr != '0') atkStr += rollStr + "x" + count + " ";
			if (e.dmgname != null) atkStr += eleStr;
			atkStr += "<br />";
			retStr += atkStr;
		});
		return retStr;
	};
}

function InitiativeModel(dexModel) {
	var self = this;
	self.init = new RollableNumberModel('1d20');
	self.dex = ko.observable(dexModel.bonus());

	self.toolTip = ko.computed(function () {
		var retStr = "Base (1d20): "+self.init.num().val();
		if (self.dex != 0) retStr+= ("<br>DEX: " + self.dex());
		return retStr;
	});

	dexModel.bonus.subscribe(function (newValue) {
		self.dex(newValue);
	});

	self.totalInit = ko.computed(function () {
		return self.init.num().val()+self.dex();
	});
}

function WeaponAttackModel(damagers, mname) {
	var self = this;

	if (damagers.length == 0) damagers.push({ name: "None", descript: "", hit_dice: '0' });

	self.mname = mname;
	self.damagers = ko.observableArray(damagers);

	self.countColumns = function (spatk) {
		var cols = 3;
		if (spatk.hitdc != '0') cols--;
		if (spatk.dmgname != null) cols--;
		return cols;
	};

	self.formatElemental = function (spatk) {
		var retStr = '';
		if (spatk.hitdc != '0') retStr = '+';
		retStr += spatk.dmgred_hd + " ";
		retStr += spatk.dmgname;
		return retStr;
	};

	self.formatName = function (name) {
		if (name == undefined) return "ERROR";
		if (name.indexOf(mname) != -1) return name.substring(mname.length);
		return name;
	};
}

function SpeedModel(speeds) {
	var self = this;
	this.speeds = ko.observableArray(speeds);
}

function SpecialAttackModel(spatks, mname) {
	var self = this;

	if (spatks.length == 0) spatks.push({ name: "None", descript: "", hit_dice:'0' });

	self.mname = mname;
	self.spatks = ko.observableArray(spatks);

	self.countColumns = function (spatk) {
		var cols = 3;
		if (spatk.hit_dice != '0') cols--;
		if (spatk.dmgred_nm != null) cols--;
		return cols;
	};

	self.formatElemental = function(spatk) {
		var retStr = '';
		if(spatk.hit_dice != '0') retStr='+';
		retStr += spatk.dmgred_hd + " ";
		retStr += spatk.dmgred_nm;
		return retStr;
	};

	self.formatName = function (name) {
		if (name.indexOf(mname) != -1) return name.substring(mname.length);
		return name;
	};
}

function ArmorModel(armors) {
	var self = this;

	if (armors.length == 0) armors.push({ name: "None", descript: "" });

	this.armors = ko.observableArray(armors);
}

function StatModel(base) {
	if (typeof base !== "number") base = parseInt(base);
	var self = this;
	self.base = new ModifiableNumberModel(base);
	self.bonus = ko.computed(function() {
		return getBonus(self.base.val());
	});
	self.format = ko.computed(function () {
		if (self.base.val() == 0) return "--";
		var bonus = self.bonus();
		if (bonus == 0) return self.base.val();

		if (bonus > 0) bonus = "+" + bonus;
		return self.base.val() + " " + "(" + bonus + ")";
	});
}

function ArrayValueCountModel(tag, model, filterProps) {
	var self = this;
	
	self.tag = tag;
	self.ignored = filterProps;
	self.kvs = ko.observable(model.arrayProps);

	self.sum = ko.computed(function () {
		var sum = 0;

		$.each(self.kvs()(), function (k, v) {
			if ($.inArray(k, self.ignored) == -1) {
				if (typeof v !== 'number') sum += v();
				else sum += v;
			}
		});

		return sum;
	});

	self.toolTip = ko.computed(function () {

		var retStr = '';
		$.each(self.kvs()(), function (i, e) {
			if ($.inArray(i, self.ignored) == -1 && e != 0)
				retStr += i + ": " + e+"<br>";
		});

		$$(tag).attr('data-original-title', retStr);
		return retStr;

	});
}

function SkillModel(skills) {
	var self = this;

	if (skills.length == 0) skills.push({ name: "None", sub_skill: "", descript: "", skill_level: 0 });

	self.skills = ko.observableArray(skills);

	self.formatName = function (skill) {
		if (skill.sub_skill != "" && skill.sub_skill != null) return skill.name + " (" + skill.sub_skill + ")";
		return skill.name;
	};
	self.formatNum = function (skill) {
		if (skill.skill_level == 0) return "";
		if (skill.skill_level > 0) return "+" + skill.skill_level;
		return skill.skill_level;
	};
}

function FeatModel(feats) {
	var self = this;

	if (feats.length == 0) feats.push({ name: "None", descript: "" });

	this.feats = ko.observableArray(feats);

	//TODO count entries and show none if there are "no" entries (that grapple feat is not counted)

	self.format = function (name) {
		return name;
	};
}

function QualityModel(qualities, mname) {
	var self = this;

	if (qualities.length == 0) qualities.push({ name: "None", descript: "" });

	self.mname = mname;
	self.qualities = ko.observableArray(qualities);

	self.isMeasurable = function(name) {
		return name != 'Spell Resistance' && name != "Regeneration" && name != "Turn Resistance";
	};
	self.format = function (qual) {
		return qual.value + (self.isMeasurable(qual.name) ? "ft" : "");
	};
	self.formatName = function (name) {
		if (name.indexOf(mname) != -1) return name.substring(mname.length);
		return name;
	};
}

function DRModel(reductions) {
	var self = this;

	if (reductions.length == 0) reductions.push({ name: "None", reduction_amount: -1 });

	self.dr = ko.observableArray(reductions);
	self.format = function(val) {
		return val == '0' || val == 0 ? "Immune" : (val == -1 ? '' : val);
	};
}

function KVModel(kv) {
	var self = this;
	self.array = ko.observableArray(kv);
}

function RollableNumberModel(baseRoll) {
	var self = this;
	self.rollStr = baseRoll;
	self.num = ko.observable(new ModifiableNumberModel(roll(self.rollStr)));

	self.reroll = function () {
		self.num(new ModifiableNumberModel(roll(self.rollStr)));
	};
}

function ModifiableNumberModel(baseVal) {
	var self = this;
	self.init = baseVal;
	self.val = ko.observable(baseVal);

	self.reset = function () {
		self.val(self.init);
	};

	self.resetToVal = function (offset) {
		self.val(self.init);
		self.relative(offset);
	};

	self.increment = function () {
		self.val(self.val()+1);
	};
	self.decrement = function () {
		self.val(self.val()-1);
	};
	self.relative = function (num) {
		self.val(self.val()+num);
	}
	self.absolute = function (num) {
		self.val(num);
	}
}

ko.bindingHandlers.bootstrapTooltip = {
	init: function (element, valueAccessor, allBindingAccessor, viewModel) {
		var options = ko.utils.unwrapObservable(valueAccessor());
		var defaultOptions = {};
		options = $.extend(true, {}, defaultOptions, options);
		$(element).tooltip(options);

		$(element).click(function () {

			var $me = $(this);
			var doShow = true;

			$(".in").each(function () {
				if ($(this).siblings("a").is($me)) {
					doShow = false;
				}
				$(this).siblings("a").tooltip('hide');

			});
			if (doShow)
				$(this).tooltip('show');
		});
	}
};